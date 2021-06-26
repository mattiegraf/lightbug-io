var playerbug;
var pelletManager;
var lightbugManager;
var lightManager;
var text;

var botbugs;
var boundary;
var shadowTexture;
var shadowSprite;

var wKey;
//var eKey;

var LIGHT_RADIUS = 100;
var ORIGINAL_WORLD_WIDTH = 8000;
var ORIGINAL_WORLD_HEIGHT = 8000;


var Game = {
    

    preload: function(){
        game.load.image('ground', 'assets/cavefloor.png');
        game.load.image('sball', 'assets/sball.png')
        game.load.image('firefly', 'assets/firefly.png');
        game.load.physics('firefly_physics', 'assets/firefly_physics.json');
    },

    create: function(){
        let randomPointinBounds;
        //world size
        game.world.setBounds(0, 0, ORIGINAL_WORLD_WIDTH, ORIGINAL_WORLD_HEIGHT);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

        //enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        //game.physics.p2.restitution = 0.8;

        //turn on impact events for the world for collision callbacks
        game.physics.p2.setImpactEvents(true);

        //background
        //var background = game.add.tileSprite(0, 0, 4000, 4000, 'ground');
        game.stage.backgroundColor = 0x4488cc;

        boundary = new Boundary(game);

        pelletManager = new PelletManager(game);
        lightbugManager = new LightbugManager(game);
        lightManager = new LightManager(game);

        pelletManager.setCollidesWith([pelletManager.collisionGroup, lightbugManager.collisionGroup]);
        lightbugManager.setCollidesWith([[pelletManager.collisionGroup, LightbugManager.hitPellet],
            [lightbugManager.collisionGroup, undefined], [lightManager.collisionGroup, LightbugManager.hitLight]]);
        lightManager.setCollidesWith([lightManager.collisionGroup, lightbugManager.collisionGroup]);

        randomPointinBounds = boundary.randomPointWithinBoundary();
        playerbug = lightbugManager.createLightbug(randomPointinBounds.x, randomPointinBounds.y, "YOU");
        playerbug = new Playerbug(game, playerbug);

        game.camera.follow(playerbug.player);

        pelletManager.generatePellets(PelletManager.maxPelletCount(), 10);

        // !!! make a loop to handle AI generation here
        randomPointinBounds = boundary.randomPointWithinBoundary();
        botbugs = [];

        //console.log(game.scale.width);
        //console.log(window.innerWidth);
        shadowTexture = game.add.bitmapData(window.screen.width, window.screen.height);

        // Create an object that will use the bitmap as a texture
        shadowSprite = game.add.image(game.camera.x, game.camera.y, shadowTexture);

        // Set the blend mode to MULTIPLY. This will darken the colors of
        // everything below this sprite.
        shadowSprite.blendMode = Phaser.blendModes.MULTIPLY;
        shadowSprite.fixedToCamera = true;

        //pellets collected
        text = game.add.text(0, 0, "pellets hit: 0", { font: "65px Arial", fill: "#ff0044", align: "center" });
        text.fixedToCamera = true;

        wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.onDown.add(function(){lightManager.createLight(playerbug.player);});

        //eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        //eKey.onDown.add(function(){Game.scaleTest();});
    },

    update: function(){
        let i;
        let randomPointinBounds;
        let botbug;

        pelletManager.rewardConsumers();
        if(botbugs.length < Botbug.maxBotCount()){
            randomPointinBounds = boundary.randomPointWithinBoundary();
            botbug = lightbugManager.createLightbug(randomPointinBounds.x, randomPointinBounds.y, "bot");
            botbugs.push(new Botbug(game, botbug, pelletManager));
        }
        pelletManager.generatePellets(PelletManager.maxPelletCount() - pelletManager.aliveCount(), 10);

        playerbug.move();
        for(i=0; i < botbugs.length; i++){
            if(botbugs[i].bot.alive){
                botbugs[i].act();
            }
        }

        pelletManager.killOutOfBoundPellets();
        lightbugManager.killOutOfBoundBugs();

        lightManager.update();

        this.updateShadowTexture();
        this.updateText();
    },

    updateShadowTexture: function(){
        shadowSprite.reset(game.camera.x, game.camera.y);
        // This function updates the shadow texture (this.shadowTexture).
        // First, it fills the entire texture with a dark shadow color.
        // Then it draws a white circle centered on the pointer position.
        // Because the texture is drawn to the screen using the MULTIPLY
        // blend mode, the dark areas of the texture make all of the colors
        // underneath it darker, while the white area is unaffected.

        // Draw shadow
        shadowTexture.context.fillStyle = 'rgb(50, 50, 50)';
        shadowTexture.context.fillRect(0, 0, game.width, game.height);

        // Draw circle of light

        lightbugManager.drawBugLights();
        lightManager.drawLights();
        /*shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
        shadowTexture.context.arc(playerbug.player.x - game.camera.x, playerbug.player.y - game.camera.y,
            LIGHT_RADIUS * playerbug.player.scale.x, 0, Math.PI*2);
        shadowTexture.context.fill();*/

        // This just tells the engine it should update the texture cache
        shadowTexture.dirty = true;
    },

    updateText: function(){
        text.setText("points: " + playerbug.player.points);
    }

    /*scaleTest: function(){

    }*/
};
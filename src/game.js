var pelletManager;
var lightbugManager;
var lightManager;

var playerbug;
var botbugs;
var boundary;
var shadowTexture;
var shadowSprite;

var textPanel;
var textTitle;
var textList;
var textRemaining;

var ORIGINAL_WORLD_WIDTH = 8000;
var ORIGINAL_WORLD_HEIGHT = 8000;
var CAMERA_MIN = 0.321;

var continueRespawning;
var respawnTimer;
var totalTime;
var victory;

var Game = {
    

    preload: function(){
        game.load.image('ground', 'assets/cgshare-book-grass-003.jpg');
        game.load.image('firefly', 'assets/firefly3.png');
    },

    create: function(){
        let randomPointinBounds;

        game.world.setBounds(0, 0, ORIGINAL_WORLD_WIDTH, ORIGINAL_WORLD_HEIGHT);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

        // prevent right click from opening a context menu while clicking the game
        game.canvas.oncontextmenu = (e) => {e.preventDefault();};

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        game.add.tileSprite(0, 0, ORIGINAL_WORLD_WIDTH, ORIGINAL_WORLD_HEIGHT, 'ground');
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

        randomPointinBounds = boundary.randomPointWithinBoundary();
        botbugs = [];

        shadowTexture = game.add.bitmapData(window.screen.width, window.screen.height);
        shadowSprite = game.add.image(game.camera.x, game.camera.y, shadowTexture);
        shadowSprite.blendMode = Phaser.blendModes.MULTIPLY;
        shadowSprite.fixedToCamera = true;

        // UI
        textPanel = this.game.add.graphics();
        textPanel.lineStyle(2, "#ffffff", 1);
        textPanel.beginFill("#ffffff", .4);
        textPanel.drawRoundedRect(10, 10, 300, 300, 7);
        textPanel.endFill();
        textPanel.fixedToCamera = true;        

        textTitle = game.add.text(20, 20, "Leaderboard", { font: "bold 24px Arial", fill: "#ff0044", align: "center" });
        textTitle.fixedToCamera = true;

        textList = game.add.text(20, 70, "", { font: "18px Arial", fill: "#ff0044", align: "left", tabs: [40, 80] });
        textList.fixedToCamera = true;

        textRemaining = game.add.text(20, 250, "", { font: "18px Arial", fill: "#ff0044", align: "left" });
        textRemaining.fixedToCamera = true;

        // setting right click ability callback
        game.input.onDown.add(function(){if(game.input.activePointer.rightButton.isDown){lightManager.createLight(playerbug.player)}});

        totalTime = 0;
        continueRespawning = true;
        respawnTimer = game.time.create(false);
        respawnTimer.add(Phaser.Timer.MINUTE * 3, () => {continueRespawning = false;});
        respawnTimer.start();

        victory = false;
    },

    update: function(){
        let i;
        let randomPointinBounds;
        let botbug;

        pelletManager.rewardConsumers();

        // bot respawn loop
        if((lightbugManager.getNumberAlive() < Botbug.maxBotCount() + 1) && continueRespawning){
            randomPointinBounds = boundary.randomPointWithinBoundary();
            if(lightbugManager.getNumberAlive() < botbugs.length + 1){
                lightbugManager.reviveBug(randomPointinBounds.x, randomPointinBounds.y);
            }
            else{
                botbug = lightbugManager.createLightbug(randomPointinBounds.x, randomPointinBounds.y, "bot");
                botbugs.push(new Botbug(game, botbug, pelletManager));
            }
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

        this.victoryCheck();
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

        // Draw circles of light
        lightbugManager.drawBugLights();
        lightManager.drawLights();

        // This just tells the engine it should update the texture cache
        shadowTexture.dirty = true;
    },

    updateText: function(){
        let leaderboard = lightbugManager.getTopFive();
        textList.parseList(leaderboard);
        textRemaining.setText("Players Remaining: " + lightbugManager.getNumberAlive() + "\nTime Remaining: " + this.formatTime(respawnTimer.duration.toFixed(0)));
    },

    victoryCheck(){
        if(lightbugManager.getNumberAlive() === 1 && playerbug.player.alive && !continueRespawning){
            victory = true;
            totalTime = respawnTimer.ms;
            game.camera.scale.x = 1;
            game.camera.scale.y = 1;
            game.state.start('GameOver');
        }
    },

    // display time in m:s remaining format
    formatTime(ms){
        let min = Math.floor(ms / Phaser.Timer.MINUTE);
        ms = ms - (Phaser.Timer.MINUTE * min);

        let s =  Math.floor(ms / Phaser.Timer.SECOND);
        if(s < 10){
            s = "0" + s;
        }
        return min + ":" + s;
    }
};
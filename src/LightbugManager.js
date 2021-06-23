class LightbugManager{
    constructor(game, collidesWith){

        //needs param:
        //  game

        //needs to create/receive:
        //  group
        //  collisionGroup
        //  who it collides with and their callbacks - an array of arrays
        //formatted like [[collision group, callback]....]
        //normally the collides function can take more than one element with a callback, but this makes my life easier

        this.game = game;

        this.collisionGroup = game.physics.p2.createCollisionGroup();
        //this makes the groups collide with the world bounds
        game.physics.p2.updateBoundsCollisionGroup();

        this.group = game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.P2JS;
        this.collidesWith = collidesWith;

        this.bugDefaultScaling = 3;
    }

    setCollidesWith(collidesWith){
        this.collidesWith = collidesWith;
    }

    static hitPellet(bugBody, pelletBody){
        //for callback, first param is the one being collided with, second is the collider
        pelletBody.sprite.eatenBy = bugBody.sprite;
        pelletBody.sprite.kill();        
    }

    static hitLight(bugBody, lightBody){
        //for callback, first param is the one being collided with, second is the collider
        if(lightBody.sprite.attacker !== bugBody.sprite){
            let radius = bugBody.sprite.width / 2;
            let points = bugBody.sprite.points;
            bugBody.sprite.kill();
            lightBody.sprite.kill();
            pelletManager.generatePelletsOnDeath(points, 10, bugBody.x, bugBody.y, radius);
        }
        //pelletBody.sprite.eatenBy = bugBody.sprite;
        //pelletBody.sprite.kill();        
    }

    createLightbug(x, y, name){
        var i;
        let lightbug = this.group.create(x, y, 'firefly');
        lightbug.anchor.setTo(.5);

        //player physics body
        //game.physics.p2.enable(player, true); //!!! true on for debug only
        lightbug.scale.set(this.bugDefaultScaling);
        lightbug.body.setCircle(lightbug.width/2);
        game.debug.body(lightbug);    
        
        lightbug.body.setCollisionGroup(this.collisionGroup);
        for(i=0; i < this.collidesWith.length; i++){
            lightbug.body.collides(this.collidesWith[i][0], this.collidesWith[i][1]);
        }
        lightbug.points = 0;
        lightbug.name = name;
       
        return lightbug;
    }

    resize(bug){
        var i;
        if(bug.points < 0){
            bug.points = 0;
        }

        if(bug === playerbug.player){
            game.camera.scale.x = 1 / (1 + (playerbug.player.points * .01));
            game.camera.scale.y = 1 / (1 + (playerbug.player.points * .01));
            shadowSprite.scale.x = 1 / game.camera.scale.x;
            shadowSprite.scale.y = 1 / game.camera.scale.y;
        }

        let scaleBy = this.bugDefaultScaling + (bug.points * .01 * this.bugDefaultScaling);
        
        bug.scale.set(scaleBy);
        bug.body.clearShapes();
        bug.body.setCircle(bug.width/2);
        bug.body.setCollisionGroup(this.collisionGroup);
        for(i=0; i < this.collidesWith.length; i++){
            bug.body.collides(this.collidesWith[i][0], this.collidesWith[i][1]);
        }
        
    }

    //how points affect size
    static pointsToSize(points){
        return 0;
    }

    killOutOfBoundBugs(){
        this.group.forEachAlive(this.killOutOfBoundBugsHelper);
    }

    killOutOfBoundBugsHelper(bug){
        if(!boundary.contains(bug)){
            bug.kill();
            if(bug === playerbug.player){
                game.camera.scale.x = 1;
                game.camera.scale.y = 1;
                game.state.start('GameOver');
            }
        }
    }

    drawBugLights(){
        this.group.forEachAlive(this.drawBugLight);
    }

    drawBugLight(bug){
        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
        shadowTexture.context.arc(bug.worldPosition.x, bug.worldPosition.y,
            LIGHT_RADIUS * bug.scale.x, 0, Math.PI*2);
        shadowTexture.context.fill();
    }

}
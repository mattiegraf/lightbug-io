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

        this.bugDefaultScaling = 0.25;
        this.LIGHT_RADIUS = 400;
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

            if(bugBody.sprite === playerbug.player){
                game.camera.scale.x = 1;
                game.camera.scale.y = 1;
                totalTime = respawnTimer.ms;
                game.state.start('GameOver');
            }
        }       
    }

    createLightbug(x, y, name){
        let i;
        let lightbug = this.group.create(x, y, 'firefly');
        lightbug.anchor.setTo(.5);

        lightbug.scale.set(this.bugDefaultScaling);
        lightbug.body.setCircle((lightbug.width/2) - (lightbug.scale.x * 20));
        
        lightbug.body.setCollisionGroup(this.collisionGroup);
        for(i=0; i < this.collidesWith.length; i++){
            lightbug.body.collides(this.collidesWith[i][0], this.collidesWith[i][1]);
        }
        lightbug.points = 0;
        lightbug.name = name;
       
        return lightbug;
    }

    // revive a dead bug
    // used when possible to avoid loading in sprite (slow!) unnecessarily
    reviveBug(x, y){
        let i;
        let firstDead = this.group.getFirstDead();
        if(firstDead){
            firstDead.reset(x, y);
            firstDead.points = 0;
            firstDead.scale.set(this.bugDefaultScaling);

            firstDead.body.clearShapes();
            firstDead.body.setCircle((firstDead.width/2) - (firstDead.scale.x * 20));
            firstDead.body.setCollisionGroup(this.collisionGroup);
            for(i=0; i < this.collidesWith.length; i++){
                firstDead.body.collides(this.collidesWith[i][0], this.collidesWith[i][1]);
            }
        }
    }

    resize(bug){
        let i;
        if(bug.points < 0){
            bug.points = 0;
        }

        // gives the effect that the player doens't grow, everything around it gets smaller by changing camera scale
        // text elements remain same size
        if(bug === playerbug.player && (1 / (1 + (playerbug.player.points * .01))) > CAMERA_MIN){
            game.camera.scale.x = 1 / (1 + (playerbug.player.points * .01));
            game.camera.scale.y = 1 / (1 + (playerbug.player.points * .01));
            shadowSprite.scale.x = 1 / game.camera.scale.x;
            shadowSprite.scale.y = 1 / game.camera.scale.y;

            textPanel.scale.x = 1 / game.camera.scale.x;
            textPanel.scale.y = 1 / game.camera.scale.y;
            textTitle.scale.x = 1 / game.camera.scale.x;
            textTitle.scale.y = 1 / game.camera.scale.y;
            textList.scale.x = 1 / game.camera.scale.x;
            textList.scale.y = 1 / game.camera.scale.y;
            textRemaining.scale.x = 1 / game.camera.scale.x;
            textRemaining.scale.y = 1 / game.camera.scale.y;
        }

        let scaleBy = this.bugDefaultScaling + (bug.points * .01 * this.bugDefaultScaling);
        
        bug.scale.set(scaleBy);
        bug.body.clearShapes();
        bug.body.setCircle((bug.width/2) - (bug.scale.x * 20));
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
        if(!boundary.outerContains(bug)){
            bug.kill();
            if(bug === playerbug.player){
                game.camera.scale.x = 1;
                game.camera.scale.y = 1;
                totalTime = respawnTimer.ms;
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
            lightbugManager.LIGHT_RADIUS * bug.scale.x * game.camera.scale.x, 0, Math.PI*2);
        shadowTexture.context.fill();
    }

    // gets closest bug that isn't the same object. returns a lightbug or undefined.
    getClosestBugLocation(bug){
        let closestBug;
        let closestDistance;
        let i;

        for(i = 0; i < this.group.children.length; i++){
            if(this.group.children[i] !== bug && this.group.children[i].alive){
                //find distance
                let distance;
                let a = bug.x - this.group.children[i].x;
                let b = bug.y - this.group.children[i].y;
                distance = Math.sqrt( a*a + b*b );
                if(closestDistance === undefined || distance < closestDistance){
                    closestBug = this.group.children[i];
                    closestDistance = distance;
                }
            }
        }

        if(closestBug === undefined){
            return undefined;
        }
        else{
            return new Phaser.Point(closestBug.x, closestBug.y);
        }
    }

    // returns an array of 5 lightbugs with the most points, or 6 lightbugs with the player being the last
    // if the player is not in the top 5, so that the user is aware of their score
    getTopFive(){
        let i;
        let j;
        let leaderboard = [];
        let playerInList = false;
        let playerRank = 1;
        this.group.sort("points", Phaser.Group.SORT_DESCENDING);
        for(i = 0; i < this.group.children.length && leaderboard.length < 5; i++){
            if(this.group.children[i].alive){
                if(this.group.children[i] === playerbug.player){
                    playerInList = true;
                }
                leaderboard.push(["#" + (leaderboard.length + 1), this.group.children[i].name, this.group.children[i].points]);
            }
        }

        if(!playerInList){
            for(i = 0; i < this.group.children.length && this.group.children[i] !== playerbug.player; i++){
                if(this.group.children[i].alive){
                    playerRank++;
                }
            }
            leaderboard.push(["#" + playerRank, playerbug.player.name, playerbug.player.points]);
        }

        return leaderboard;
    }

    getNumberAlive(){
        return this.group.countLiving();
    }
}
class PelletManager{
    constructor(game, collidesWith){
        //needs param:
        //  game

        //needs to create/receive:
        //  group
        //  collisionGroup
        //  who it collides with

        this.game = game;

        this.collisionGroup = game.physics.p2.createCollisionGroup();
        //this makes the groups collide with the world bounds
        game.physics.p2.updateBoundsCollisionGroup();

        this.group = game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.P2JS;
        this.collidesWith = collidesWith;
    }

    //so that if this is not set intially it can be reset later.
    setCollidesWith(collidesWith){
        this.collidesWith = collidesWith;
    }

    createPellet(radius, colour, x, y){

        //random colour, position handling
        //no random radius allowed
        if(colour === 'RAND' || colour === undefined){
           colour = Phaser.Color.getRandomColor();
        }
        if(x === 'RAND' || x === undefined){
            x = this.game.world.randomX;
        }
        if(y === 'RAND' || y === undefined){
            y = this.game.world.randomY;
        }

        let pGraphic = this.game.add.graphics();
        pGraphic.lineStyle(2, colour, 1);
        pGraphic.beginFill(colour, 1);
        pGraphic.drawCircle(x, y, radius*2);
        pGraphic.endFill();
        let pSprite = this.group.create(x, y, pGraphic.generateTexture());

        pGraphic.destroy();
        pSprite.body.setCircle(radius);
        
        pSprite.body.setCollisionGroup(this.collisionGroup);
        pSprite.body.collides(this.collidesWith);
    }

    generatePellets(number, size){
        let i;
        if(number < 0){
            return;
        }
        
        for(i = 0; i < number; i++){
            let point = boundary.randomPointWithinBoundary();
            let firstDead = this.group.getFirstDead();
            if(firstDead){
                firstDead.reset(point.x, point.y);
            }
            else{
                this.createPellet(size, 'RAND', point.x, point.y);
            }
        }

    }

    // lightbug drops all of its collected pellets on death
    generatePelletsOnDeath(number, size, x, y, radius){
        let i;
        if(number < 0){
            return;
        }
        
        for(i = 0; i < number; i++){
            let point = this.pointInsideDeathArea(radius, x, y);
            let firstDead = this.group.getFirstDead();
            if(firstDead){
                firstDead.reset(point.x, point.y);
            }
            else{
                this.createPellet(size, 'RAND', point.x, point.y);
            }
        }

    }

    pointInsideDeathArea(radius, x, y){
        return new Phaser.Point(this.getRandomInt(x - radius, x + radius), this.getRandomInt(y - radius, y + radius));
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    rewardConsumers(){
        this.group.forEachDead(this.rewardConsumersHelper);
    }

    rewardConsumersHelper(deadPellet){
        if(deadPellet.eatenBy !== undefined){
            let consumer = deadPellet.eatenBy;
            consumer.points += PelletManager.sizeToPoints(deadPellet.width);
            lightbugManager.resize(consumer);
            deadPellet.eatenBy = undefined;
        }
    }

    //given a pellet's width, determine how many points it is worth
    static sizeToPoints(width){
        return 1; // all pellets worth one currently
    }

    getClosestPelletLocation(obj){
        let closest = this.group.getClosestTo(obj);
        if(!closest){
            return undefined;
        }
        else{
            return new Phaser.Point(closest.x, closest.y);
        }
    }

    killOutOfBoundPellets(){
        this.group.forEachAlive(this.killOutOfBoundPelletsHelper);
    }

    killOutOfBoundPelletsHelper(pellet){
        if(!boundary.outerContains(pellet)){
            pellet.kill();
        }
    }

    static maxPelletCount(){
        return 100;
    }

    aliveCount(){
        return this.group.countLiving();
    }
}

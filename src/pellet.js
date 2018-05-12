//may change this into a PelletManager Class/Object later
//where one object contains all info related to pellets

//there is no point in making an object for each pellet as far as I can see

class Pellet{
    constructor(game, cWith){
        //needs param:
        //  game

        //needs to create/receive:
        //  group
        //  collisionGroup
        //  who it collides with

        this.game = game;

        this.cGroup = game.physics.p2.createCollisionGroup();
        //this makes the groups collide with the world bounds
        game.physics.p2.updateBoundsCollisionGroup();

        this.group = game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.P2JS;

        this.cWith = cWith;


    }

    //so that if this is not set intially it can be reset later.
    collidesWith(cWith){
        this.cWith = cWith;
    }

    createPellet(radius, colour, x, y){

        //random handling
        //no random radius allowed at current time
        if(colour == 'RAND' || colour == undefined){
           colour = Phaser.Color.getRandomColor();
        }
        if(x == 'RAND' || x == undefined){
            x = this.game.world.randomX;
        }
        if(y == 'RAND' || y == undefined){
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
        
        pSprite.body.setCollisionGroup(this.cGroup);
        pSprite.body.collides(this.cWith);
    }

    generatePellets(number, size){
        var i;
        for(i = 0; i < number; i++){
            this.createPellet(size);
        }

    }

    rewardConsumers(){
        this.group.forEachDead(this.rewardConsumersHelper);
    }

    rewardConsumersHelper(deadPellet){
        if(deadPellet.killedBy != undefined){
            //do stuff here
            deadPellet.killedBy = undefined;
        }
    }
}

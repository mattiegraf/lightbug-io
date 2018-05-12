class Lightbug{
    constructor(game, cWith){


        //needs param:
        //  game

        //needs to create/receive:
        //  group
        //  collisionGroup
        //  who it collides with and their callbacks - an array of arrays
        //formatted like [[collision group, callback]....]
        //normally the collides function can take more than one element with a callback, but this makes my life easier

        this.game = game;

        this.cGroup = game.physics.p2.createCollisionGroup();
        //this makes the groups collide with the world bounds
        game.physics.p2.updateBoundsCollisionGroup();

        this.group = game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.P2JS;

        this.cWith = cWith;

    }

    collidesWith(cWith){
        this.cWith = cWith;
    }

    static hitPellet(playerBody, pelletBody){
        //for callback, first param is the one being collided with, second is the collider
        if(!pelletBody.hasCollided){
            pelletBody.hasCollided = true;
            //!!! should be replaced with a more reliable method of assuring pelletHit only increments once in the future
            //i haven't had any issues with this but technically it is still not async safe (consider incrementing when
            //things are going to be destroyed)
            pelletBody.sprite.kill();
            pelletHit++;
            text.text = "pellets hit: " + pelletHit;
        }
        
    }

    createLightbug(x, y){
        var i;
        let lb = this.group.create(x, y, 'firefly');
        lb.anchor.setTo(.5);

        //player physics body
        //game.physics.p2.enable(player, true); //!!! true on for debug only
        lb.body.setCircle(50);    
        game.debug.body(lb);    
        
        lb.body.setCollisionGroup(this.cGroup);
        for(i=0; i < this.cWith.length; i++){
            lb.body.collides(this.cWith[i][0], this.cWith[i][1]);
        }
       
        return lb;
    }



}
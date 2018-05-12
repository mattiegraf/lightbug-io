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

    static hitPellet(bugBody, pelletBody){
        //for callback, first param is the one being collided with, second is the collider
        pelletBody.sprite.eatenBy = bugBody.sprite;
        pelletBody.sprite.kill();
        pelletHit++;
        text.text = "pellets hit: " + pelletHit;

        
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
        lb.points = 0;
       
        return lb;
    }

    resize(bug){
        var i;
        let scaleBy = 1;
        scaleBy += bug.points * .01;

        bug.scale.set(scaleBy);
        bug.body.clearShapes();
        bug.body.setCircle(bug.width/2);
        bug.body.setCollisionGroup(this.cGroup);
        for(i=0; i < this.cWith.length; i++){
            bug.body.collides(this.cWith[i][0], this.cWith[i][1]);
        }
        
    }

    //how points affect size
    static pointsToSize(points){
        return 0;
    }


}
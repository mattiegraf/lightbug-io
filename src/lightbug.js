class Lightbug{
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

    collidesWith(cWith){
        this.cWith = cWith;
    }

    createLightbug(x, y){
        let lb = this.group.create(x, y, 'firefly');
        lb.anchor.setTo(.5);

        //player physics body
        //game.physics.p2.enable(player, true); //!!! true on for debug only
        lb.body.setCircle(50);    
        game.debug.body(lb);    
        
        lb.body.setCollisionGroup(this.cGroup);
        lb.body.collides(this.cWith);
    }



}
class LightManager{
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
    }

    setCollidesWith(collidesWith){
        this.collidesWith = collidesWith;
    }

    static hitLightbug(lightBody, bugBody){
        //for callback, first param is the one being collided with, second is the collider
        //pelletBody.sprite.eatenBy = bugBody.sprite;
        //pelletBody.sprite.kill();        
    }

    createLight(bug){
        let colour = 0xFFFFFF;
        let radius = 11;

        let lightGraphic = this.game.add.graphics();
        lightGraphic.lineStyle(2, colour, 1);
        lightGraphic.beginFill(colour, 1);
        lightGraphic.drawCircle(bug.x, bug.y, radius*2);
        lightGraphic.endFill();
        let lightSprite = this.group.create(bug.x, bug.y, lightGraphic.generateTexture());

        lightGraphic.destroy();
        lightSprite.body.setCircle(radius);
        
        lightSprite.body.setCollisionGroup(this.collisionGroup);
        lightSprite.body.collides(this.collidesWith);
        lightSprite.attacker = bug;
    }

}
class Boundary{
    constructor(game){
        this.game = game;
        // circleGraphic boundary
        this.circleGraphic = this.game.add.graphics();
        this.circleGraphic.lineStyle(25, 0xFF0000, 1);
        //circleGraphic.beginFill(0xFF0000, 1);
        this.circleGraphic.drawCircle(this.game.world.centerX, this.game.world.centerY, this.game.world.bounds.width);
        
        this.circle = new Phaser.Circle(this.game.world.centerX, this.game.world.centerY, this.game.world.bounds.width);
    }

    contains(obj){
        return this.circle.contains(obj.x, obj.y);
    }

    randomPointWithinBoundary(){
        let point;
        do {
            point = new Phaser.Point(this.game.world.randomX, this.game.world.randomY);
        } while (!this.contains(point));
        
        return point;
    }
}
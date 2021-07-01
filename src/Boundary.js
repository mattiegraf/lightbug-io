class Boundary{
    constructor(game){
        this.game = game;
        
        // the visual boundary
        this.circleGraphic = this.game.add.graphics();
        this.circleGraphic.lineStyle(25, 0xFF0000, 1);
        this.circleGraphic.drawCircle(this.game.world.centerX, this.game.world.centerY, this.game.world.bounds.width);
        
        // outer boundary is the visible death circle that kills you if you go outside its bounds,
        // inner boundary is a slightly smaller invisible circle that game elements are spawned inside of, and AI is programmed to stay inside it
        this.outerBoundary = new Phaser.Circle(this.game.world.centerX, this.game.world.centerY, this.game.world.bounds.width);
        this.innerBoundary = new Phaser.Circle(this.game.world.centerX, this.game.world.centerY, this.game.world.bounds.width - 500);
    }

    outerContains(obj){
        return this.outerBoundary.contains(obj.x, obj.y);
    }

    innerContains(obj){
        return this.innerBoundary.contains(obj.x, obj.y);
    }

    randomPointWithinBoundary(){
        let point;
        do {
            point = new Phaser.Point(this.game.world.randomX, this.game.world.randomY);
        } while (!this.innerContains(point));
        
        return point;
    }
}
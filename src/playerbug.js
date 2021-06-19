class Playerbug{
    constructor(game, player){
        //to be done at a later date
        this.game = game;
        this.player = player;
    }

    move(){
        var angleChange = 5; //degrees for which the player will turn at per update
        //do not change angle if cursor is in body
        var point = new Phaser.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
        var bodies = this.game.physics.p2.hitTest(point, [this.player.body]);
        //console.log(bodies.length);
        if(!bodies.length){
            var bodyAngle;
            var difference;

            var cursorAngle =  this.game.math.radToDeg(this.game.math.angleBetween(
            this.player.worldPosition.x, this.player.worldPosition.y,
            this.game.input.mousePointer.x, this.game.input.mousePointer.y)) + 90;
            
            if(cursorAngle < 0){
                cursorAngle += 360;
            }

            bodyAngle = this.player.body.angle;

            if(bodyAngle < 0){
                bodyAngle += 360;
            }

            //determine the angle to rotate
            difference = cursorAngle - bodyAngle;
            if(difference < -180){
                difference += 360;
            } 
            if (difference > 180){
                difference -= 360;
            } 

            //apply the appropriate rotation
            if(difference < 0){
                if((difference * -1) > angleChange){
                    this.player.body.angle -= angleChange;
                }
                else{
                    this.player.body.angle += difference;
                }
            }
            else if(cursorAngle > 0){
                if(difference  > angleChange){
                    this.player.body.angle += angleChange;
                }
                else{
                    this.player.body.angle += difference;
                }
            }        
            
        }
        this.player.body.moveForward(200);
        

        //player.body.x = game.input.worldX;
        //player.body.y = game.input.worldY;
    }

}
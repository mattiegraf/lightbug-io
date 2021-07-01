class Playerbug{
    constructor(game, player){
        this.game = game;
        this.player = player;
        this.dashMeter = 50;
        this.DASHMAX = 50;
        this.cooldown = false;
    }

    move(){
        //do not change angle if cursor is in body
        let point = new Phaser.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
        let bodies = this.game.physics.p2.hitTest(point, [this.player.body]);
        if(!bodies.length){
            this.setOrientation();
        }
        this.player.body.moveForward(100);
        this.dash();
    }

    setOrientation(){
        let angleChange = 5;
        let bodyAngle;
        let difference;

        let cursorAngle =  this.game.math.radToDeg(this.game.math.angleBetween(
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

    dash(){
        if(this.game.input.activePointer.leftButton.isDown && this.dashMeter > 0  && !this.cooldown){
            this.player.body.thrust(50000);
            this.dashMeter--;
        }
        else if(this.game.input.activePointer.leftButton.isDown && this.dashMeter === 0 && !this.cooldown){
            this.cooldown = true;
        }
        else{
            if(this.dashMeter < this.DASHMAX){
                this.dashMeter++;
            }
            else{
                this.cooldown = false;
            }
        }
    }

}
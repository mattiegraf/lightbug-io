class Botbug{
    constructor(game, bot, pelletManager){
        // !!! just copy pasting lmao
        this.game = game;
        this.bot = bot;
        this.pelletManager = pelletManager;
    }

    determineMovementTarget(){
        // ugh god i have to code a game AI
        // I could make something simple for now, as I'm going to have to do other stuff,
        // like changing collision functions so the AI actually kills other bugs

        //first, think about states

        // so generally to be a successful bug, we want to:
        // 1 collect dots
        // 2 kill other bugs

        // determine target location based off of the closest "goal", so either a bug or a dot
        let target = this.pelletManager.getClosestPellet(this.bot);
        return target;
        
    }

    move(){
        let target = this.determineMovementTarget();
        if(!target){
            this.bot.body.moveForward(200);
            return;
        }

        var angleChange = 5; //degrees for which the bot will turn at per update
        //do not change angle if cursor is in body
        var point = new Phaser.Point(target.body.x, target.body.y);
        var bodies = this.game.physics.p2.hitTest(point, [this.bot.body]);
        //console.log(bodies.length);
        if(!bodies.length){
            var bodyAngle;
            var difference;

            var targetAngle =  this.game.math.radToDeg(this.game.math.angleBetween(
            this.bot.body.x, this.bot.body.y,
            target.body.x, target.body.y)) + 90;
            
            if(targetAngle < 0){
                targetAngle += 360;
            }

            bodyAngle = this.bot.body.angle;

            if(bodyAngle < 0){
                bodyAngle += 360;
            }

            //determine the angle to rotate
            difference = targetAngle - bodyAngle;
            if(difference < -180){
                difference += 360;
            } 
            if (difference > 180){
                difference -= 360;
            } 

            //apply the appropriate rotation
            if(difference < 0){
                if((difference * -1) > angleChange){
                    this.bot.body.angle -= angleChange;
                }
                else{
                    this.bot.body.angle += difference;
                }
            }
            else if(targetAngle > 0){
                if(difference  > angleChange){
                    this.bot.body.angle += angleChange;
                }
                else{
                    this.bot.body.angle += difference;
                }
            }        
            
        }
        this.bot.body.moveForward(200);
        

        //bot.body.x = game.input.worldX;
        //bot.body.y = game.input.worldY;
    }

    static maxBotCount(){
        return 10;
    }

}
class Botbug{
    constructor(game, bot, pelletManager){
        this.game = game;
        this.bot = bot;
        this.pelletManager = pelletManager;
        this.attack = false;
        this.dash = false;
        this.dashMeter = 50;
        this.DASHMAX = 50;
        this.cooldown = false;
    }

    act(){
        // movement determined by what is around the bot
        if(!boundary.innerContains(this.bot)){
            // if not in inner barrier, move back toward the center of the map, to avoid exiting the outer
            // barrier and dying
            this.moveTo(new Phaser.Point(this.game.world.centerX, this.game.world.centerY));
        }
        else if(this.dangerNearbyCheck()){
            this.flee(this.getClosestDangerLocation(this.bot));
        }
        else if(this.bot.points > 0 && this.preyNearbyCheck()){
            // pursue/attack if another bug is in range, and its able to fire light
            this.moveTo(lightbugManager.getClosestBugLocation(this.bot));
        }
        else{
            this.moveTo(this.pelletManager.getClosestPelletLocation(this.bot));
        }
    }

    // move toward a point
    // target: takes a Point or undefined
    moveTo(target){
        if(!target){
            this.bot.body.moveForward(200);
            return;
        }

        var bodies = this.game.physics.p2.hitTest(target, [this.bot.body]);
        if(!bodies.length){
            this.setOrientation(target, true);
        }
        // don't change angle if bot is hitting its target, creates a weird vibrating effect otherwise

        this.bot.body.moveForward(200);
    }

    //move away from target point
    // target: a Point or undefined
    flee(target){
        if(!target){
            this.bot.body.moveForward(200);
            return;
        }

        this.setOrientation(target, false);
        this.bot.body.moveForward(200);
    }

    // sets the new oreintation of the bug for this update cycle
    // pursueFlag will be true if the bot is chasing a target, false if it is fleeing
    setOrientation(target, pursueFlag){
        let angleChange = 5;
        let bodyAngle;
        let difference;

        let targetAngle =  this.game.math.radToDeg(this.game.math.angleBetween(
        this.bot.body.x, this.bot.body.y,
        target.x, target.y)) + 90;
        if(!pursueFlag){
            // moves targetAngle opposite to target, rather than to it
            targetAngle += 180;
        }
        
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

    static maxBotCount(){
        return 10;
    }

    dangerNearbyCheck(){
        let target = this.getClosestDangerLocation(this.bot);
        if(target === undefined){
            return false;
        }
        // now you need to check if it's in a circle/square around the bug, based on its scale
        let dangerRadius = new Phaser.Circle(this.bot.x, this.bot.y, 250 * this.bot.scale.x);
        return dangerRadius.contains(target.x, target.y);
    }

    getClosestDangerLocation(bug){
        let closestBug = lightbugManager.getClosestBugLocation(this.bot);
        let closestLight = lightManager.getClosestLightLocation(this.bot);
        if(!closestBug && !closestLight){
            return undefined;
        }
        else if(!closestLight){
            return closestBug;
        }
        else if(!closestBug){
            return closestLight;
        }
        else{
            let distanceBug;
            let distanceLight;
            let a;
            let b;

            a = bug.x - closestBug.x;
            b = bug.y - closestBug.y;
            distanceBug = Math.sqrt( a*a + b*b );

            a = bug.x - closestLight.x;
            b = bug.y - closestLight.y;
            distanceLight = Math.sqrt( a*a + b*b );

            if(distanceBug < distanceLight){
                return closestBug;
            }
            else{
                return closestLight;
            }
        }
    }

    preyNearbyCheck(){
        let target = lightbugManager.getClosestBugLocation(this.bot);
        if(target === undefined){
            return false;
        }
        // now you need to check if it's in a circle/square around the bug, based on its scale
        let preyRadius = new Phaser.Circle(this.bot.x, this.bot.y, 500 * this.bot.scale.x);
        return preyRadius.contains(target.x, target.y);
    }

}
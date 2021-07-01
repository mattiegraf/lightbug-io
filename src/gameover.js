var GameOver = {

    preload : function() {
        game.load.image('restart', './assets/restart-button.png');
    },

    create : function() {
        game.world.setBounds(0, 0, ORIGINAL_WORLD_WIDTH, ORIGINAL_WORLD_HEIGHT);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

        game.stage.backgroundColor = 0xFFFFFF;

        let titleString;
        victory ? titleString = "VICTORY" : titleString = "GAME OVER";

        let menuTitle = game.add.text(0, 0, titleString, { font: "bold 200px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" });
        menuTitle.setTextBounds(0, 0, window.innerWidth, window.innerHeight/1.25);

        let detailsString = "You survived for " + Game.formatTime(totalTime) + "\nYou collected " + playerbug.player.points + " pellets";
        let menuDetails = game.add.text(0, 0, detailsString, { font: "bold 50px Arial", fill: "#000000", boundsAlignH: "center", boundsAlignV: "bottom" });
        menuDetails.setTextBounds(0, 0, window.innerWidth, window.innerHeight * .65);

        let button = this.add.button(0, 0, 'restart', this.startGame, this);
        button.centerX = window.innerWidth / 2;
        button.centerY = window.innerHeight * .75;
    },

    startGame: function () {
        this.state.start('Game');
    }

};
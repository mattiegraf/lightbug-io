var Menu = {

    preload : function() {
        game.load.image('button', 'assets/start-button.png');
    },

    create: function () {
        game.world.setBounds(0, 0, ORIGINAL_WORLD_WIDTH, ORIGINAL_WORLD_HEIGHT);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

        game.stage.backgroundColor = 0xFFFFFF;

        let menuTitle = game.add.text(0, 0, "Lightbug.io", { font: "bold 200px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" });
        menuTitle.setTextBounds(0, 0, window.innerWidth, window.innerHeight/1.25);

        let button = this.add.button(0, 0, 'button', this.startGame, this);
        button.centerX = window.innerWidth / 2;
        button.centerY = window.innerHeight * .75;
    },

    startGame: function () {
        this.state.start('Game');
    }

};
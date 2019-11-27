var GameOver = {

    preload : function() {
        game.load.image('gameover', './assets/death-screen.png');
    },

    create : function() {
        game.world.setBounds(0, 0, 4000, 4000);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

        game.stage.backgroundColor = 0xFFFFFF;

        this.add.button(0, 0, 'gameover', this.startGame, this);

        // Might be good to add stuff about how the player did here
    },

    startGame: function () {
        this.state.start('Game');
    }

};
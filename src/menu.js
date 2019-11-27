var Menu = {

    preload : function() {
        game.load.image('menu', './assets/temp-menu.png');
    },

    create: function () {
        game.world.setBounds(0, 0, 4000, 4000);
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

        game.stage.backgroundColor = 0xFFFFFF;

        this.add.button(0, 0, 'menu', this.startGame, this);
    },

    startGame: function () {
        this.state.start('Game');
    }

};
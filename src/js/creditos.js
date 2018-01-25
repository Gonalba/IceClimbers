'use strict';
var scene;
var Creditos = {
	create: function () {
		this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ESC);

    this.menu = this.game.add.sprite(25, 25, 'menuBTN');
    this.menu.scale.setTo(0.30, 0.3);
	},
  update: function(){
    this.escKey.onDown.add(this.actionOnClick, this);      
  },

	actionOnClick: function(){
		scene = 'menu_principal';
        this.initState();
    },

	initState: function(){
		this.game.state.start(scene);
	}
}

module.exports = Creditos;
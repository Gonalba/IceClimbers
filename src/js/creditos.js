'use strict';
var scene;
var Creditos = {
	create: function () {
	this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ESC);

    this.menu = this.game.add.sprite(500, 600, 'menuBTN');
    this.menu.scale.setTo(0.30, 0.3);

	this.Gonzalo = this.game.add.sprite(75, 50, 'Gonzalo');
	this.Gonzalo.scale.setTo(0.4, 0.4);

	this.Celia = this.game.add.sprite(450, 50, 'Celia');
	this.Celia.scale.setTo(0.4, 0.4);

	this.Logo = this.game.add.sprite(275, 50, 'LogoGrupo');
		this.Logo.scale.setTo(0.3, 0.3);

	this.Asignatura = this.game.add.sprite(25, 450, 'Asignatura');
	this.Asignatura.scale.setTo(0.3, 0.3);
	this.Uni = this.game.add.sprite(420, 500, 'Uni');
	this.Uni.scale.setTo(0.3, 0.3);

	this.Nintendo = this.game.add.sprite(250, 250, 'Nintendo');
	this.Nintendo.scale.setTo(0.3, 0.3);


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
'use strict';
var entities = require('./entities.js');

var PlayScene = {
	_popo: {},

	create: function () {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	this.game.physics.arcade.gravity.y = 500;
    	this.map = this.game.add.tilemap('mapPrueba');
  		this.map.addTilesetImage('Ice','tile');
  		this.backgroundLayer = this.map.createLayer('fondo');
  		this.layer = this.map.createLayer('World1');
    	layer.resizeWorld();

		this._popo = new entities.Popo(this.game, 100, 100, 'popo', 0);
    	
		this.cursors = this.game.input.keyboard.createCursorKeys();

		

      	//this.groundLayer = this.map.createLayer('platforms');
	},

	update: function(){
		this._popo.move(0);
		if (this.cursors.left.isDown){
			this._popo.move(-250);
		}
		else if(this.cursors.right.isDown){
			this._popo.move(250);
		}
		if(this.cursors.up.isDown ){
			this._popo.jump(-500);
		}
	}
};
module.exports = PlayScene;
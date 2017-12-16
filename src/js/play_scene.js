'use strict';
var entities = require('./entities.js');

var PlayScene = {
	_popo: {},

	create: function () {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	this.game.physics.arcade.gravity.y = 500;

		this._popo = new entities.Popo(this.game, this.game.world.centerX, this.game.world.centerY, 'popo', 0);
    	
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},

	update: function(){
		this._popo.move(0);
		if (this.cursors.left.isDown){
			this._popo.move(-250);
		}
		else if(this.cursors.right.isDown){
			this._popo.move(250);
		}
		if(this.cursors.up.isDown ){//&& this._popo.body.onFloor()){
			this._popo.jump(-500);
		}
	}
};
module.exports = PlayScene;
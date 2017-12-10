'use strict';
var entities = require('./entities.js');

var PlayScene = {
	_popo: {},

	create: function () {
		this._popo = new entities.Popo(this.game, this.game.world.centerX, this.game.world.centerY);
    	//this.configure();
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this._popo);        
        this.game.physics.arcade.gravity.y = 500;  
        this._popo.body.bounce.y = 0.2;
        this._popo.body.collideWorldBounds = true;

		this.cursors = this.game.input.keyboard.createCursorKeys();
	},

	update: function(){
		this._popo.body.velocity.x = 0;

		if (this.cursors.left.isDown){
			this._popo.moveLeft(-250);
		}
		else if(this.cursors.right.isDown){
			this._popo.moveRight(250);
		}
		if(this.cursors.up.isDown && this._popo.body.onFloor()){
			this._popo.jump(2000);
		}
	}
};

module.exports = PlayScene;

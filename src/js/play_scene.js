'use strict';
var entities = require('./entities.js');

var PlayScene = {
	_popo: {},

	create: function () {
		this._popo = new entities.Popo(this.game, 500, 1900);
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this._popo);        
        this.game.physics.arcade.gravity.y = 500;  
        this._popo.body.bounce.y = 0.2;
        //this._popo.body.collideWorldBounds = true;
		this.cursors = this.game.input.keyboard.createCursorKeys();


		this.map = this.game.add.tilemap('mapa');
		this.map.addTilesetImage('ice-suelo','patron');
		this.groundLayer = this.map.createLayer('Capa de Patrones 1');
		this.map.setCollisionBetween(1, 50);// true, 'Capa de Patrones 1');
 		this.groundLayer.resizeWorld();
 		this.game.camera.follow(this._popo);

	},

	update: function(){
		this.game.physics.arcade.collide(this._popo, this.groundLayer);

		this._popo.body.velocity.x = 0;

		if (this.cursors.left.isDown){
			this._popo.move(-250);
		}
		else if(this.cursors.right.isDown){
			this._popo.move(250);
		}
		if(this.cursors.up.isDown){
			this._popo.jump(-500);
		}
	}
};
module.exports = PlayScene;
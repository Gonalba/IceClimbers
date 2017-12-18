'use strict';
var entities = require('./entities.js');
 

var PlayScene = {
	_popo: {},
	_oso:{},
	_yeti:{},
	create: function () {
		this._popo = new entities.Popo(this.game, 500, 1900,'popo');
    	this._oso = new entities.Oso(this.game, 500, 2045);
    	this._yeti = new entities.Yeti(this.game, 500, 2000);

    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	this.game.physics.arcade.gravity.y = 500;
        this.game.physics.arcade.enable(this._popo);        
       	this.game.physics.arcade.enable(this._oso);
       	//this._oso.body.gravity.y = 550;

        this.game.physics.arcade.enable(this._yeti);

          
        this._popo.body.bounce.y = 0.2;
        this._yeti.body.collideWorldBounds = true;
        this._oso.body.collideWorldBounds = true;
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
		this.game.physics.arcade.collide(this._oso, this.groundLayer);
		this.game.physics.arcade.collide(this._yeti, this.groundLayer);
		
		this._yeti.move(80);
		this._oso.move(50);

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
	},
	render: function(){
		//this.game.debug.bodyInfo(_oso, 32, 32);
        //this.game.debug.body(_oso);
	}
};
module.exports = PlayScene;
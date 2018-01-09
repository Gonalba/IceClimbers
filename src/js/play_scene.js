'use strict';
var entities = require('./entities.js');


var PlayScene = {

	pool: function (game, entities) {
		this._group = game.add.group();
		this._group.add(entities);
		this._group.callAll('kill');
	},
	create: function () {

		//MARTILLO-------
		this.martillo = new entities.Martillo(this.game, 100, 100,'x');
		this.pool(this.game, this.martillo);
		//POPO--------------------------------------
		this._popo = new entities.Popo(this.game, 100, 100,this.martillo, 'spritesGame');
		this._popo.height *= 3;
		this._popo.width *= 3;
		this.game.world.addChild(this._popo);
		this._popo.addChild(this.martillo);

		//YETI-------------------------------------
		this._yeti = new entities.Yeti(this.game,100,100,'yeti');
		this._yeti.height *= 0.5;
		this._yeti.width *= 0.5;
		this.game.world.addChild(this._yeti);

		//OSO---------------------------------------
		this._oso = new entities.Oso(this.game,10,100,'oso');
		this._oso.height *= 0.5;
		this._oso.width *= 0.5;
		this.game.world.addChild(this._oso);


		this.configure();	       
	},
	update: function(){
		this._popo.update();



	},
	render : function(){
		this.game.debug.bodyInfo(this._popo, 32, 32);

		this.game.debug.body(this._popo);
		this.game.debug.body(this.martillo);

	},
	configure: function(){
		//Start the Arcade Physics system
		//this.game.world.setBounds(0,0, 2560 , 800);
		       this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 200;  
		this.cursors = this.game.input.keyboard.createCursorKeys();

		//POPO----------------------------
		this.game.physics.arcade.enable(this._popo);        
		this._popo.body.collideWorldBounds = true;
		this.game.camera.follow(this._popo);

		//YETI----------------------------
		this.game.physics.arcade.enable(this._yeti);        
		this._yeti.body.collideWorldBounds = true;

		//OSO----------------------------
		this.game.physics.arcade.enable(this._oso);        
		this._oso.body.collideWorldBounds = true;
	},
};

module.exports = PlayScene;

'use strict';
var entities = require('./entities.js');


var PlayScene = {
	//no se si funciona asi	
	create: function () {

		//MARTILLO---------------------------------
		this.martillo = new entities.Martillo(this.game, 1000, 10,'logo');
		this.martillo.height *= 0.1;
		this.martillo.width *= 0.1;

		//POPO--------------------------------------
		this._popo = new entities.Popo(this.game, 400, 100,this.martillo, 'spritesGame');
		this._popo.height *= 3;
		this._popo.width *= 3;
		this.game.world.addChild(this._popo);
		this._popo.addChild(this.martillo);

		//YETI-------------------------------------
		this._yeti = new entities.Yeti(this.game,20,100,'yeti');
		this._yeti.height *= 0.5;
		this._yeti.width *= 0.5;
		this.game.world.addChild(this._yeti);

		//OSO---------------------------------------
		this._oso = new entities.Oso(this.game,10,100,'oso');
		this._oso.height *= 0.5;
		this._oso.width *= 0.5;
		this.game.world.addChild(this._oso);

		this.enemiesGroup = this.game.add.group();
		this.enemiesGroup.add(this._yeti);
		this.enemiesGroup.add(this._oso);

		this.configure();	       
	},
	update: function(){		
		this.collision();
	},
	render : function(){
		this.game.debug.bodyInfo(this.martillo, 32, 32);

		//this.game.debug.bodyInfo(this.map.debugMap, 32, 32);
		//this.game.debug.body(this._popo);
		this.game.debug.body(this.martillo);
		//this.game.debug.body(this._oso);
		//this.game.debug.body(this._yeti);
	},
	collision: function(){
		//COLISION CON EL MAPA----------------------------------------
		this.game.physics.arcade.collide(this._popo, this.groundLayer);
		this.game.physics.arcade.collide(this.enemiesGroup, this.groundLayer);
		this.game.physics.arcade.collide(this.martillo, this.groundLayer,this.destruyeTile);

		//COLISION ENEMIGOS------------------------------------------------------------
		this.game.physics.arcade.collide(this.martillo, this.enemiesGroup, this.mataEnemigo);
		if(this._popo.overlap(this.enemiesGroup)){
			this._popo.morir();
		}
		//this.map.setTileIndexCallback(1, this.destruyeTile, this.martillo);
		//this.game.physics.arcade.collide(this._popo, this.tiles);
		
	},
	configure: function(){
		//Start the Arcade Physics system
		//this.game.world.setBounds(0,0, 2560 , 800);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 600;  
		this.cursors = this.game.input.keyboard.createCursorKeys();
		//MARTILLO------------------------
		this.game.physics.arcade.enable(this.martillo);
		this.martillo.body.allowGravity = false;

		//POPO----------------------------
		this.game.physics.arcade.enable(this._popo);        
		this._popo.body.collideWorldBounds = true;
		this.game.camera.follow(this._popo);

		//ENEMIGOS------------------------
		this.game.physics.arcade.enable(this.enemiesGroup);
		this.enemiesGroup.forEach(function(obj){
     		 obj.body.collideWorldBounds = true;
    		});

		//MAPA------------------------------
		this.map = this.game.add.tilemap('mapa');
		this.map.addTilesetImage('ice-suelo','patron');
		this.groundLayer = this.map.createLayer('Capa de Patrones 1');
		this.map.setCollisionBetween(0,100);// true, 'Capa de Patrones 1');
 		this.groundLayer.resizeWorld();

 		//this.tiles = this.game.add.group();
		//this.game.physics.arcade.enable(this.tiles);
		//this.map.createFromObjects('Capa de Patrones 1', 1, 'patron', this.tiles);
	},

	mataEnemigo: function(martillo, enemy){
		enemy.destroy();
	},
	destruyeTile: function(martillo, tile){ 
		//tile.kill();
	    tile.alpha = 0.5; //BAJA LA TRANSPARENCIA, PARA IR PROBANDO
    	//layer.dirty = true;
   	},
};

module.exports = PlayScene;



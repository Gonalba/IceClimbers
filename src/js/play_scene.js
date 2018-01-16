'use strict';
var entities = require('./entities.js');


var PlayScene = {

		
	//no se si funciona asi	
	create: function () {
		this.tileH = 40;
		this.tileW = 70;

		//MARTILLO---------------------------------
		this.martillo = new entities.Martillo(this.game, 1000, 10,'logo');
		this.martillo.height *= 0.1;
		this.martillo.width *= 0.1;

		//POPO--------------------------------------
		this._popo = new entities.Popo(this.game, 400, 1200,this.martillo, 'spritesGame');
		this._popo.height *= 3;
		this._popo.width *= 3;
		this.game.world.addChild(this._popo);
		this._popo.addChild(this.martillo);

		
		//DETECTOR YETI-----------------------------------------
		/*this.detector = new entities.Detector(this.game, 20, 100, 100, 100, 'logo');//this._yeti.height, this._yeti.width, 'logo');
		this.detector.height *= 0.1;
		this.detector.width *= 0.1;*/

		//YETI-------------------------------------
		this._yeti = new entities.Yeti(this.game,500,1000,'yeti');
		this._yeti.height *= 0.5;
		this._yeti.width *= 0.5;
		this.game.world.addChild(this._yeti);
		//this._yeti.addChild(this.detector);


		


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
		//this.game.debug.bodyInfo(this.detector, 32, 32);

		//this.game.debug.bodyInfo(this.map.debugMap, 32, 32);
		//this.game.debug.body(this._popo);
		this.game.debug.body(this.martillo);
		//this.game.debug.body(this._oso);
		//this.game.debug.body(this._yeti);
	},
	collision: function(){
		//COLISION CON EL MAPA---------------------------------------  		
		this.game.physics.arcade.collide(this._popo, this.groundLayer);
		this.game.physics.arcade.collide(this.enemiesGroup, this.groundLayer);

		this.game.physics.arcade.collide(this._popo, this.cloudLayer);
		this.game.physics.arcade.collide(this.enemiesGroup, this.cloudLayer);

		this.game.physics.arcade.collide(this._popo, this.bonusLayer);
		this.game.physics.arcade.collide(this.enemiesGroup, this.bonusLayer);


		//ROMPE SUELO SUPERIOR-------------------------------------------------------
		if(this.game.physics.arcade.overlap(this.martillo, this.groundLayer)){
			//this.game.debug.text('Popo: ' + this._popo.x + this.martillo.x + ", " + this._popo.y + this.martillo.y, 0, 500);

			this.varX = Math.trunc((this._popo.x + this.martillo.x)/this.tileW);
			this.varY= Math.trunc((this._popo.y + this.martillo.y)/this.tileH);
			this.map.removeTile(this.varX, this.varY, this.groundLayer);
			//this.game.debug.text('Tile: ' + this.varX + ", " + this.varY, 0, 600);
		}

		//COLISION CON ENEMIGOS------------------------------------------------------------
		this.game.physics.arcade.collide(this.martillo, this.enemiesGroup, this.mataEnemigo);
		if(this._popo.overlap(this.enemiesGroup)){
			this._popo.morir();
		}
		this.hueco();
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
		this.map.addTilesetImage('mapaTiles','tiles');
  		
		this.groundLayer = this.map.createLayer('Pisos');
		this.cloudLayer = this.map.createLayer('Nubes');
		this.bonusLayer = this.map.createLayer('Bonus');

		this.map.setCollisionBetween(0, 5000, true, 'Pisos');
     	this.map.setCollisionBetween(0, 5000, true, 'Nubes');
     	this.map.setCollisionBetween(0, 5000, true, 'Bonus');
  		
 		this.groundLayer.resizeWorld();
	},

	mataEnemigo: function(martillo, enemy){
		enemy.destroy();
	},
	hueco: function(){
		if(this._yeti._direction == 1){//Si va a la derecha
			//this.game.debug.text('Yeti: ' + this._yeti.x + this._yeti.width + ", " + this._yeti.y + this._yeti.height, 0, 500);
			this.varX = Math.trunc((this._yeti.x + this._yeti.width)/this.tileW);
			this.varY= Math.trunc((this._yeti.y + this._yeti.height)/this.tileH);
			if(this.map.getTile(this.varX, this.varY) === null){
				this.map.putTile(7, this.varX, this.varY, this.groundLayer);
				this.game.debug.text('Sí', 0, 600);
			}
		}
		else{
			//this.game.debug.text('Yeti: ' + this._yeti.x + ", " + this._yeti.y + this._yeti.height, 0, 500);
			this.varX = Math.trunc((this._yeti.x)/this.tileW);
			this.varY= Math.trunc((this._yeti.y + this._yeti.height)/this.tileH);
			if(this.map.getTile(this.varX, this.varY) === null){
				this.map.putTile(7, this.varX, this.varY, this.groundLayer);
				this.game.debug.text('Sí', 0, 600);
			}
		}
		this.game.debug.text('Tile: ' + this.varX + ", " + this.varY, 0, 550);

		

		

	},
};

module.exports = PlayScene;



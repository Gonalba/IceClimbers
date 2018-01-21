'use strict';
var entities = require('./entities.js');

var scene;
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
		this._popo = new entities.Popo(this.game, 400, 1200,this.martillo, 'popoMartillo');
		this._popo.height *= 3;
		this._popo.width *= 3;
		this.game.world.addChild(this._popo);
		this._popo.addChild(this.martillo);

		//YETI-------------------------------------
		this._yeti = new entities.Yeti(this.game,500,1000,'yeti','yetiMuerto');
		this._yeti.height *= 5;
		this._yeti.width *= 5;
		this.game.world.addChild(this._yeti);
		//OSO---------------------------------------
		this._oso = new entities.Oso(this.game,10,100,'oso');
		this._oso.height *= 4;
		this._oso.width *= 4;
		this.game.world.addChild(this._oso);

		//GRUPO ENEMIGOS------------------------
		this.enemiesGroup = this.game.add.group();
		this.enemiesGroup.add(this._yeti);
		this.enemiesGroup.add(this._oso);

		this.menu = this.game.add.sprite(295, 400, 'menuBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.menu.scale.setTo(0.5, 0.5);
        this.menu.fixedToCamera = true;
        this.resume = this.game.add.sprite(75, 300, 'resumeBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.resume.scale.setTo(0.5, 0.5);
        this.resume.fixedToCamera = true;
        this.reset = this.game.add.sprite(500, 300, 'resetBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.reset.scale.setTo(0.5, 0.5);
        this.reset.fixedToCamera = true;
		//MAPA------------------------------
		this.map = this.game.add.tilemap('mapa');
		this.map.addTilesetImage('mapaTiles','tiles');

		//PAUSA--------------------------------
		this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    	this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ESC);
    	this.selecKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    	this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);
    	this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    	this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.R);

    	this.paused = false;
    	

        this.menu.alpha = this.resume.alpha = this.reset.alpha = 0;


		this.configure();	       
	},
	update: function(){		
		if(!this.paused)		
    		this.escKey.onDown.add(this.pause, this);
    	else if(this.paused){
    		this.escKey.onDown.add(this.goMenu, this);
    		this.selecKey.onDown.add(this.pause, this);
    		this.resetKey.onDown.add(this.resetGame, this);
    	} 

		this.collision();
	},
	render : function(){
		this.game.debug.bodyInfo(this._popo, 32, 32);
		this.game.debug.body(this._popo);
		this.game.debug.body(this.martillo);
		this.game.debug.body(this._oso);
		this.game.debug.body(this._yeti);
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
		if(this.game.physics.arcade.collide(this._popo, this.enemiesGroup, this._popo.morir)){
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

		
  		//MAPA----------------------------
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
	},
	pause: function(){
		if(!this.paused){
			this._popo.pause();
			this._oso.pause();
			this._yeti.pause();
			this.paused = true;
			this.menu.alpha = this.resume.alpha = this.reset.alpha = 1;
		}
		else if(this.paused){
			this._popo.pause();
			this._oso.pause();
			this._yeti.pause();
			this.paused = false;
			this.menu.alpha = this.resume.alpha = this.reset.alpha = 0;
		}


	},
	goMenu: function(){
		this.game.state.start('menu_principal');
	},
	resetGame: function(){
		this.game.state.start('play');
	},
};

module.exports = PlayScene;



'use strict';
var entities = require('./entities.js');

var scene;
var PlayScene = {

	create: function () {
		this.game.sound.stopAll();
		//AUDIO--------------------------------------
		this.himalayaMelody = this.game.add.audio('himalayaMelody',0.3,true);
		this.himalayaMelody.play();
		this.puntosSound = this.game.add.audio('puntosSound');

		this.bonusSound = this.game.add.sound('bonusSound',0.3,true);


		this.tileH = 40;
		this.tileW = this.world.width/11;
		//PTERODÁCTILO------------------------------	
		this.pterodactilo = new entities.Pterodactilo(this.game, 100, 50,'personajesPt');
		this.pterodactilo.height *= 3;
		this.pterodactilo.width *= 3;
		this.game.world.addChild(this.pterodactilo);

		//MARTILLO---------------------------------
		this.martillo = new entities.Martillo(this.game, 1000, 10,'logo');
		this.martillo.height *= 0.08;
		this.martillo.width *= 0.07;

		//POPO--------------------------------------
		this._popo = new entities.Popo(this.game, 400, 2500,this.martillo, 'personajes');
		this._popo.height *= 3;
		this._popo.width *= 3;
		this.game.world.addChild(this._popo);
		this._popo.addChild(this.martillo);

		//YETI-------------------------------------
		this._yeti = new entities.Yeti(this.game,100,2050,'personajes');
		this._yeti.height *= 3;
		this._yeti.width *= 3;
		this.game.world.addChild(this._yeti);
		//PÁJARO-------------------------------------
		this._bird = new entities.Pajaro(this.game,100,2050,'personajesPajaro', this.game.camera);
		this._bird.height *= 3;
		this._bird.width *= 3;
		this.game.world.addChild(this._bird);
		//OSO---------------------------------------
		this._oso = new entities.Oso(this.game,10,1500,'oso');
		this._oso.height *= 4;
		this._oso.width *= 4;
		this.game.world.addChild(this._oso);

		//GRUPO ENEMIGOS------------------------
		this.enemiesGroup = this.game.add.group();
		this.enemiesGroup.add(this._yeti);
		this.enemiesGroup.add(this._oso);
		this.enemiesGroup.add(this._bird);

		this.menu = this.game.add.sprite(295, 400, 'menuBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.menu.scale.setTo(0.5, 0.5);
        this.menu.fixedToCamera = true;
        this.resume = this.game.add.sprite(75, 300, 'resumeBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.resume.scale.setTo(0.5, 0.5);
        this.resume.fixedToCamera = true;
        this.reset = this.game.add.sprite(500, 300, 'resetBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.reset.scale.setTo(0.5, 0.5);
        this.reset.fixedToCamera = true;

        //PAUSA--------------------------------
		this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    	this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ESC);
    	this.selecKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    	this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);
    	this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    	this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.R);
        this.exitKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    	this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.S);

        this.menu.alpha = this.resume.alpha = this.reset.alpha = 0;
		
		//MAPA------------------------------
		this.map = this.game.add.tilemap('mapa');
		this.map.addTilesetImage('TileSet','tiles');


		//BERENJENAS---------------------------------------
		this.berenjena = this.game.add.sprite (200, 1000, 'berenjena');
	    this.berenjena.scale.setTo(3, 3);

		//VIDAS------------------------------------
		this.vidas = new Array (3);
		for (this.i = 0; this.i < 3; this.i++){
			this.vida =  this.game.add.sprite (50 + this.i*30, 50, 'vidasPopo');
	        this.vida.scale.setTo(3, 3);

			this.vidas[this.i] = this.vida;
			this.vidas[this.i].fixedToCamera = true;
		}

		this.i = 0;//Contador para las vidas

		this.puntos = 0;

    	this.paused = false;
    	this.gameover = false;	
    	this.playSound = true;
    	this.win = false;

		this.configure();	       
	},
	update: function(){		
		if(!this.paused)		
    		this.escKey.onDown.add(this.pause, this);
		else if(this.paused){
    		this.exitKey.onDown.add(this.goMenu, this);
    		this.resetKey.onDown.add(this.resetGame, this);
    	} 
    	if(this.gameover){
		    this.exitKey.onDown.add(this.goMenu, this);
    	}
    	this.game.debug.text(this.puntos, 0, 500);

    	if(this.game.camera.y <= 660&&this.playSound){
    		this.playSound = false;
    		this.himalayaMelody.fadeOut(1000);
    		if(this.himalayaMelody.onFadeComplete){
    			this.bonusSound.fadeIn(5000,true);
    		}
    	}
    	if(this.bonusSound.onFadeComplete)
    		this.bonusSound.volume = 0.3;

    	this.setCamera();
		this.collision();
	},

	render : function(){
		this.game.debug.text(this.game.camera.y, 32, 32);

		this.game.debug.body(this._popo);
		this.game.debug.body(this.martillo);
		this.game.debug.body(this._oso);
		this.game.debug.body(this._yeti);
		this.game.debug.body(this._bird);
		this.game.debug.body(this.pterodactilo);
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
			this.game.debug.text('Popo: ' + (this._popo.x + this.martillo.x) + ", " + (this._popo.y + this.martillo.y), 0, 400);

			this.varX = Math.trunc((this._popo.x + this.martillo.x+20)/this.tileW);
			this.varY = Math.trunc((this._popo.y + this.martillo.y)/this.tileH);
			
			if(this.map.removeTile(this.varX, this.varY, this.groundLayer)){
				this._popo.body.velocity.y = 0;
				this.puntosSound.play();
				this.puntos+=10;
			}
			this.game.debug.text('Tile: ' + this.varX + ", " + this.varY, 0, 500);
		}

		//COLISION CON ENEMIGOS------------------------------------------------------------
		if(this.game.physics.arcade.collide(this.martillo, this.enemiesGroup, this.mataEnemigo)){
			this.puntosSound.play();
			this.puntos += 50;
		}

		//MUERTE POPO, VIDAS Y FIN JUEGO-------------------------------------------
		if(this.game.physics.arcade.collide(this._popo, this.enemiesGroup) || this._popo.y >= this.game.camera.y + this.game.camera.height){
			if(this._popo.muere && this.i < 3 ){
				this._popo.morir();
				this.vidas[this.i].destroy();
				this.i++;
			}
			else if(this.i >= 3){
				this._popo.morir();
				this._popo.destroy();
				this.gameOver();
			}
		}

		//COLISIÓN CON LOS BONUS--------------------------------------------------
		if(this.game.physics.arcade.overlap(this._popo, this.berenjena)){
			this.puntosSound.play();
			this.puntos += 20;
			this.berenjena.destroy();
		}

		//DETECCIÓN DE HUECOS POR EL YETI---------------------------------------
		if(!this._yeti.muerto)
			this.hueco();

		if (this.game.physics.arcade.overlap(this._popo, this.pterodactilo)){
			if(!this.win){
				this.time = this.game.time.totalElapsedSeconds();
				this.win = true;
			}

			this._popo.body.gravity = false;
			this._popo.x = this.pterodactilo.x;
			this._popo.y = this.pterodactilo.y -20;
			//this.pterodactilo.addChild(this._popo);
			if(this.game.time.totalElapsedSeconds() >= this.time + 5){
				this.game.sound.stopAll();
				this.game.state.start('gameOver');
			}
		}
	},

	configure: function(){ //configura las físicas de los elementos del juego
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 600;  
		this.cursors = this.game.input.keyboard.createCursorKeys();

		//MARTILLO------------------------
		this.game.physics.arcade.enable(this.martillo);
		this.martillo.body.allowGravity = false;

		//POPO----------------------------
		this.game.physics.arcade.enable(this._popo);        
		this._popo.body.collideWorldBounds = true;
		
		this.game.physics.arcade.enable(this._bird);        
		this._bird.body.collideWorldBounds = true;

		//ENEMIGOS------------------------
		this.game.physics.arcade.enable(this.enemiesGroup);
		this.enemiesGroup.forEach(function(obj){
     		 obj.body.collideWorldBounds = true;
    		});
		this._bird.body.allowGravity = false;

		//BONUS BERENJENA-------------------------
		this.game.physics.arcade.enable(this.berenjena);
		this.berenjena.body.allowGravity = false;

		this.game.physics.arcade.enable(this.pterodactilo);
		this.pterodactilo.body.allowGravity = false;
  		//MAPA----------------------------
		this.groundLayer = this.map.createLayer('Pisos');
		this.cloudLayer = this.map.createLayer('Nubes');
		this.bonusLayer = this.map.createLayer('Bonus');

		this.map.setCollisionBetween(0, 5000, true, 'Pisos');
     	this.map.setCollisionBetween(0, 5000, true, 'Nubes');
     	this.map.setCollisionBetween(0, 5000, true, 'Bonus');
  		
 		this.groundLayer.resizeWorld();

		this.camera.setPosition(0, 2000)

	},

	mataEnemigo: function(martillo, enemy){
		enemy.morir();	
	},

	hueco: function(){ //Para que el detecte si hay un hueco a su lado
		if(this._yeti.suelo){
		if(this._yeti._direction == 1){//Si va hacia la derecha
			this.varX = Math.trunc((this._yeti.x + this._yeti.width)/this.tileW);
			this.varY= Math.trunc((this._yeti.y + this._yeti.height)/this.tileH);
		}
		else{//Hacia la izqd
			this.varX = Math.trunc((this._yeti.x)/this.tileW);
			this.varY= Math.trunc((this._yeti.y + this._yeti.height)/this.tileH)
		}
		if(this.map.getTile(this.varX, this.varY) === null){ //Si encuentra un hueco en el suelo
			if (!this.detectado ){ //Si dicho hueco aún no había sido detectado cambia la dirección del yeti y pone "detectado" a true
				this.detectado = true;
				this._yeti.goBack();
			}
			else{	//Si el hueco sí había sido detectado -> "detectado" lo pone a false y crea un tile nuevo en el hueco que corresponde.
				this.detectado = false;
				this.map.putTile(7, this.varX, this.varY, this.groundLayer);
			}
		}
	}
	},

	gameOver: function(){
    	this.gameover = true;
		this._popo.pause();
		this.imagen = this.game.add.sprite(150, 200,'icestart');
		this.imagen.fixedToCamera = true;
    	this.imagen.scale.setTo(1.5, 1.5);
	},

	pause: function(){
		if(!this.paused){
			this._popo.pause();
			this.enemiesGroup.callAll('pause');
			this.paused = true;
			this.menu.alpha = this.resume.alpha = this.reset.alpha = 1;
		}
		else if(this.paused||this.gameover){
			this._popo.pause();
			this.enemiesGroup.callAll('pause');
			this.paused = false;
			this.menu.alpha = this.resume.alpha = this.reset.alpha = 0;
		}


	},

	goMenu: function(){
		if(this.paused||this.gameover){
			this.game.sound.stopAll();
			this.game.state.start('menu_principal');
		}
	},

	resetGame: function(){ //Reinicia la partida
		if(this.paused){
			this.himalayaMelody.stop();
			this.game.state.start('play');
		}
	},

	setCamera: function(){//La cámara se va recolocando según Popo va ascendiendo por la montaña -> cuando está por encima de la mitad de la cámara y se encuentra apoyado en el suelo
    	if(this._popo.suelo === true && this._popo.y < this.game.camera.y + this.game.camera.height/2){ 
    		this.game.camera.y -=10 ;
    	}
	},
};

module.exports = PlayScene;



'use strict';
var entities = require('./entities.js');

var scene;
var PlayScene = {

	create: function () {
		this.game.sound.stopAll();
		//AUDIO--------------------------------------
		this.himalayaMelody = this.game.add.audio('himalayaMelody',0.3,true);
		this.himalayaMelody.play();
		this.himalayaMelody.volume = 0.3;
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

		//YETIS-------------------------------------
		this.yetiGroup = this.game.add.group();
   
   		for (var i = 0; i < 7; i++){
		this._yeti = new entities.Yeti(this.game, Math.random() * 550,2500 - i*200,'personajes');
		this._yeti.height *= 3;
		this._yeti.width *= 3;
		this.game.world.addChild(this._yeti);
		this.yetiGroup.add(this._yeti);
		}
		//PÁJARO-------------------------------------
		this._bird = new entities.Pajaro(this.game,100,2050,'personajesPajaro', this.game.camera);
		this._bird.height *= 3;
		this._bird.width *= 3;
		this.game.world.addChild(this._bird);

		//GRUPO ENEMIGOS------------------------
		this.enemiesGroup = this.game.add.group();
		this.enemiesGroup.add(this._bird);

		//MENÚ DE PAUSA----------------------------------------------
		this.menu = this.game.add.sprite(295, 400, 'menuBTN');
        this.menu.scale.setTo(0.5, 0.5);
        this.menu.fixedToCamera = true;
        this.menu.bringToTop();

        this.resume = this.game.add.sprite(75, 300, 'resumeBTN');
        this.resume.scale.setTo(0.5, 0.5);
        this.resume.fixedToCamera = true;
        this.resume.bringToTop();

        this.reset = this.game.add.sprite(500, 300, 'resetBTN');
        this.reset.scale.setTo(0.5, 0.5);
        this.reset.fixedToCamera = true;
        this.reset.bringToTop();

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
		this.berenjenaGroup = this.game.add.group();

		this.berenjena = this.game.add.sprite (100, 870, 'berenjena');
	    this.berenjena.scale.setTo(3, 3);	
	    this.berenjena1 = this.game.add.sprite (500, 710, 'berenjena');
	    this.berenjena1.scale.setTo(3, 3);	
	    this.berenjena2 = this.game.add.sprite (75, 540, 'berenjena');
	    this.berenjena2.scale.setTo(3, 3);
   		this.berenjenaGroup.add(this.berenjena);
   		this.berenjenaGroup.add(this.berenjena1);
   		this.berenjenaGroup.add(this.berenjena2);

		//VIDAS------------------------------------
		this.vidas = new Array (3);
		for (this.i = 0; this.i < 3; this.i++){
			this.vida =  this.game.add.sprite (50 + this.i*30, 50, 'vidasPopo');
	        this.vida.scale.setTo(3, 3);

			this.vidas[this.i] = this.vida;
			this.vidas[this.i].fixedToCamera = true;
		}
		this.i = 0;//Contador para las vidas

		//PUNTOS----------------------------------------------------------
		this.puntos = 0;
   		this.textPtos =  this.game.add.bitmapText(500, 50, 'fuente','Score: 0' + this.puntos,50);
		this.textPtos.fixedToCamera = true;

		//VARIABLES DEL JUEGO-----------------------------------------------
    	this.paused = false;
    	this.gameover = false;	
    	this.playSound = true;
    	this.win = false;
    	this.bonus = false;
    	this.tiempoAparicion = 30;
    	this.timeReset = true;

		this.configure();	       
	},
	update: function(){		
		if(!this.paused)		
    		this.escKey.onDown.add(this.pause, this);
		else if(this.paused){
    		this.exitKey.onDown.add(this.goMenu, this);
    		this.resetKey.onDown.add(this.resetGame, this);
    	}
    	if(this.game.camera.y <= 660&&this.playSound){
    		this.bonus = true;
    		this.playSound = false;
    		this.himalayaMelody.fadeOut(1000)
    		if(this.himalayaMelody.onFadeComplete){
    			this.bonusSound.fadeIn(5000,true);
    		}
    	}
    	if(this.bonusSound.onFadeComplete)
    		this.bonusSound.volume = 0.3;

    	this.setCamera();
		this.collision();
		this.ptosUpdate();

		if(this._popo.x != this.Xpopo){
			this.Xpopo = this._popo.x;
			this.timeReset = true;
			this.tiempo = this.game.time.totalElapsedSeconds();
		}

		if(this._popo.x === this.Xpopo&&this.game.time.totalElapsedSeconds() > this.tiempo + this.tiempoAparicion&&!this.bonus&&this.timeReset){
			this.timeReset = false;
			this.addOso();
		}
	},
	addOso : function(){
		this._oso = new entities.Oso(this.game,10,this._popo.y-220,'oso',this.game.camera);
		this._oso.height *= 2;
		this._oso.width *= 4;
		this.game.physics.arcade.enable(this._oso); 
		this.game.world.addChild(this._oso);
		this.enemiesGroup.add(this._oso);
	},

	render : function(){
	},
	collision: function(){
		//COLISION CON EL MAPA---------------------------------------  		
		this.game.physics.arcade.collide(this._popo, this.groundLayer);
		this.game.physics.arcade.collide(this.enemiesGroup, this.groundLayer);
		this.game.physics.arcade.collide(this.yetiGroup, this.groundLayer);

		this.game.physics.arcade.collide(this._popo, this.cloudLayer);

		this.game.physics.arcade.collide(this._popo, this.bonusLayer);

		//ROMPE SUELO SUPERIOR-------------------------------------------------------
		if(this.game.physics.arcade.overlap(this.martillo, this.groundLayer)){
			this.varX = Math.trunc((this._popo.x + this.martillo.x+20)/this.tileW);
			this.varY = Math.trunc((this._popo.y + this.martillo.y)/this.tileH);
			
			if(this.map.removeTile(this.varX, this.varY, this.groundLayer)){
				this._popo.body.velocity.y = 0;
				this.puntosSound.play();
				this.puntos+=10;
				this.sumaPuntos(10);
			}
		}

		//COLISION CON ENEMIGOS------------------------------------------------------------
		if(this.game.physics.arcade.collide(this.martillo, this.enemiesGroup, this.mataEnemigo)){
			this.puntosSound.play();
			this.puntos += 50;
			this.sumaPuntos(50);

		}
		if(this.game.physics.arcade.collide(this.martillo, this.yetiGroup, this.mataEnemigo)){
			this.puntosSound.play();
			this.puntos += 50;
			this.sumaPuntos(50);

		}

		//MUERTE POPO, VIDAS Y FIN JUEGO-------------------------------------------
		if(this.game.physics.arcade.collide(this._popo, this.enemiesGroup) || this.game.physics.arcade.collide(this._popo, this.yetiGroup) || this._popo.y >= this.game.camera.y + this.game.camera.height){
			if(this.bonus){
				this.game.state.start('level2');
			}
			else if(this._popo.muere && this.i < 3){
				this._popo.morir();
				this.vidas[this.i].destroy();
				this.i++;
			}
			else if(this._popo.muere &&this.i < 4){
				this._popo.morir();
			}
			if(this._popo.vidas <= 0)
				this.game.state.start('gameOver');
		}

		//COLISIÓN CON LOS BONUS--------------------------------------------------
		if(this.game.physics.arcade.overlap(this._popo, this.berenjenaGroup, this.cogeBerenjena)){
				this.puntosSound.play();
				this.puntos += 20;
				this.sumaPuntos(20);
			}

			
		var self = this;
		//DETECCIÓN DE HUECOS POR EL YETI---------------------------------------
		this.yetiGroup.forEach(function(obj){
			if(!obj.muerto)
				self.huecoYeti();
		})
		if (this.game.physics.arcade.overlap(this._popo, this.pterodactilo)){
			if(!this.win){
				this.time = this.game.time.totalElapsedSeconds();
				this.win = true;
			}

			this._popo.body.gravity = false;
			this._popo.x = this.pterodactilo.x;
			this._popo.y = this.pterodactilo.y - 20;
			//this.pterodactilo.addChild(this._popo);
			if(this.game.time.totalElapsedSeconds() >= this.time + 5){
				this.game.sound.stopAll();
				this.game.state.start('level2');
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
		this.game.physics.arcade.enable(this.yetiGroup);
		this.yetiGroup.forEach(function(obj){
     		 obj.body.collideWorldBounds = true;
    		});

		this.game.physics.arcade.enable(this.enemiesGroup);
		this.enemiesGroup.forEach(function(obj){
     		 obj.body.collideWorldBounds = true;
    		});
		this._bird.body.allowGravity = false;

		//BONUS BERENJENA-------------------------
		this.game.physics.arcade.enable(this.berenjenaGroup);
		this.berenjenaGroup.forEach(function(obj){
			obj.body.allowGravity = false;
		});
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

	cogeBerenjena: function(popo, beren){
		beren.destroy();
	},
	ptosUpdate: function(){
		this.textPtos.setText("Score: " + this.puntos);
	},
	sumaPuntos: function(pts){
		this.sumaPunts = this.game.add.bitmapText(Math.random() * (600 - 100) + 100, Math.random() * (600 - 100) + 100, 'fuente_verde','+' + pts, 50);
		this.sumaPunts.fixedToCamera = true;
   		this.game.add.tween(this.sumaPunts).to( {y: 0, alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0);// Number.MAX_VALUE, true);
   		this.ptosUpdate();

	},
	mataEnemigo: function(martillo, enemy){
		enemy.morir();	
	},

	huecoYeti: function(){ //Para que el detecte si hay un hueco a su lado
		var self = this;

		this.yetiGroup.forEach(function(obj){

		if(obj.suelo && !obj.muerto){
		if(obj._direction == 1){//Si va hacia la derecha
			self.varX = Math.trunc((obj.x + obj.width)/self.tileW);
			self.varY= Math.trunc((obj.y + obj.height)/self.tileH);
		}
		else{//Hacia la izqd
			self.varX = Math.trunc((obj.x)/self.tileW);
			self.varY= Math.trunc((obj.y + obj.height)/self.tileH);
		}
		if(self.map.getTile(self.varX, self.varY) === null){ //Si encuentra un hueco en el suelo

			if (!obj.detectado){ //Si dicho hueco aún no había sido detectado cambia la dirección del yeti y pone "detectado" a true
					obj.detectado = true;
					obj.auxD = obj._direction;
					obj.goBack();				
			}
			else{	//Si el hueco sí había sido detectado -> "detectado" lo pone a false y crea un tile nuevo en el hueco que corresponde.
				if (obj._direction === obj.auxD){ //Si va en la dirección original en la que ha detectado el hueco significa que ha llegado al final y así que coloca el tile
					self.detectado = false;
					self.map.putTile(7, self.varX, self.varY, self.groundLayer);
				}
				else{//Si no se habrá quedado encerrado y muere
					obj.morir();
				}
			}
		}
	}
	})},

	pause: function(){
		if(!this.paused){
			this._popo.pause();
			this.enemiesGroup.callAll('pause');
			this.yetiGroup.callAll('pause');
			this.paused = true;
			this.menu.alpha = this.resume.alpha = this.reset.alpha = 1;
		}
		else if(this.paused){
			this._popo.pause();
			this.enemiesGroup.callAll('pause');
			this.yetiGroup.callAll('pause');
			this.paused = false;
			this.menu.alpha = this.resume.alpha = this.reset.alpha = 0;
		}


	},

	goMenu: function(){
		if(this.paused){
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

	setCamera: function(){//La cámara se va recolocando según Popo va ascendiendo por la montaña -> 
		//cuando está por encima de la mitad de la cámara y se encuentra apoyado en el suelo
    	if(this._popo.suelo && this._popo.y < this.game.camera.y + this.game.camera.height/2){ 
    		this.movCamera = true;
    	}else if(this._popo.y >= this.game.camera.y + this.game.camera.height/2)
    		this.movCamera = false;

    	if(this.movCamera){
    		this.game.camera.y -=10 ;
    	}
    	
	},
};

module.exports = PlayScene;



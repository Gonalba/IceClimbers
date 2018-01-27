(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var scene;
var Creditos = {
	create: function () {
		this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.S);

    this.menu = this.game.add.sprite(25, 25, 'menuBTN');
    this.menu.scale.setTo(0.30, 0.3);
	},
  update: function(){
    this.escKey.onDown.add(this.actionOnClick, this);      
  },

	actionOnClick: function(){
		scene = 'menu_principal';
        this.initState();
    },

	initState: function(){
		this.game.state.start(scene);
	}
}

module.exports = Creditos;
},{}],2:[function(require,module,exports){
'use strict';

//OBJETO-----------------------------------------------------
function Objeto (game,x,y,graphic){
	Phaser.Sprite.call(this, game, x, y, graphic);
};

Objeto.prototype = Object.create(Phaser.Sprite.prototype);
Objeto.prototype.constructor = Objeto;

//MOVIBLE---------------------------------------------------------------
// MOVABLE TIENE VELOCIDAD, DIRECCION Y UN METODO QUE HACE QUE SE MUEVA EL PERSONAJE
function Movable (game, x, y, graphic){
 	this._velocity = 1;
 	this._direction = 1;
 	this.paused = false;
 	this.muerto = false;
 	Objeto.call(this, game, x, y, graphic);
	this.killEnemySound = game.add.audio('killEnemySound');
	this.killBirdSound = game.add.audio('killBirdSound');  

};
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;
// METODO QUE HACE QUE SE MUEVA EL OBJETO
Movable.prototype.move = function(){
	//USO this.x EN VEZ DE this.body.velocity.x PORQUE CON EL SEGUNDO SE MUEVE CON ACELERACION
	this.x += this._velocity * this._direction;

	/*lado a lado*/
	if(this.x > this.game.width - this.width - 5)
		this._direction = -1;
	else if(this.x < 1)
		this._direction = 1;
};
Movable.prototype.pause = function(){
	if(!this.paused){
		this._velAux = this._velocity;
		this._dirAux = this._direction;
		this._velocity = 0;
		this._direction = 0;
		this.paused = true;
	}
	else{
		this._velocity = this._velAux;
		this._direction = this._dirAux;
		this.paused = false;
	}
};
Movable.prototype.enSuelo = function(obj){
	return(obj.body.onFloor());
};


//PTERODACTILO-----------------------------------------------------------------------
function Pterodactilo (game,x,y,graphic){
	Movable.call(this, game, x, y, graphic);
	this.MovIzqPt = this.animations.add('MovIzqPt',[80,81,82]);
	this.MovDerPt = this.animations.add('MovDerPt',[83,84,85]);
	this._velocity = 5;
};
Pterodactilo.prototype = Object.create(Movable.prototype);
Pterodactilo.prototype.constructor = Pterodactilo;

Pterodactilo.prototype.update = function(){
	this.body.setSize(35,15,3,5);
	this.move();
	if(this._direction < 0)
		this.play('MovIzqPt',10);
	else if (this._direction > 0)
		this.play('MovDerPt',10);

};
//MARTILLO-------------------------------------------------------------------------------
//PREGUNTAR A CARLOS COMO IMPLEMENTAR EL ATAQUE DEL MARTILLO
function Martillo (game, x, y, graphic){
 	Objeto.call(this, game, x, y, graphic);
 	//POSICION INICIAL
 	this.xInit = x;
 	this.yInit = y;

 	this.alpha = 0;
};
Martillo.prototype = Object.create(Objeto.prototype);
Martillo.prototype.constructor = Martillo;
Martillo.prototype.setPosInit = function(){
	this.x = this.xInit;
	this.y = this.yInit;
};
Martillo.prototype.setPosIzq = function(){
	this.x = 0;
	this.y = 10;
}
Martillo.prototype.setPosDer = function(){
	this.x = 20;
	this.y = 10;
}
Martillo.prototype.setPosJump = function(){
	this.x = 10;
	this.y = -5;
};

//POPO-----------------------------------------------------------------------------------
// EN EL MÉTODO UPDATE SE IMPLEMENTA LA LÓGICA DEL MOVIMIENTO
// EN FUNCION DE LAS TECLAS QUE SE PULSEN
function Popo (game, x, y, martillo, graphic,salto){
	Movable.call(this, game, x, y, graphic);
	this._cursors = game.input.keyboard.createCursorKeys();
	this._jumpPower = -550;
 	this.atacando = false;
 	this.tiempo;
 	this.vivo = true;
 	this.vidas = 4;
 	this._velocity = 3;
 	this.martillo = martillo;
	this.hInit = this.height*3;
	this.wInit = this.width*3;
	this.xInit = x;
 	this.yInit = y;
 	this.muere = true;
 	this.posX;
	this.posY;
 	this.suelo;
 	this.game = game;
	
	//ANIMACIONES
	this.MoveLeftPopo = this.animations.add('MoveRightPopo',[7,8,9,10]);
	this.MoveRightPopo = this.animations.add('MoveLeftPopo',[6,5,4,3]);
	this.JumpRightPopo = this.animations.add('JumpRightPopo',[11,12]);
	this.JumpLeftPopo = this.animations.add('JumpLeftPopo',[2,1]);
	this.AtaqueRightPopo = this.animations.add('AtaqueRightPopo',[12,13,27]);
	this.AtaqueLeftPopo = this.animations.add('AtaqueLeftPopo',[1,0,14]);
	this.MuertePopo = this.animations.add('MuertePopo',[33,34,35,36]);
	
	//SONIDOS
	this.jumpSound = game.add.audio('jumpSound');
	this.popoMuerteSound = game.add.audio('popoMuerteSound');
	this.jumpSound = game.add.audio('jumpSound');
	this.jumpSound = game.add.audio('jumpSound');

};
Popo.prototype = Object.create(Movable.prototype);
Popo.prototype.constructor = Popo;

Popo.prototype.update = function(){

	this.body.setSize(12,22,9,3);
	if(this.vivo){
		this.savePosition();
		this.keyboardInput();

	}
	else{
		if(this.vidas > 0){
			this.MuertePopo.onComplete.add(this.resetPopo, this);

		}
		else{
			this.game.state.start('gameOver');
		}
	}
	this.suelo = this.body.onFloor();
};

//EN ESTE METODO SE CAPTURAN LAS TECLAS QUE SE PULSAN Y SE REALIZA LA FUNCION CORRESPONDIENTE
Popo.prototype.keyboardInput = function(){
	if(!this.paused){
	

	if(this._cursors.down.isDown&&this.body.onFloor()){
		this.muere = true;
		this.alpha = 1;
		this.atacando = true;
		if(this._direction === -1){
			this.play('AtaqueLeftPopo', 7);	
			this.martillo.setPosIzq();
  			this.AtaqueLeftPopo.onComplete.add(this.martillo.setPosInit,this.martillo);
  			this.AtaqueLeftPopo.onComplete.add(this.atacandoOff,this);
		}
		else if(this._direction === 1){
			this.play('AtaqueRightPopo', 7);
			this.martillo.setPosDer();
  			this.AtaqueRightPopo.onComplete.add(this.martillo.setPosInit,this.martillo);
  			this.AtaqueRightPopo.onComplete.add(this.atacandoOff,this);
		}
	}
	//SALTO-------------------------------------
  	else if (this._cursors.up.isDown&&this.body.onFloor()){
  		this.jumpSound.play();
  		this.muere = true;
		this.alpha = 1;
  		if(!this.atacando){
	 		this.jump();
			this.martillo.setPosJump();
			if(this._direction === -1){
				this.play('JumpLeftPopo', 2);
  				this.JumpLeftPopo.onComplete.add(this.martillo.setPosInit,this.martillo);
			}
			else if(this._direction === 1){
				this.play('JumpRightPopo', 2);
  				this.JumpRightPopo.onComplete.add(this.martillo.setPosInit,this.martillo);			
			}
		}
  	}
	//TECLAS MOVIMIENTO-------------------------
	else if (this._cursors.left.isDown){
		this.muere = true;
		this.alpha = 1;
		if(!this.atacando){
			this._direction = -1;
			this.move();
			if(this.body.onFloor()){
				this.play('MoveLeftPopo',20);					
			}
		}
	}
	else if (this._cursors.right.isDown){
		this.muere = true;
		this.alpha = 1;
  		if(!this.atacando){
  			this._direction = 1
 			this.move();
 			if(this.body.onFloor()){
				this.play('MoveRightPopo',20);
			}
  		}
	}
	else{
		if(this._direction === 1&&this.body.onFloor()&&!this.atacando)
			this.frame = 7;
		else if(this._direction === -1&&this.body.onFloor()&&!this.atacando)
			this.frame = 6;	
		this.pulsaTecla = false;
	}
}
};
//METODO DE SALTO
Popo.prototype.jump = function(){
	this.body.velocity.y = this._jumpPower;
};
//metodo morir
Popo.prototype.morir = function (){
	if (this.vivo){
		this.martillo.setPosInits;
		this.muere = false;
		this.vivo = false;
		this.vidas--;
		this.play('MuertePopo',3);
		this.popoMuerteSound.play();
		this.tiempo = this.game.time.totalElapsedSeconds();
	}
	
};
//método para volver a crear a popo
Popo.prototype.resetPopo = function(){
	if(!this.vivo){
		if(this.game.time.totalElapsedSeconds() >= this.tiempo + 3)
			this.kill();
			this.vivo = true;
		 	this.alpha = 0.3;
			this.reset(this.posX- this._direction*20, this.posY);
	}
};
Popo.prototype.killMartillo = function(){
	this.martillo.kill();
};
Popo.prototype.atacandoOff = function(){
	this.atacando = false;
};
Popo.prototype.savePosition = function(){
	if(this.body.onFloor()){
		this.posX = this.x;
		this.posY = this.y;
	}
};

//ENEMIGOS---------------------------------------------------------------------------------
function Enemy(game, x, y,  graphic){
	Movable.call(this, game, x, y, graphic);
};
Enemy.prototype = Object.create(Movable.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.goBack = function(){
	this._direction = -this._direction;
};


//YETI--------------------------------------------------------------------------------------
function Yeti(game, x, y,  graphic){
	Enemy.call(this, game, x, y, graphic);
	this.MoveLeftYeti = this.animations.add('MoveRightYeti',[144,145,146]);
	this.MoveRightYeti = this.animations.add('MoveLeftYeti',[143,142,141]);
	this.MuertoYeti = this.animations.add('MuertoYeti',[140,147]);
	this.detectado = false;
	this.auxD;
};
Yeti.prototype = Object.create(Enemy.prototype);
Yeti.prototype.constructor = Yeti;

Yeti.prototype.update = function(){
	this.suelo = this.body.onFloor();
	if(!this.muerto){
		this.move();
		//ajusto el collider a el tamaño del yeti
		this.body.setSize(18,18,5,3);
		if(this._direction == 1)
			this.play('MoveRightYeti',15);
		else if (this._direction == -1)
			this.play('MoveLeftYeti',15);
	}else{
		this.move();
		this.alpha -= 0.01;
		this.play('MuertoYeti',5);
		if(this.alpha <=0)
			this.destroy();
	}
};

Yeti.prototype.morir = function (){
	this.killEnemySound.play();
	this.muerto = true;
	this._direction = - this._direction;
	this._velocity = this._velocity + 3;
	this.body.enable = false;
};



//OSO--------------------------------------------------------------------------------------
function Oso(game, x, y, graphic, camera){
	Enemy.call(this, game, x, y, graphic);
	this.MoveLeftOso = this.animations.add('MoveRightOso',[0,1,2]);
	this.MoveRightOso = this.animations.add('MoveLeftOso',[3,4,5]);
	this._velocity = 5;

	this.timeReset = true;
	this.tiempoSalto = 5;
	this.jumpPower = -400;
	this.camara = camera;
};
Oso.prototype = Object.create(Enemy.prototype);
Oso.prototype.constructor = Oso;

Oso.prototype.update = function(){
	if(this.timeReset){
		this.timeReset = false;
		this.tiempo = this.game.time.totalElapsedSeconds();
	}

	if(this.game.time.totalElapsedSeconds() > this.tiempo + this.tiempoSalto){
		this.timeReset = true;
		this.jump();
		this.camara.y -= 50;
	}
	if(!this.muerto){
		this.move();
		if(this._direction == 1)
			this.play('MoveRightOso', 10);
		else if (this._direction == -1)
			this.play('MoveLeftOso', 10);
	}
	else if(this.alpha > 0){
		this.alpha -= 0.01;
	}
	else if (this.alpha <= 0)
		this.destroy();
};
Oso.prototype.jump = function(){
	this.body.velocity.y = this.jumpPower;
}

Oso.prototype.morir = function (){
	this.killEnemySound.play();
	this.muerto = true;
	this._direction = 0;
	this.body.enable = false;
};


function Pajaro(game, x, y, graphic, camara){
	this.camara = camara;
	this.tiempoIni = 0;
	this.tiempo = 0;
	this.sumTiempo = this.numeroRandom(46, 15); //Tiempo que va a estar en pantalla
	this.changeMove();	
	Enemy.call(this, game, x, y, graphic);
	this.timeToCambio = 0;
	this.MovIzqBird = this.animations.add('MovIzqBird',[99,100]);
	this.MovDerBird = this.animations.add('MovDerBird',[101,102]);
	this.MuerteBird = this.animations.add('MuerteBird',[98,103]);
};

Pajaro.prototype = Object.create(Enemy.prototype);
Pajaro.prototype.constructor = Pajaro;

Pajaro.prototype.move = function(){
	this.x += this.velX * this.dirX;
	this.y += this.velY * this.dirY;
	if(this.dirX > 0)
		this.play('MovDerBird',10);
	else if(this.dirX < 0)
		this.play('MovIzqBird',10);
};

Pajaro.prototype.changeMove = function(){
	this.velX = Math.trunc(this.numeroRandom(3, 1));
	this.velY = Math.trunc(this.numeroRandom(3, 1));
	this.dirX = this.numeroRandom(2, 0);
	this.dirY = this.numeroRandom(2, 0);
	if(this.dirX < 1){
		this.dirX -= 1;
	}
	if(this.dirY < 1){
		this.dirY -= 1;
	}
};

Pajaro.prototype.update = function(){
	this.body.setSize(16,16,7,5);
	this.tiempo = this.game.time.totalElapsedSeconds();
	if(!this.muerto ){
		this.move();
		if (this.tiempo < this.tiempoIni + this.sumTiempo){ //Si aún está en el tiempo que va a estar en pantalla
			if(this.tiempo > this.timeToCambio){
				this.timeToCambio = this.tiempo + this.numeroRandom(1.5, 0);
				this.changeMove();
			}
			if(this.y < this.camara.y){ 
				this.dirY = 1;
			}
			if(this.y > this.camara.y + this.camara.height){
				this.dirY = -1;
			}
			if(this.x < this.camara.x || this.x > this.camara.x + this.camara.width-30){
				this.dirX = -this.dirX;
			}
		}
		else{ //Si se acaba el tiempo sigue en la dirección que tiene hasta que desaparece de la pantalla
			if(this.y < this.camara.y || this.y > this.camara.y + this.camara.height ||this.x < this.camara.x || this.x > this.camara.x + this.camara.width){
				this.destroy();			
			}	
		}

	}else{
		this.alpha -= 0.01;
		this.play('MuerteBird',10);
		if(this.alpha <= 0)
			this.destroy();
	}
};
Pajaro.prototype.numeroRandom = function(max, min){
	return (Math.random() * (max - min) + min);
};

Pajaro.prototype.morir = function (){
	this.killBirdSound.play();
	this.muerto = true;
	this._direction = 0;
	this.body.enable = false;
};

module.exports = {
	Popo: Popo,
	Yeti: Yeti,
	Oso: Oso,
	Martillo: Martillo,
	Pajaro: Pajaro,
	Pterodactilo: Pterodactilo,
};
},{}],3:[function(require,module,exports){
'use strict';
var cursors 
var pos1 = {'x': 280, 'y': 327};
var pos2 = {'x': 250, 'y': 427 };
var scene;
var GameOver = {
	create: function () {
		this.game.sound.stopAll();
		this.s = this.game.add.audio('OnlyYouMelody',0.3,true);
		this.s.play();
	    cursors = this.game.input.keyboard.createCursorKeys();
	    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);

	    this.martillo = this.game.add.sprite(pos1.x, pos1.y, 'martilloMenu');
	    this.martillo.scale.setTo(0.4, 0.4);
			this.buttonPlay = this.game.add.sprite(300, 325, 'playBTN');
	    this.buttonPlay.scale.setTo(0.5, 0.5);

	    this.menu = this.game.add.sprite(300, 425, 'menuBTN');
	    this.menu.scale.setTo(0.5, 0.5);   

	},

  update: function(){
    cursors.up.onDown.add(this.mueveMartillo, this);
    cursors.down.onDown.add(this.mueveMartillo, this);
    if(this.enterKey.isDown){
      if(this.martillo.x === pos1.x){
        this.actionOnClickPlay();
      }
      else{
       this.actionOnClickMenu();
      }
    }

  },
  mueveMartillo: function(){
    if(this.martillo.x === pos1.x){
        this.martillo.x = pos2.x;
        this.martillo.y = pos2.y;
      }
       else{
          this.martillo.x = pos1.x;
          this.martillo.y = pos1.y;
      }
  },
	
	actionOnClickPlay: function(){
		this.game.state.start('play');
  },

    actionOnClickMenu: function(){
    this.game.state.start('menu_principal');    
},

};
module.exports = GameOver;
},{}],4:[function(require,module,exports){
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
		this.menu = this.game.add.sprite(295, 400, 'menuBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.menu.scale.setTo(0.5, 0.5);
        this.menu.fixedToCamera = true;
        this.menu.bringToTop();

        this.resume = this.game.add.sprite(75, 300, 'resumeBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.resume.scale.setTo(0.5, 0.5);
        this.resume.fixedToCamera = true;
        this.resume.bringToTop();

        this.reset = this.game.add.sprite(500, 300, 'resetBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
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
		this.map = this.game.add.tilemap('mapa2');
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
				this.game.state.start('level3');
			}
			else if(this._popo.muere && this.i < 3 ){
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
				this.game.state.start('level3');
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



},{"./entities.js":2}],5:[function(require,module,exports){
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
		this.menu = this.game.add.sprite(295, 400, 'menuBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.menu.scale.setTo(0.5, 0.5);
        this.menu.fixedToCamera = true;
        this.menu.bringToTop();

        this.resume = this.game.add.sprite(75, 300, 'resumeBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.resume.scale.setTo(0.5, 0.5);
        this.resume.fixedToCamera = true;
        this.resume.bringToTop();

        this.reset = this.game.add.sprite(500, 300, 'resetBTN');//this.game.world.centerX - 265, this.game.world.centerY-260,'icestart');
        this.reset.scale.setTo(0.5, 0.5);
        this.reset.fixedToCamera = true;
        this.reset.bringToTop();

        //TECLAS DE PAUSA--------------------------------
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
		this.map = this.game.add.tilemap('mapa3');
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

		//VARIABLES DEL CODIGO------------------------
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
				this.game.state.start('menu_principal');
			}
			else if(this._popo.muere && this.i < 3 ){
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
			if(this.game.time.totalElapsedSeconds() >= this.time + 5){
				this.game.sound.stopAll();
				this.game.state.start('menu_principal');
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
	//Puntos que salen al matar enemigos y destruir hielos
	sumaPuntos: function(pts){
		this.sumaPunts = this.game.add.bitmapText(Math.random() * (600 - 100) + 100, Math.random() * (600 - 100) + 100, 'fuente_verde','+' + pts, 50);
		this.sumaPunts.fixedToCamera = true;
   		this.game.add.tween(this.sumaPunts).to( {y: 0, alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0);// Number.MAX_VALUE, true);
   		this.ptosUpdate();

	},
	mataEnemigo: function(martillo, enemy){
		enemy.morir();	
	},
	//logica del yeti para rellenar los huecos
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



},{"./entities.js":2}],6:[function(require,module,exports){
'use strict';
//  <link href="styles.css" rel="stylesheet" type="text/css">

var Level2 = require('./level2.js');
var Level3 = require('./level3.js');
var PlayScene = require('./play_scene.js');
var MenuPrincipal = require('./menu_principal.js');
var Creditos = require('./creditos.js');
var GameOver = require('./game_over.js');
//var unique = require ('unique');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

   this.game.load.bitmapFont('fuente', 'fonts/font.png', 'fonts/font.fnt');
   this.game.load.bitmapFont('fuente_verde', 'fonts/fontV.png', 'fonts/fontV.fnt');

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
//Imágenes menú pcpal
    this.game.load.image('creditosBTN', 'images/credits.png');
    this.game.load.image('playBTN', 'images/play.png'); 
    this.game.load.image('icestart', 'images/titleCompleted.png');
    this.game.load.image('martilloMenu', 'images/martilloMenu.png');
  //Imágenes pausa juego
    this.game.load.image('menuBTN', 'images/MainMenu.png');
    this.game.load.image('resumeBTN', 'images/resume.png');
    this.game.load.image('resetBTN', 'images/reset.png');

  //Imagenes personajes
    this.game.load.image('berenjena', 'images/berenjena.png');
    this.game.load.spritesheet('oso', 'images/SpritesJson/oso.png', 17.5, 31, 6);
    this.game.load.spritesheet('personajes', 'images/SpritesJson/Personajes.png', 29.571428571428, 27.076923076923, 200);
    this.game.load.spritesheet('personajesPajaro', 'images/SpritesJson/Personajes.png', 29, 26, 200);
    this.game.load.spritesheet('personajesPt', 'images/SpritesJson/Personajes.png', 38, 26, 200);
    this.game.load.image('vidasPopo', 'images/vida.png');
    
  //Mapa
    this.game.load.tilemap('mapa', 'images/Mapa1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('mapa2', 'images/Mapa2.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('mapa3', 'images/Mapa3.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'images/TileSet.png');

  //Sonidos
  	this.game.load.audio('himalayaMelody',['Sounds/melodias/himalaya.mp3','Sounds/melodias/himalaya.ogg']);
  	this.game.load.audio('menuMelody',['Sounds/melodias/Menu1.mp3','Sounds/melodias/Menu1.ogg']);
  	this.game.load.audio('OnlyYouMelody','Sounds/melodias/OnlyYou.mp3');
  	this.game.load.audio('jumpSound','Sounds/SonidosWeb/jump.wav');
  	this.game.load.audio('killEnemySound','Sounds/SonidosWeb/matarEnemigo.wav');
  	this.game.load.audio('killBirdSound','Sounds/SonidosWeb/muertePajaro.wav');
  	this.game.load.audio('popoMuerteSound','Sounds/SonidosWeb/muertePopo.wav');
  	this.game.load.audio('puntosSound','Sounds/SonidosWeb/puntos.wav');
  	this.game.load.audio('marcadorSound','Sounds/melodias/marcador.wav');
  	this.game.load.audio('bonusSound',['Sounds/melodias/Menu2.mp3','Sounds/melodias/Bonus.ogg']);

  	this.game.load.onLoadComplete.add(this.loadComplete, this);
  },

  loadComplete: function () {
    this.game.state.start('menu_principal');
  }
};


window.onload = function () {
  var game = new Phaser.Game(770, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('level2', Level2);
  game.state.add('level3', Level3);
  game.state.add('menu_principal', MenuPrincipal);
  game.state.add('creditos', Creditos);
  game.state.add('gameOver', GameOver);


  game.state.start('boot');
};

},{"./creditos.js":1,"./game_over.js":3,"./level2.js":4,"./level3.js":5,"./menu_principal.js":7,"./play_scene.js":8}],7:[function(require,module,exports){
'use strict';
var cursors 
var pos1 = {'x': 280, 'y': 327};
var pos2 = {'x': 250, 'y': 427 };
var MenuPcpal = {
	create: function () {
    this.game.sound.stopAll();
    this.menuMelody = this.game.add.audio('menuMelody',0.3,true);
    this.menuMelody.play();
   // this.menuMelody.fadeIn(10000);
    this.marcadorSound = this.game.add.sound('marcadorSound');

    cursors = this.game.input.keyboard.createCursorKeys();
    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);

    
	this.imagen = this.game.add.sprite(125, 25,'icestart');
    this.imagen.scale.setTo(1.5, 1.5);

    this.martillo = this.game.add.sprite(pos1.x, pos1.y, 'martilloMenu');
    this.martillo.scale.setTo(0.4, 0.4);
	this.buttonPlay = this.game.add.sprite(300, 325, 'playBTN');
    this.buttonPlay.scale.setTo(0.5, 0.5);

    this.buttonCreditos = this.game.add.sprite(300, 425, 'creditosBTN');
    this.buttonCreditos.scale.setTo(0.5, 0.5);   

},

update: function(){
    cursors.up.onDown.add(this.mueveMartillo, this);
    cursors.down.onDown.add(this.mueveMartillo, this);
    if(this.enterKey.isDown){
      if(this.martillo.x === pos1.x){
        this.actionOnClickPlay();
      }
      else{
       this.actionOnClickCreditos();
      }
    }

},
mueveMartillo: function(){
  this.marcadorSound.play();
    if(this.martillo.x === pos1.x){
        this.martillo.x = pos2.x;
        this.martillo.y = pos2.y;
      }
       else{
          this.martillo.x = pos1.x;
          this.martillo.y = pos1.y;
      }
  },
	
	actionOnClickPlay: function(){
    
		this.game.state.start('play');
  },

    actionOnClickCreditos: function(){
    this.game.state.start('creditos',this.menuMelody);    
},

};

module.exports = MenuPcpal;
},{}],8:[function(require,module,exports){
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



},{"./entities.js":2}]},{},[6]);

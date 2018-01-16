(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var scene;
var Creditos = {
	create: function () {
		
		var buttonMenu = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY - 100, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        buttonMenu.anchor.set(0.5);
        var textMenu = this.game.add.text(0, 0, "Menu Principal");
        textMenu.font = 'Sniglet';
        textMenu.anchor.set(0.5);
        buttonMenu.addChild(textMenu);
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
 	Objeto.call(this, game, x, y, graphic);
  
};
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;
// METODO QUE HACE QUE SE MUEVA EL OBJETO
Movable.prototype.move = function(){
	//USO this.x EN VEZ DE this.body.velocity.x PORQUE CON EL SEGUNDO SE MUEVE CON ACELERACION
	this.x += this._velocity * this._direction;
//Toroide	
	/*if(this.x > this.game.width - this.width-30)
		this.x = 2;
	else if(this.x < 1)
		this.x = this.game.width - this.width-30;
/*lado a lado*/
	if(this.x > this.game.width - this.width -30)
		this._direction = -1;
	else if(this.x < 1)
		this._direction = 1;
};


//MARTILLO-------------------------------------------------------------------------------
//PREGUNTAR A CARLOS COMO IMPLEMENTAR EL ATAQUE DEL MARTILLO
function Martillo (game, x, y, graphic){
 	Objeto.call(this, game, x, y, graphic);
 	this.xInit = x;
 	this.yInit = y;
};
Martillo.prototype = Object.create(Objeto.prototype);
Martillo.prototype.constructor = Martillo;
Martillo.prototype.setPosInit = function(){
	this.x = this.xInit;
	this.y = this.yInit;
};
Martillo.prototype.setPosIzq = function(){
	this.x = -10;
	this.y = 10;
}
Martillo.prototype.setPosDer = function(){
	this.x = 25;
	this.y = 10;
}
Martillo.prototype.setPosJump = function(){
	this.x = 7;
	this.y = -10;
}

//POPO-----------------------------------------------------------------------------------
// EN EL MÉTODO UPDATE SE IMPLEMENTA LA LÓGICA DEL MOVIMIENTO
// EN FUNCION DE LAS TECLAS QUE SE PULSEN
function Popo (game, x, y, martillo, graphic,salto){
	Movable.call(this, game, x, y, graphic);
	this._cursors = game.input.keyboard.createCursorKeys();
	this._jumpPower = -500;
 	this.atacando = false;
 	this.tiempo;
 	this.vivo = true;
 	this.vidas = 4;
 	this._velocity = 3;
 	this.martillo = martillo;
	this.hInit = this.height*3;
	this.wInit = this.width*3;
	
	
	this.MoveLeftPopo = this.animations.add('MoveRightPopo',[0,1,2,3]);
	this.MoveRightPopo = this.animations.add('MoveLeftPopo',[4,5,6,7]);

	this.JumpRightPopo = this.animations.add('JumpRightPopo',[11,8,9,10]);
	this.JumpLeftPopo = this.animations.add('JumpLeftPopo',[12,15,14,13]);

	this.AtaqueRightPopo = this.animations.add('AtaqueRightPopo',[8,9,10]);
	this.AtaqueLeftPopo = this.animations.add('AtaqueLeftPopo',[15,14,13]);
};
Popo.prototype = Object.create(Movable.prototype);
Popo.prototype.constructor = Popo;

Popo.prototype.update = function(){
	if(this.vivo){
		this.keyboardInput();
	}
	else{
		if(this.vidas > 0){
			this.resetPopo();
		}
	}
	this.game.debug.text('Vidas: ' + this.vidas, 0, 600);
};

//EN ESTE METODO SE CAPTURAN LAS TECLAS QUE SE PULSAN Y SE REALIZA LA FUNCION CORRESPONDIENTE
Popo.prototype.keyboardInput = function(){
	if(this.body.onFloor()){
			this.height = this.hInit;
			this.width = this.wInit;
		}

	if(this._cursors.down.isDown&&this.body.onFloor()){
		this.atacando = true;
		if(this._direction === -1){
			
			if(!this.AtaqueRightPopo.isPlaying){
				this.y -= 12.8;
				this.height *= 1.35;
				this.width *= 1.35;
			}
			this.play('AtaqueLeftPopo', 10);	
			this.martillo.setPosIzq();
  			this.AtaqueLeftPopo.onComplete.add(this.martillo.setPosInit,this.martillo);
  			this.AtaqueLeftPopo.onComplete.add(this.atacandoOff,this);
		}
		else if(this._direction === 1){
			if(!this.AtaqueLeftPopo.isPlaying){
				this.y -= 12.8;
				this.height *= 1.35;
				this.width *= 1.35;
			}
			this.play('AtaqueRightPopo', 10);
			this.martillo.setPosDer();
  			this.AtaqueRightPopo.onComplete.add(this.martillo.setPosInit,this.martillo);
  			this.AtaqueRightPopo.onComplete.add(this.atacandoOff,this);
		}
	}
	//SALTO-------------------------------------
  	else if (this._cursors.up.isDown&&this.body.onFloor()){
  		if(!this.atacando){
	 		this.jump();
			this.martillo.setPosJump();
			if(this._direction === -1){
				this.play('JumpLeftPopo', 10);
				this.height *= 1.35;
				this.width *= 1.35;
  				this.JumpLeftPopo.onComplete.add(this.martillo.setPosInit,this.martillo);
			}
			else if(this._direction === 1){
				this.play('JumpRightPopo', 10);
				this.height *= 1.35;
				this.width *= 1.35;
  				this.JumpRightPopo.onComplete.add(this.martillo.setPosInit,this.martillo);			
			}
		}
  	}
	//TECLAS MOVIMIENTO-------------------------
	else if (this._cursors.left.isDown){
		if(!this.atacando){
			//this.martillo.setPosInit();
			this._direction = -1;
			this.move();
			if(this.body.onFloor()){
				this.play('MoveLeftPopo',20);					
			}
		}
	}
	else if (this._cursors.right.isDown){
  		if(!this.atacando){
  			//this.martillo.setPosInit();
  			this._direction = 1
	 			this.move();
	 			if(this.body.onFloor()){
					this.play('MoveRightPopo',20);
			}
  		}
	}else{
		if(this._direction === 1&&this.body.onFloor()&&!this.atacando){
			this.frame = 0;
		}
		else if(this._direction === -1&&this.body.onFloor()&&!this.atacando)
			this.frame = 7;

		if(this.body.onFloor()){
			this.height = this.hInit;
			this.width = this.wInit;
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
		this.vivo = false;
		this.vidas--;
		this.kill();
		//this.body.enable = false;
		this.tiempo =  this.game.time.totalElapsedSeconds();
	}
	
};
//método para volver a crear a popo
Popo.prototype.resetPopo = function(){
	if(!this.vivo){
		if( this.game.time.totalElapsedSeconds() >= this.tiempo + 2)
		{
			this.reset(50, 50);
			this.vivo = true;

		}
	}
};
Popo.prototype.killMartillo = function(){
	this.martillo.kill();
};
Popo.prototype.atacandoOff = function(){
	this.atacando = false;
};

//YETI--------------------------------------------------------------------------------------
function Yeti(game, x, y,  graphic,muerto){
	Movable.call(this, game, x, y, graphic);
	this.MoveLeftYeti = this.animations.add('MoveRightYeti',[0,1,2]);
	this.MoveRightYeti = this.animations.add('MoveLeftYeti',[3,4,5]);
	//this.muerto = game.add.sprite(0,0,muerto);
	//this.MuertoYeti = this.muerto.animations.add('MuertoYeti',[0,1]);
};
Yeti.prototype = Object.create(Movable.prototype);
Yeti.prototype.constructor = Yeti;

Yeti.prototype.update = function(){
	this.move();
	if(this._direction == 1)
		this.play('MoveRightYeti',15);
	else if (this._direction == -1)
		this.play('MoveLeftYeti',15);
};

Yeti.prototype.morir = function (){
	//this.play('MuertoYeti',15);
};


//OSO--------------------------------------------------------------------------------------
function Oso(game, x, y, graphic){
	Movable.call(this, game, x, y, graphic);
	this.MoveLeftOso = this.animations.add('MoveRightOso',[0,1,2]);
	this.MoveRightOso = this.animations.add('MoveLeftOso',[3,4,5]);
};
Oso.prototype = Object.create(Movable.prototype);
Oso.prototype.constructor = Yeti;

Oso.prototype.update = function(){
	this.move();
	if(this._direction == 1)
		this.play('MoveRightOso',15);
	else if (this._direction == -1)
		this.play('MoveLeftOso',15);
};

Oso.prototype.morir = function (){};

module.exports = {
	Popo: Popo,
	Yeti: Yeti,
	Oso: Oso,
	Martillo: Martillo
};
},{}],3:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
var MenuPrincipal = require('./menu_principal.js');
var Creditos = require('./creditos.js');
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

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('popo', 'images/popo.PNG');
    this.game.load.image('button', 'images/start.png');
    

    this.game.load.spritesheet('saltoPopo', 'images/SaltoPopo.png', 23, 36, 8);
    this.game.load.spritesheet('popoMartillo', 'images/PopoMartillo.png', 23, 27, 16);
    this.game.load.spritesheet('popo', 'images/popo.png', 17, 20, 8);
    this.game.load.spritesheet('pterodactilo', 'images/pterodactilo.png', 35, 30, 6);
    this.game.load.spritesheet('yetiMuerto', 'images/yetiMuerte.png', 16, 15, 6);
    this.game.load.spritesheet('yeti', 'images/Yeti.png', 17.8333, 14, 6);
    this.game.load.spritesheet('oso', 'images/oso.png', 17.5, 31, 6);
    this.game.load.spritesheet('spritesGame', 'images/Sprites.png', 27, 35, 128);

    this.game.load.tilemap('mapa', 'images/Mapa1.json', null, Phaser.Tilemap.TILED_JSON);
    

    this.game.load.image('tiles', 'images/TileSet.png');

  },

  create: function () {
    this.game.state.start('menu_principal');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('menu_principal', MenuPrincipal);
  game.state.add('creditos', Creditos);


  game.state.start('boot');
};

},{"./creditos.js":1,"./menu_principal.js":4,"./play_scene.js":5}],4:[function(require,module,exports){
'use strict';
var scene;
var MenuLevel = {
	create: function () {
		var buttonPlay = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY - 100, 
                                               'button', 
                                               this.actionOnClickPlay, 
                                               this, 2, 1, 0);
        buttonPlay.anchor.set(0.5);
        var textPlay = this.game.add.text(0, 0, "Play");
        textPlay.font = 'Sniglet';
        textPlay.anchor.set(0.5);
        buttonPlay.addChild(textPlay);

        var buttonCreditos = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY + 100, 
                                               'button', 
                                               this.actionOnClickCreditos, 
                                               this, 2, 1, 0);
        buttonCreditos.anchor.set(0.5);
        var textCreditos = this.game.add.text(0, 0, "Creditos");
        textCreditos.font = 'Sniglet';
        textCreditos.anchor.set(0.5);
        buttonCreditos.addChild(textCreditos);

	},
	
	actionOnClickPlay: function(){
		scene = 'play';
        this.initState();
    },

    actionOnClickCreditos: function(){
		scene = 'creditos';
        this.initState();
    },

	initState: function(){
		this.game.state.start(scene);
	}
}

module.exports = MenuLevel;
},{}],5:[function(require,module,exports){
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
		this._popo = new entities.Popo(this.game, 400, 1200,this.martillo, 'popoMartillo');
		this._popo.height *= 3;
		this._popo.width *= 3;
		this.game.world.addChild(this._popo);
		this._popo.addChild(this.martillo);

		
		//DETECTOR YETI-----------------------------------------
		/*this.detector = new entities.Detector(this.game, 20, 100, 100, 100, 'logo');//this._yeti.height, this._yeti.width, 'logo');
		this.detector.height *= 0.1;
		this.detector.width *= 0.1;*/

		//YETI-------------------------------------
		this._yeti = new entities.Yeti(this.game,500,1000,'yeti','yetiMuerto');
		this._yeti.height *= 5;
		this._yeti.width *= 5;
		this.game.world.addChild(this._yeti);
		//this._yeti.addChild(this.detector);


		


		//OSO---------------------------------------
		this._oso = new entities.Oso(this.game,10,100,'oso');
		this._oso.height *= 4;
		this._oso.width *= 4;
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
		/*this.game.debug.body(this._popo);
		this.game.debug.body(this.martillo);
		this.game.debug.body(this._oso);
		this.game.debug.body(this._yeti);*/
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



},{"./entities.js":2}]},{},[3]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//OBJETO-----------------------------------------------------
function Objeto (game, x, y, graphic){
    this._obj = game.add.sprite( x,  y, graphic);
    this._obj.scale.setTo(0.5, 0.5);
};
Objeto.prototype.constructor = Objeto;

//MOVIBLE-----------------------------------------
function Movable (game, x, y, graphic){
  Objeto.call(this, game, x, y, graphic);
  
}
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;

/*
Movable.prototype.move = function (vel) {
  this.body.velocity.x = vel; 
};*/

//POPO-----------------------------------------------------------------
function Popo (game, x,y,graphic){
  Movable.call(this, game, x, y, graphic);
  /*this._popo.moveLeft = function(x){
      this.body.velocity.x = x; 
    }
    this._popo.moveRight = function(x){
      this.body.velocity.x = x; 
    }*/
this._obj.move = function (vel) {
    this.body.velocity.x = vel;
  }
  
  this._obj.jump = function(y){
      if(this.body.onFloor())
         this.body.velocity.y = y;
  }
  return this._obj;
}
Popo.prototype = Object.create(Movable.prototype);
Popo.prototype.constructor = Popo;

//ENEMIGO-------------------------------------------------------------
function Enemy(game, x, y, graphic){
  Movable.call(this, game, x, y, graphic);
  //this.game.physics.arcade.enable(this._obj);
  //this._obj.body.collideWorldBounds = true;

 /* this._obj.move = function (vel) {
    if(this._obj.body.x >= (500)){
          vel = -vel;
        }
    this.body.velocity.x = vel; 
  }
  return this._obj;*/
}
Enemy.prototype = Object.create(Movable.prototype);
Enemy.prototype.constructor = Enemy;

/*Enemy.prototype.morir = function (){};
Enemy.prototype.atravesarVerticales = function (){};*/

//YETI--------------------------------------------------------------
function Yeti(game, x, y){
  Enemy.call(this, game, x, y, 'yeti');

  this._obj.move = function (vel) {
    if(this.body.x >= (this.game.widht-200)){
          vel = -vel;
        }
    this.body.velocity.x = vel; 
  }
  return this._obj;
}
Yeti.prototype = Object.create(Enemy.prototype);
Yeti.prototype.constructor = Yeti;

//Yeti.prototype.tapaSuelo = function (){};

//OSO-----------------------------------------------------------------
function Oso(game, x, y){
  Enemy.call(this, game, x, y, 'oso');

  //this.body.velocity.x = 50;
  this._obj.move = function (vel) {
    if(this.body.x >= (1000)){
          vel = -vel;
        }
    this.body.velocity.x = vel; 
  }
  return this._obj;
}
Oso.prototype = Object.create(Enemy.prototype);
Oso.prototype.constructor = Oso;

module.exports = {
  Objeto: Objeto,
  Movable: Movable,
  Popo: Popo,
  Yeti: Yeti,
  Oso: Oso,
};
},{}],2:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');


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

    /*this.game.load.baseURL = 'https://Gonalba.github.io/IceClimbers/src/';
    this.game.load.crossOrigin = 'anonymous';*/

    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('popo', '../images/popo.png');
    this.game.load.image('oso', '../images/oso.png');
    this.game.load.image('yeti', '../images/yeti.png');
    
    this.game.load.tilemap('mapa', 'images/PuebaMap2.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('patron', 'images/SueloTile.png');
  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};

},{"./play_scene.js":3}],3:[function(require,module,exports){
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
		this._yeti.move(50);

		this._oso.move(50);


	},

	update: function(){
		this.game.physics.arcade.collide(this._popo, this.groundLayer);
		this.game.physics.arcade.collide(this._oso, this.groundLayer);
		this.game.physics.arcade.collide(this._yeti, this.groundLayer);
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
},{"./entities.js":1}]},{},[2]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
function Objeto (game, x, y, graphic){
    this._obj = game.add.sprite( x,  y, graphic);
    this._obj.scale.setTo(0.5, 0.5);
};
Objeto.prototype.constructor = Objeto;

function Movable (game, x, y, graphic){
  Objeto.call(this, game, x, y, graphic);}
  /*this._obj.move = function(vel){ 
    this._obj.body.velocity.x = vel; 
  }
return this._obj;
}*/
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;
/*
Movable.prototype.move = function(vel){ 
    this._obj.body.velocity.x = vel; 
  };

*/

function Popo (game, x,y){
  Movable.call(this, game, x, y, 'popo');

  /*this._popo.moveLeft = function(x){
      this.body.velocity.x = x; 
    }
    this._popo.moveRight = function(x){
      this.body.velocity.x = x; 
    }
*/  this._obj.move = function(vel){ 
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

module.exports = {
  Objeto: Objeto,
  Movable: Movable,
  Popo: Popo,
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
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('popo', '../images/popo.png');
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

	create: function () {
		this._popo = new entities.Popo(this.game, 500, 1900);
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this._popo);        
        this.game.physics.arcade.gravity.y = 500;  
        this._popo.body.bounce.y = 0.2;
        //this._popo.body.collideWorldBounds = true;
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

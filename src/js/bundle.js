(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
function Popo (game, x,y){
	this._popo = game.add.sprite(x,y,'popo');

	this._popo.moveLeft = function(x){
    	this.body.velocity.x = x; 
    }
    this._popo.moveRight = function(x){
      this.body.velocity.x = x; 
    }

    this._popo.jump = function(y){
          if(this.body.onFloor())this.body.velocity.y = y;
	}
	return this._popo;
};
Popo.prototype.constructor = Popo;

module.exports = {
  Popo: Popo
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
    this.game.load.image('popo', '../images/oso.png');
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
		this._popo = new entities.Popo(this.game, this.game.world.centerX, this.game.world.centerY);
    	//this.configure();
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this._popo);        
        this.game.physics.arcade.gravity.y = 300;  
        this._popo.body.bounce.y = 0.2;
        this._popo.body.collideWorldBounds = true;
	
	this.cursors = this.game.input.keyboard.createCursorKeys();
	},

	update: function(){
		this._popo.body.velocity.x = 0;

		if (this.cursors.left.isDown){
			this._popo.moveLeft(-250);
		}
		else if(this.cursors.right.isDown){
			this._popo.moveRight(250);
		}
		else if(this.cursors.up.isDown && this._popo.body.onFloor()){
			this._popo.jump(1000);
		}
	}
};

module.exports = PlayScene;

},{"./entities.js":1}]},{},[2]);

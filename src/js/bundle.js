(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
//var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
'use strict';
//variables que contienen los demas scripts
var PlayScene = require('./play_scene.js');



var PreloaderScene = {
	preload: function () {
		this.game.load.image('oso', '../images/oso.png');
	},
	create: function() {
		this.game.state.start('playScene');
	}
};

window.onload = function () {
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game');
  //TODO 1.2 Añadir los states 'boot' BootScene, 'menu, 'preloader' PreloaderScene, 'play' PlayScene, 'gameOver' GameOver.
	game.state.add('boot', BootScene);
	game.state.add('playScene', MenuScene);
	game.state.add('preloader', PreloaderScene);


	//TODO 1.3 iniciar el state 'boot'. 
	game.state.start('preloader');
};
*/
/*
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
    this.game.load.image('oso', 'images/oso.png');
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

*/

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });



function preload() {
	
	game.load.baseURL = 'https://gonalba.github.io/IceClimbers/src/';

    game.load.crossOrigin = 'anonymous';

    //game.load.image('phaser', 'sprites/phaser-dude.png');

    game.load.image('oso', 'images/oso.png');
    game.load.image('plataforma', 'images/preloader_bar.png');
    //game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}
var collisionPlatOso = false;
var oso;
var plataforma;
var cursors;
var jumpButton;
var jumpTimer = 0;

//var sprite2;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE); //añado la fisica al juego

    game.stage.backgroundColor = '#2d2d2d';

    game.physics.arcade.gravity.y = 300; // gravedad
//oso
    // añado el sprite del oso y le doy fisica
    oso = game.add.sprite(100, 300, 'oso');
    oso.anchor.set(0.5);
    oso.scale.set(0.5);
   	game.physics.arcade.enable(oso, Phaser.Physics.ARCADE);
	//oso.body.bounce.y = 0.3;  // para que al caer rebote en el suelo
    oso.body.collideWorldBounds = true;	// el collider no sale de los limites del mundo

//plataforma
    // añado el sprite de la plataforma y le doy fisica
    plataforma = game.add.sprite(300, 450, 'plataforma');
   	game.physics.arcade.enable(plataforma, Phaser.Physics.ARCADE);
    
    plataforma.body.allowGravity = false;	//	la gravedad no le afecta
    plataforma.body.immovable = true;	//	la plataforma es inmovible


   	cursors = game.input.keyboard.createCursorKeys();
   	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {
	game.physics.arcade.collide(oso, plataforma,collisionTrue, null, this);//para que el oso se quede encima de la plataforma y no la atraviese
	

	oso.body.velocity.x = 0;
	if (cursors.left.isDown){
		oso.body.velocity.x = -250;
	}
	else if(cursors.right.isDown){
		oso.body.velocity.x = 250;
	}

	if ((jumpButton.isDown) && (oso.body.onFloor() || collisionPlatOso)) // si se a pulsado el espacio y esta en el suelo o en una plataforma
    {
        oso.body.velocity.y = -1000;
        
    }
    collisionPlatOso = false;

}

//metodo para saber si esta colisionando con una plataforma
function collisionTrue (obj1, obj2) {

    collisionPlatOso = true;

}



function render() {

    /*game.debug.body(plataforma);
    game.debug.body(oso);*/
}

},{}]},{},[1]);

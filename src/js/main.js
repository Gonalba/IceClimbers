
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
//-------------------------------------------------------------------------------

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


//-------------------------------------------------------------------------
/*
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var sprite1;
var sprite2;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

<<<<<<< HEAD
    sprite1 = game.add.sprite(300, 50, 'atari');
    sprite2 = game.add.sprite(400, 450, 'mushroom');
=======
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
>>>>>>> parent of 62124ff... calibracion gravedad

    game.physics.arcade.enable(sprite1, Phaser.Physics.ARCADE);

    //game.add.tween(sprite1.body).to( { y: 400 }, 3000, Phaser.Easing.Linear.None, true);

}

function update() {
<<<<<<< HEAD
	sprite1.body.velocity.x = -150;
    game.physics.arcade.overlap(sprite1, sprite2, overlapHandler, null, this);
=======
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
>>>>>>> parent of 62124ff... calibracion gravedad

}

function overlapHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

    obj2.kill();

}

function render() {

    game.debug.body(sprite1);
    game.debug.body(sprite2);

}*/
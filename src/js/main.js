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

var oso;
var plataforma;
var cursors;
var jumpButton;
var jumpTimer = 0;

//var sprite2;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';
	
    plataforma = game.add.sprite(300, 100, 'plataforma');
	//game.physics.arcade.enable(plataforma, Phaser.Physics.ARCADE);

    game.physics.arcade.gravity.y = 500;

    oso = game.add.sprite(300, 300, 'oso');
   	game.physics.arcade.enable(oso, Phaser.Physics.ARCADE);
   // sprite2 = game.add.sprite(400, 450, 'mushroom');
    

	oso.body.bounce.y = 0.2;
    oso.body.collideWorldBounds = true;
    oso.body.setSize(oso.width, oso.height);

    //game.add.tween(sprite1.body).to( { y: 400 }, 3000, Phaser.Easing.Linear.None, true);
   	cursors = game.input.keyboard.createCursorKeys();
   	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {
	oso.body.velocity.x = 0;
	if (cursors.left.isDown){
		oso.body.velocity.x = -250;
	}
	else if(cursors.right.isDown){
		oso.body.velocity.x = 250;
	}

	if (jumpButton.isDown && oso.body.onFloor())
    {
        oso.body.velocity.y = -450;
        //jumpTimer = game.time.now + 750;
    }
   // game.physics.arcade.overlap(sprite1, sprite2, overlapHandler, null, this);			&& game.time.now > jumpTimer

}



function render() {

   // game.debug.body(sprite1);
    //game.debug.body(sprite2);

}


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', '../images/oaso.png');
    game.load.image('mushroom', '../images/osoa.png');

}

var sprite1;
var sprite2;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(400, 50, 'atari');
    sprite2 = game.add.sprite(400, 450, 'mushroom');

    game.physics.arcade.enable([ sprite1, sprite2 ], Phaser.Physics.ARCADE);

    //game.add.tween(sprite1.body).to( { y: 450 }, 3000, Phaser.Easing.Linear.None, true);

}

function update() {

	//sprite1.body.velocity.x = -150;
    game.physics.arcade.overlap(sprite1, sprite2, overlapHandler, null, this);

}

function overlapHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

    obj2.kill();

}

function render() {

   // game.debug.body(sprite1);
   // game.debug.body(sprite2);

}

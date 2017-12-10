
/*'use strict';

var PlayScene = {
  	create: function () {
   		var oso = this.game.add.sprite(600, 100, 'oso');
    	//oso.anchor.setTo(0.5, 0.5);
    	//oso.scale.setTo(0.75, 0.75);
    	
    	/*this.game.physics.startSystem(Phaser.Physics.ARCADE);
	    this.game.physics.arcade.enable(oso , Phaser.Physics.ARCADE);

    	//game.add.tween(sprite1.body).to( { y: 450 }, 3000, Phaser.Easing.Linear.None, true);

	},

	update: function () {

		//sprite1.body.velocity.x = -150;
	    //this.game.physics.arcade.overlap(sprite1, sprite2, overlapHandler, null, this);

	}
};

module.exports = PlayScene;*/



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



	    /*this.game.physics.startSystem(Phaser.Physics.ARCADE); //añado la fisica al juego

	    this.game.stage.backgroundColor = '#2d2d2d';

	    this.game.physics.arcade.gravity.y = 650; // gravedad
	//oso
	    // añado el sprite del oso y le doy fisica
	    var oso = this.game.add.sprite(
	      this.game.world.centerX, this.game.world.centerY, 'oso');
	    
	    oso.anchor.set(0.5);
	    oso.scale.set(0.5);
	    this.game.physics.arcade.enable(oso, Phaser.Physics.ARCADE);
	    oso.body.bounce.y = 0.3;  // para que al caer rebote en el suelo
	    oso.body.collideWorldBounds = true; // el collider no sale de los limites del mundo

*/

		/*this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.enable(oso , Phaser.Physics.ARCADE);*/

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

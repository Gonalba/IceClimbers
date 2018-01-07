'use strict';
var entities = require('./entities.js');

var PlayScene = {
  create: function () {

   	this._popo = new entities.Popo(this.game, 100, 100,'popo');
   	this._popo.height *= 0.5;
   	this._popo.width *= 0.5;

   	this.game.world.addChild(this._popo);
   	this.configure();	   

    
  },
  update: function(){
  	this._popo.update();
  	
  		
  		
  },
  configure: function(){
       //Start the Arcade Physics system
       //this.game.world.setBounds(0,0, 2560 , 800);
       this.game.physics.startSystem(Phaser.Physics.ARCADE);
       this.game.physics.arcade.enable(this._popo);        
       this.game.physics.arcade.gravity.y = 200;  
       this._popo.body.bounce.y = 0.2;
       this._popo.body.collideWorldBounds = true;
       this.game.camera.follow(this._popo);
       this.cursors = this.game.input.keyboard.createCursorKeys();
   },
};

module.exports = PlayScene;

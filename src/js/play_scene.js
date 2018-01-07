'use strict';
var entities = require('./entities.js');

var PlayScene = {
  create: function () {

  	//POPO--------------------------------------
   	this._popo = new entities.Popo(this.game, 100, 100,'spritesGame');
   	this._popo.height *= 3;
   	this._popo.width *= 3;
   	this.game.world.addChild(this._popo);
   	
   	//YETI-------------------------------------
   	this._yeti = new entities.Yeti(this.game,100,100,'yeti');
   	this._yeti.height *= 0.5;
   	this._yeti.width *= 0.5;
   	this.game.world.addChild(this._yeti);

   	//OSO---------------------------------------
   	this._oso = new entities.Oso(this.game,10,100,'oso');
   	this._oso.height *= 0.5;
   	this._oso.width *= 0.5;
   	this.game.world.addChild(this._oso);


   	this.configure();	       
  },
  update: function(){
  	this._popo.update();
  	
  		
  		
  },
  render : function(){
  	this.game.debug.bodyInfo(this._popo, 32, 32);

  	this.game.debug.body(this._popo);

  },
  configure: function(){
       //Start the Arcade Physics system
       //this.game.world.setBounds(0,0, 2560 , 800);
       this.game.physics.startSystem(Phaser.Physics.ARCADE);
       this.game.physics.arcade.gravity.y = 200;  
       this.cursors = this.game.input.keyboard.createCursorKeys();
       
       //POPO----------------------------
       this.game.physics.arcade.enable(this._popo);        
       this._popo.body.bounce.y = 0.2;
       this._popo.body.collideWorldBounds = true;
       this.game.camera.follow(this._popo);

       //YETI----------------------------
       this.game.physics.arcade.enable(this._yeti);        
       this._yeti.body.bounce.y = 0.2;
       this._yeti.body.collideWorldBounds = true;

       //OSO----------------------------
       this.game.physics.arcade.enable(this._oso);        
       this._oso.body.bounce.y = 0.2;
       this._oso.body.collideWorldBounds = true;
   },
};

module.exports = PlayScene;

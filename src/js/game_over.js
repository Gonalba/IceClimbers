'use strict';
var cursors 
var pos1 = {'x': 280, 'y': 327};
var pos2 = {'x': 250, 'y': 427 };
var scene;
var GameOver = {
	create: function () {
    cursors = this.game.input.keyboard.createCursorKeys();
    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);

    this.martillo = this.game.add.sprite(pos1.x, pos1.y, 'martilloMenu');
    this.martillo.scale.setTo(0.4, 0.4);
		this.buttonPlay = this.game.add.sprite(300, 325, 'playBTN');
    this.buttonPlay.scale.setTo(0.5, 0.5);

    this.menu = this.game.add.sprite(300, 425, 'menuBTN');
    this.menu.scale.setTo(0.5, 0.5);   

	},

  update: function(){
    cursors.up.onDown.add(this.mueveMartillo, this);
    cursors.down.onDown.add(this.mueveMartillo, this);
    if(this.enterKey.isDown){
      if(this.martillo.x === pos1.x){
        this.actionOnClickPlay();
      }
      else{
       this.actionOnClickMenu();
      }
    }

  },
  mueveMartillo: function(){
    if(this.martillo.x === pos1.x){
        this.martillo.x = pos2.x;
        this.martillo.y = pos2.y;
      }
       else{
          this.martillo.x = pos1.x;
          this.martillo.y = pos1.y;
      }
  },
	
	actionOnClickPlay: function(){
		this.game.state.start('play');
  },

    actionOnClickMenu: function(){
    this.game.state.start('menu_principal');    
},

};
module.exports = GameOver;
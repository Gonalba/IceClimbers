'use strict';

var PlayState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3};
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3};
var controls;


var PlayScene = {
	_popo: {}, //player
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 150, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,
  create: function () {
   /*var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);*/
    controls = {
        right: this.input.keyboard.addKey(Phaser.Keyboard.D),
        left: this.input.keyboard.addKey(Phaser.Keyboard.A),
        up: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
      };
    
    this._popo = this.game.add.sprite(150,150,'popo');
          this._popo.scale.setTo(0.75, 0.75);
      },
update: function() {
   	 var cursors = this.game.input.keyboard.createCursorKeys();
    if (controls.left.isDown)
    {
        this._rush.body.velocity.x -= this._speed;
        //this._rush.animations.play('left');
       // this._rush.scale.setTo(-0.75,0.75);

       // this._rush.scale.setTo(-0.75, 0.75);
    
    }
    if (controls.right.isDown)
    {
    
        this._rush.body.velocity.x += this._speed;
        //this._rush.animations.play('right');
        //this._rush.scale.setTo(0.75, 0.75);
       
    //}else {
     // this._rush.frame = 7;
   
    }
    if(this._rush.body.velocity.x === 0.0 && this._rush.body.velocity.y === 0.0){
     
      this._rush.animations.stop('right');
      //this._rush.animations.play('idle');
    }    
}
};

module.exports = PlayScene;
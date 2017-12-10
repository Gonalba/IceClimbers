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

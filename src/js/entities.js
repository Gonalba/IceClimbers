'use strict';
function Objeto (game, x, y, graphic){
    this._obj = game.add.sprite( x,  y, graphic);
    this._obj.scale.setTo(0.5, 0.5);
};
Objeto.prototype.constructor = Objeto;

function Movable (game, x, y, graphic){
  Objeto.call(this, game, x, y, graphic);}
  /*this._obj.move = function(vel){ 
    this._obj.body.velocity.x = vel; 
  }
return this._obj;
}*/
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;
/*
Movable.prototype.move = function(vel){ 
    this._obj.body.velocity.x = vel; 
  };

*/

function Popo (game, x,y){
  Movable.call(this, game, x, y, 'popo');

  /*this._popo.moveLeft = function(x){
      this.body.velocity.x = x; 
    }
    this._popo.moveRight = function(x){
      this.body.velocity.x = x; 
    }
*/  this._obj.move = function(vel){ 
    this.body.velocity.x = vel; 
  }
    this._obj.jump = function(y){
      if(this.body.onFloor())
         this.body.velocity.y = y;
  }
  return this._obj;
}
Popo.prototype = Object.create(Movable.prototype);
Popo.prototype.constructor = Popo;

module.exports = {
  Objeto: Objeto,
  Movable: Movable,
  Popo: Popo,
};
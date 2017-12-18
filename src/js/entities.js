'use strict';
//OBJETO-----------------------------------------------------
function Objeto (game, x, y, graphic){
    this._obj = game.add.sprite( x,  y, graphic);
    this._obj.scale.setTo(0.5, 0.5);
};
Objeto.prototype.constructor = Objeto;

//MOVIBLE-----------------------------------------
function Movable (game, x, y, graphic){
  Objeto.call(this, game, x, y, graphic);
}
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;

/*
Movable.prototype.move = function (vel) {
  this.body.velocity.x = vel; 
};*/

//POPO-----------------------------------------------------------------
function Popo (game, x,y,graphic){
  Movable.call(this, game, x, y, graphic);


  /*this._popo.moveLeft = function(x){
      this.body.velocity.x = x; 
    }
    this._popo.moveRight = function(x){
      this.body.velocity.x = x; 
    }
*/this._obj.move = function (vel) {
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

//ENEMIGO-------------------------------------------------------------
function Enemy(game, x, y, graphic){
  Movable.call(this, game, x, y, graphic);
}
Enemy.prototype = Object.create(Movable.prototype);
Enemy.prototype.constructor = Enemy;

/*Enemy.prototype.morir = function (){};
Enemy.prototype.atravesarVerticales = function (){};*/

//YETI--------------------------------------------------------------
function Yeti(game, x, y){
  Enemy.call(this, game, x, y, 'yeti');

 /* this._obj.move = function (vel) {
    this.body.velocity.x = vel; 
  }*/
  this._obj.move = function (vel) {
    this.body.velocity.x = vel; 
  }
  return this._obj;
}
Yeti.prototype = Object.create(Enemy.prototype);
Yeti.prototype.constructor = Yeti;

//Yeti.prototype.tapaSuelo = function (){};

//OSO-----------------------------------------------------------------
function Oso(game, x, y){
  Enemy.call(this, game, x, y, 'oso');

  /*this._obj.move = function (vel) {
    this.body.velocity.x = vel; 
  }*/
  this._obj.move = function (vel) {
    this.body.velocity.x = vel; 
  }
  return this._obj;
}
Oso.prototype = Object.create(Enemy.prototype);
Oso.prototype.constructor = Oso;

module.exports = {
  Objeto: Objeto,
  Movable: Movable,
  Popo: Popo,
};
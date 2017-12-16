'use strict';

function Objeto (game, x, y, graphic){
  this._posx = x;
  this._posy = y;
  this._graphic = graphic;
  this._game = game;
  this._obj = game.add.sprite( this._posx,  this._posy, this._graphic);
  this._game.physics.arcade.enable(this._obj);
  this._obj.body.collideWorldBounds = true;
  this._obj.body.bounce.y = 0.2;
  //return this._obj;

}
Objeto.prototype.constructor = Objeto;


function Movable (game, x, y, graphic, velocidad){
  Objeto.call(this, game, x, y, graphic);
}
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;

Movable.prototype.move = function (vel) { this._obj.body.velocity.x = vel; };    //Método para que se mueva para los lados -> para todas las entidades que se mueven
                                                                                // "_obj" lo recibe de "Objeto" que es donde se crea, añade el sprite y se le pone física

function Popo (game, x, y, graphic){
  Movable.call(this, game, x, y, graphic);
  this._vidas = 4;
  this._fuerzaSalto = -500;
}
Popo.prototype = Object.create(Movable.prototype);
Popo.prototype.constructor = Popo;

Popo.prototype.jump = function (vel) {if(this._obj.body.onFloor()){this._obj.body.velocity.y = vel;}}; //Método para saltar -> solo para Popo

/*
function Platform (){}

function Bonus(){}

function Timer(){}



/*function Popo (game, x,y){
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
Popo.prototype.constructor = Popo;*/

module.exports = {
  Objeto: Objeto,
  Movable: Movable,
  Popo: Popo,
};
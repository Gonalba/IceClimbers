'use strict';

function Objeto (posicion, graphic, game){
  this._posicion = posicion;
  this._graphic = graphic;
  this._game = game;
  this._popo = game.add.sprite(posicion.x, posicion.y, _graphic);

}
Objeto.prototype.constructor === Objeto;


function MoveObjects (posicion, velocidad, direccion, graphic, game){
  Objeto.apply(this, [posicion, graphic, game]);
  this._velocidad = velocidad;
  this._direccion = direccion;
}
MoveObjects.prototype = Object.create(Objeto.prototype);
MoveObjects.prototype.constructor === MoveObjects;

function Popo (posicion, velocidad, direccion, graphic, game){
  MoveObjects.apply(this, [posicion, velocidad, direccion, graphic, game]);
  this._vidas = 4;
  this._fuerzaSalto = -500;
}
Popo.prototype = Object.create(MoveObjects.prototype);
Popo.prototype.constructor === Popo;


function Platform (){}

function Bonus(){}

function Timer(){}



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
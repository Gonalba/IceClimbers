'use strict';

//OBJETO-----------------------------------------------------
function Objeto (game,x,y,graphic){
	Phaser.Sprite.call(this, game, x, y, graphic);
};

Objeto.prototype = Object.create(Phaser.Sprite.prototype);
Objeto.prototype.constructor = Objeto;

//MOVIBLE---------------------------------------------------------------
// MOVABLE TIENE VELOCIDAD, DIRECCION Y UN METODO QUE HACE QUE SE MUEVA EL PERSONAJE
function Movable (game, x, y, graphic){
 	this._velocity = 1;
 	this._direction = 1;
 	Objeto.call(this, game, x, y, graphic);
  
};
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;
// METODO QUE HACE QUE SE MUEVA EL OBJETO
Movable.prototype.move = function(){
	//USO this.x EN VEZ DE this.body.velocity.x PORQUE CON EL SEGUNDO SE MUEVE CON ACELERACION
	this.x += this._velocity * this._direction;
};

//POPO-----------------------------------------------------------------------------------
// EN EL MÉTODO UPDATE SE IMPLEMENTA LA LÓGICA DEL MOVIMIENTO
// EN FUNCION DE LAS TECLAS QUE SE PULSEN
function Popo (game, x,y,graphic){
	this._cursors = game.input.keyboard.createCursorKeys();
	this._jumpPower = -300;

 	Movable.call(this, game, x, y, graphic);
};
Popo.prototype = Object.create(Movable.prototype);
Popo.prototype.constructor = Popo;

Popo.prototype.update = function(){
	this.keyboardInput();
	this.move();
};

//EN ESTE METODO SE CAPTURAN LAS TECLAS QUE SE PULSAN Y SE REALIZA LA FUNCION CORRESPONDIENTE
Popo.prototype.keyboardInput = function(){
	this._direction = 0;
	if (this._cursors.left.isDown)
		this._direction = -1;
	else if (this._cursors.right.isDown)
  		this._direction = 1
  	if (this._cursors.up.isDown&&this.body.onFloor())
  		this.jump();
};

//METODO DE SALTO
Popo.prototype.jump = function(){
	this.body.velocity.y = this._jumpPower;
};

module.exports = {
	Popo: Popo
};
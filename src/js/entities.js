'use strict';

//OBJETO-----------------------------------------------------
function Objeto (game,x,y,graphic){
	Phaser.Sprite.call(this, game, x, y, graphic);
	this.MoveLeft = this.animations.add('MoveLeft',[0,1,2,3]);
	this.MoveRight = this.animations.add('MoveRight',[12, 13, 14, 15]);
	this.JumpLeft = this.animations.add('JumpLeft',[6,4,5]);
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
	
	//TOROIDE
	if(this.x > this.game.width - this.width-1)
		this._direction = -1;
	else if(this.x < 1)
		this._direction = 1;
};


//MARTILLO-------------------------------------------------------------------------------
//PREGUNTAR A CARLOS COMO IMPLEMENTAR EL ATAQUE DEL MARTILLO
function Martillo (game, x, y, graphic){
 	Objeto.call(this, game, x, y, graphic);
};
Martillo.prototype = Object.create(Objeto.prototype);
Martillo.prototype.constructor = Martillo;


//POPO-----------------------------------------------------------------------------------
// EN EL MÉTODO UPDATE SE IMPLEMENTA LA LÓGICA DEL MOVIMIENTO
// EN FUNCION DE LAS TECLAS QUE SE PULSEN
function Popo (game, x, y, martillo, graphic){
	this._cursors = game.input.keyboard.createCursorKeys();
	this._jumpPower = -500; 
	this.martillo = martillo;
 	Movable.call(this, game, x, y, graphic);
 	this.atacando = false;
 	this.tiempo;
 	this.vivo = true;
 	this.vidas = 4;
};
Popo.prototype = Object.create(Movable.prototype);
Popo.prototype.constructor = Popo;

Popo.prototype.update = function(){
	if(this.vivo === true){
		this.atacando = false
		this.keyboardInput();
	}
	else{
		if(this.vidas > 0){
			this.resetPopo();
		}
	}
	this.game.debug.text('Vidas: ' + this.vidas, 0, 600);
};

//EN ESTE METODO SE CAPTURAN LAS TECLAS QUE SE PULSAN Y SE REALIZA LA FUNCION CORRESPONDIENTE
Popo.prototype.keyboardInput = function(){
	//ATAQUE-----------------------------------
	//PROBAR ESTE IF 
//	if(this.vivo === true){
		if(this._cursors.down.isDown){
			this.atacando = true;
			this.play('JumpLeft', 10);
			if(this._direction === -1){
				this.martillo.reset(this.x-10, this.y+50);
			}
			else if(this._direction === 1){
				this.martillo.reset(this.x+65, this.y+50);
			}
			this.JumpLeft.onComplete.add(this.killMartillo,this);
		}

	//TECLAS MOVIMIENTO-------------------------
		if (this._cursors.left.isDown){
			if(this.atacando === false){
				this._direction = -1;
				this.move();
				if(this.body.onFloor()){
					this.play('MoveLeft',20);
				}
			}
		}
		else if (this._cursors.right.isDown){
  			if(this.atacando === false){
  				this._direction = 1
	  			this.move();
	  			if(this.body.onFloor()){
					this.play('MoveRight',20);
				}
  			}
		}
	//SALTO-------------------------------------
  		if (this._cursors.up.isDown&&this.body.onFloor()){
  			if(this.atacando === false){
	  			this.jump();
		  		this.play('JumpLeft', 10);
		  		this.martillo.reset(this.x+25, this.y-20);
				//this.JumpLeft.onComplete.add(this.killMartillo,this);
			}
  		}
 	 //}


};
//METODO DE SALTO
	//falta implementar que ataque cuando salte
Popo.prototype.jump = function(){
	this.body.velocity.y = this._jumpPower;
};

Popo.prototype.killMartillo = function(){
	this.martillo.kill();
};
//metodo pierde vida
//metodo morir
Popo.prototype.morir = function (){
	//if (this.atacando === false){
		this.vivo = false;
		this.vidas--;
		this.kill();
		this.tiempo =  this.game.time.totalElapsedSeconds();
	
};
//método para volver a crear a popo
Popo.prototype.resetPopo = function(){
	if(this.vivo === false){
		if( this.game.time.totalElapsedSeconds() >= this.tiempo + 2)
		{
			this.reset(50, 50);
			this.vivo = true;
			this.killMartillo();

		}
	}
};

//metodo atacar



//YETI--------------------------------------------------------------------------------------
function Yeti(game, x, y, graphic){
	Movable.call(this, game, x, y, graphic);
};
Yeti.prototype = Object.create(Movable.prototype);
Yeti.prototype.constructor = Yeti;

Yeti.prototype.update = function(){
	this.move();
};

Yeti.prototype.morir = function (){};


//OSO--------------------------------------------------------------------------------------
function Oso(game, x, y, graphic){
	Movable.call(this, game, x, y, graphic);
};
Oso.prototype = Object.create(Movable.prototype);
Oso.prototype.constructor = Yeti;

Oso.prototype.update = function(){
	this.move();
};

Oso.prototype.morir = function (){};

module.exports = {
	Popo: Popo,
	Yeti: Yeti,
	Oso: Oso,
	Martillo: Martillo
};
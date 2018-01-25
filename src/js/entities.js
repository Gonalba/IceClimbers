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
 	this.paused = false;
 	this.muerto = false;
 	Objeto.call(this, game, x, y, graphic);
  
};
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;
// METODO QUE HACE QUE SE MUEVA EL OBJETO
Movable.prototype.move = function(){
	//USO this.x EN VEZ DE this.body.velocity.x PORQUE CON EL SEGUNDO SE MUEVE CON ACELERACION
	this.x += this._velocity * this._direction;
//Toroide	
	/*if(this.x > this.game.width - this.width-30)
		this.x = 2;
	else if(this.x < 1)
		this.x = this.game.width - this.width-30;
/*lado a lado*/
	if(this.x > this.game.width - this.width -30)
		this._direction = -1;
	else if(this.x < 1)
		this._direction = 1;
};
Movable.prototype.pause = function(){
	if(!this.paused){
		this._velAux = this._velocity;
		this._dirAux = this._direction;
		this._velocity = 0;
		this._direction = 0;
		this.paused = true;
	}
	else{
		this._velocity = this._velAux;
		this._direction = this._dirAux;
		this.paused = false;
	}
};



//MARTILLO-------------------------------------------------------------------------------
//PREGUNTAR A CARLOS COMO IMPLEMENTAR EL ATAQUE DEL MARTILLO
function Martillo (game, x, y, graphic){
 	Objeto.call(this, game, x, y, graphic);
 	this.xInit = x;
 	this.yInit = y;
};
Martillo.prototype = Object.create(Objeto.prototype);
Martillo.prototype.constructor = Martillo;
Martillo.prototype.setPosInit = function(){
	this.x = this.xInit;
	this.y = this.yInit;
};
Martillo.prototype.setPosIzq = function(){
	this.x = -5;
	this.y = 10;
}
Martillo.prototype.setPosDer = function(){
	this.x = 20;
	this.y = 10;
}
Martillo.prototype.setPosJump = function(){
	this.x = 7;
	this.y = -5;
}

//POPO-----------------------------------------------------------------------------------
// EN EL MÉTODO UPDATE SE IMPLEMENTA LA LÓGICA DEL MOVIMIENTO
// EN FUNCION DE LAS TECLAS QUE SE PULSEN
function Popo (game, x, y, martillo, graphic,salto){
	Movable.call(this, game, x, y, graphic);
	this._cursors = game.input.keyboard.createCursorKeys();
	this._jumpPower = -500;
 	this.atacando = false;
 	this.tiempo;
 	this.vivo = true;
 	this.vidas = 4;
 	this._velocity = 3;
 	this.martillo = martillo;
	this.hInit = this.height*3;
	this.wInit = this.width*3;
	this.xInit = x;
 	this.yInit = y;
 	this.muere = true;
	
	this.MoveLeftPopo = this.animations.add('MoveRightPopo',[7,8,9,10]);
	this.MoveRightPopo = this.animations.add('MoveLeftPopo',[6,5,4,3]);

	this.JumpRightPopo = this.animations.add('JumpRightPopo',[11,12]);
	this.JumpLeftPopo = this.animations.add('JumpLeftPopo',[2,1]);

	this.AtaqueRightPopo = this.animations.add('AtaqueRightPopo',[12,13,27]);
	this.AtaqueLeftPopo = this.animations.add('AtaqueLeftPopo',[1,0,14]);

	this.MuertePopo = this.animations.add('MuertePopo',[47,48,49,50]);
};
Popo.prototype = Object.create(Movable.prototype);
Popo.prototype.constructor = Popo;

Popo.prototype.update = function(){
	this.body.setSize(12,22,9,3);
	if(this.vivo){
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
	if(!this.paused){
	

	if(this._cursors.down.isDown&&this.body.onFloor()){
		this.muere = true;
		this.alpha = 1;
		this.atacando = true;
		if(this._direction === -1){
			this.play('AtaqueLeftPopo', 7);	
			this.martillo.setPosIzq();
  			this.AtaqueLeftPopo.onComplete.add(this.martillo.setPosInit,this.martillo);
  			this.AtaqueLeftPopo.onComplete.add(this.atacandoOff,this);
		}
		else if(this._direction === 1){
			this.play('AtaqueRightPopo', 7);
			this.martillo.setPosDer();
  			this.AtaqueRightPopo.onComplete.add(this.martillo.setPosInit,this.martillo);
  			this.AtaqueRightPopo.onComplete.add(this.atacandoOff,this);
		}
	}
	//SALTO-------------------------------------
  	else if (this._cursors.up.isDown&&this.body.onFloor()){
  		this.muere = true;
		this.alpha = 1;
  		if(!this.atacando){
	 		this.jump();
			this.martillo.setPosJump();
			if(this._direction === -1){
				this.play('JumpLeftPopo', 2);
				//this.height *= 1;
				//this.width *= 1;
  				this.JumpLeftPopo.onComplete.add(this.martillo.setPosInit,this.martillo);
			}
			else if(this._direction === 1){
				this.play('JumpRightPopo', 2);
				//this.height *= 1;
				//this.width *= 1;
  				this.JumpRightPopo.onComplete.add(this.martillo.setPosInit,this.martillo);			
			}
		}
  	}
	//TECLAS MOVIMIENTO-------------------------
	else if (this._cursors.left.isDown){
		this.muere = true;
		this.alpha = 1;
		if(!this.atacando){
			//this.martillo.setPosInit();
			this._direction = -1;
			this.move();
			if(this.body.onFloor()){
				this.play('MoveLeftPopo',20);					
			}
		}
	}
	else if (this._cursors.right.isDown){
		this.muere = true;
		this.alpha = 1;
  		if(!this.atacando){
  			this._direction = 1
 			this.move();
 			if(this.body.onFloor()){
				this.play('MoveRightPopo',20);
			}
  		}
	}else{
		if(this._direction === 1&&this.body.onFloor()&&!this.atacando)
			this.frame = 7;
		else if(this._direction === -1&&this.body.onFloor()&&!this.atacando)
			this.frame = 6;	
	}
}
};
//METODO DE SALTO
Popo.prototype.jump = function(){
	this.body.velocity.y = this._jumpPower;
};
//metodo morir
Popo.prototype.morir = function (){
	if (this.vivo){
		this.vivo = false;
		this.vidas--;
		this.kill();
		//this.body.enable = false;
		this.tiempo =  this.game.time.totalElapsedSeconds();
	}
	
};
//método para volver a crear a popo
Popo.prototype.resetPopo = function(){
	if(!this.vivo){
		if(this.game.time.totalElapsedSeconds() >= this.tiempo + 2)
		{
		 	this.muere = false;
		 	this.alpha = 0.3;
			this.reset(this.body.x +50, this.body.y);
			this.vivo = true;

		}
	}
};
Popo.prototype.killMartillo = function(){
	this.martillo.kill();
};
Popo.prototype.atacandoOff = function(){
	this.atacando = false;
};


//YETI--------------------------------------------------------------------------------------
function Yeti(game, x, y,  graphic,muerto){
	Movable.call(this, game, x, y, graphic);
	this.MoveLeftYeti = this.animations.add('MoveRightYeti',[144,145,146]);
	this.MoveRightYeti = this.animations.add('MoveLeftYeti',[143,142,141]);
	this.MuertoYeti = this.animations.add('MuertoYeti',[140,147]);
};
Yeti.prototype = Object.create(Movable.prototype);
Yeti.prototype.constructor = Yeti;

Yeti.prototype.update = function(){
	if(!this.muerto){
		//ajusto el collider a el tamaño del yeti
		this.body.setSize(18,18,5,3);
		if(this._direction == 1)
			this.play('MoveRightYeti',15);
		else if (this._direction == -1)
			this.play('MoveLeftYeti',15);
	}else
		this.play('MuertoYeti',5);

	this.move();
};

Yeti.prototype.morir = function (){
	this.muerto = true;
	this._direction = - this._direction;
	this._velocity = this._velocity + 3;
	this.body.enable = false;
};


//OSO--------------------------------------------------------------------------------------
function Oso(game, x, y, graphic){
	Movable.call(this, game, x, y, graphic);
	this.MoveLeftOso = this.animations.add('MoveRightOso',[0,1,2]);
	this.MoveRightOso = this.animations.add('MoveLeftOso',[3,4,5]);
	this._velocity = 5;
};
Oso.prototype = Object.create(Movable.prototype);
Oso.prototype.constructor = Yeti;

Oso.prototype.update = function(){
	if(!this.muerto){
		this.move();
		if(this._direction == 1)
			this.play('MoveRightOso',10);
		else if (this._direction == -1)
			this.play('MoveLeftOso',10);
	}else if(this.alpha > 0){
		this.alpha -= 0.01;
	}else if (this.alpha <= 0)
		this.destroy();
};

Oso.prototype.morir = function (){
	this.muerto = true;
	this._direction = 0;
	this.body.enable = false;
};

module.exports = {
	Popo: Popo,
	Yeti: Yeti,
	Oso: Oso,
	Martillo: Martillo
};
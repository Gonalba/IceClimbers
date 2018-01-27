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
	this.killEnemySound = game.add.audio('killEnemySound');
	this.killBirdSound = game.add.audio('killBirdSound');  

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
	if(this.x > this.game.width - this.width - 5)
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

//PTERODACTILO-----------------------------------------------------------------------
function Pterodactilo (game,x,y,graphic){
	Movable.call(this, game, x, y, graphic);
	this.MovIzqPt = this.animations.add('MovIzqPt',[80,81,82]);
	this.MovDerPt = this.animations.add('MovDerPt',[83,84,85]);
	this._velocity = 5;
};
Pterodactilo.prototype = Object.create(Movable.prototype);
Pterodactilo.prototype.constructor = Pterodactilo;

Pterodactilo.prototype.update = function(){
	this.body.setSize(35,15,3,5);
	this.move();
	if(this._direction < 0)
		this.play('MovIzqPt',10);
	else if (this._direction > 0)
		this.play('MovDerPt',10);

};
//MARTILLO-------------------------------------------------------------------------------
//PREGUNTAR A CARLOS COMO IMPLEMENTAR EL ATAQUE DEL MARTILLO
function Martillo (game, x, y, graphic){
 	Objeto.call(this, game, x, y, graphic);
 	this.xInit = x;
 	this.yInit = y;
 	this.alpha = 0;
};
Martillo.prototype = Object.create(Objeto.prototype);
Martillo.prototype.constructor = Martillo;
Martillo.prototype.setPosInit = function(){
	this.x = this.xInit;
	this.y = this.yInit;
};
Martillo.prototype.setPosIzq = function(){
	this.x = 0;
	this.y = 10;
}
Martillo.prototype.setPosDer = function(){
	this.x = 20;
	this.y = 10;
}
Martillo.prototype.setPosJump = function(){
	this.x = 10;
	this.y = -5;
};

//POPO-----------------------------------------------------------------------------------
// EN EL MÉTODO UPDATE SE IMPLEMENTA LA LÓGICA DEL MOVIMIENTO
// EN FUNCION DE LAS TECLAS QUE SE PULSEN
function Popo (game, x, y, martillo, graphic,salto){
	Movable.call(this, game, x, y, graphic);
	this._cursors = game.input.keyboard.createCursorKeys();
	this._jumpPower = -550;
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
 	this.posX;
	this.posY;
 	this.suelo;
	
	//ANIMACIONES
	this.MoveLeftPopo = this.animations.add('MoveRightPopo',[7,8,9,10]);
	this.MoveRightPopo = this.animations.add('MoveLeftPopo',[6,5,4,3]);
	this.JumpRightPopo = this.animations.add('JumpRightPopo',[11,12]);
	this.JumpLeftPopo = this.animations.add('JumpLeftPopo',[2,1]);
	this.AtaqueRightPopo = this.animations.add('AtaqueRightPopo',[12,13,27]);
	this.AtaqueLeftPopo = this.animations.add('AtaqueLeftPopo',[1,0,14]);
	this.MuertePopo = this.animations.add('MuertePopo',[33,34,35,36]);
	
	//SONIDOS
	this.jumpSound = game.add.audio('jumpSound');
	this.popoMuerteSound = game.add.audio('popoMuerteSound');
	this.jumpSound = game.add.audio('jumpSound');
	this.jumpSound = game.add.audio('jumpSound');

};
Popo.prototype = Object.create(Movable.prototype);
Popo.prototype.constructor = Popo;

Popo.prototype.update = function(){

	this.body.setSize(12,22,9,3);
	if(this.vivo){
		this.savePosition();
		this.keyboardInput();

	}
	else{
		if(this.vidas > 0){
			this.MuertePopo.onComplete.add(this.resetPopo, this);

		}
		else{
			this.MuertePopo.onComplete.add(this.kill, this);
		}
	}
	this.suelo = this.body.onFloor();
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
  		this.jumpSound.play();
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
	}
	else{
		if(this._direction === 1&&this.body.onFloor()&&!this.atacando)
			this.frame = 7;
		else if(this._direction === -1&&this.body.onFloor()&&!this.atacando)
			this.frame = 6;	
		this.pulsaTecla = false;
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
		this.martillo.setPosInits;
		this.muere = false;
		this.vivo = false;
		this.vidas--;
		this.play('MuertePopo',3);
		this.popoMuerteSound.play();
		this.tiempo = this.game.time.totalElapsedSeconds();
	}
	
};
//método para volver a crear a popo
Popo.prototype.resetPopo = function(){
	if(!this.vivo){
		if(this.game.time.totalElapsedSeconds() >= this.tiempo + 3)
			this.kill();
			this.vivo = true;
		 	this.alpha = 0.3;
			this.reset(this.posX- this._direction*20, this.posY);
			this.game.debug.text('Posición: ' + (this.posX- this._direction*20) + ', ' + this.posY , 0, 500);

			
		
	}
};
Popo.prototype.killMartillo = function(){
	this.martillo.kill();
};
Popo.prototype.atacandoOff = function(){
	this.atacando = false;
};
Popo.prototype.savePosition = function(){
	if(this.body.onFloor()){
		this.posX = this.x;
		this.posY = this.y;
	}
};

//ENEMIGOS---------------------------------------------------------------------------------
function Enemy(game, x, y,  graphic){
	Movable.call(this, game, x, y, graphic);
	this.game.debug.text(this.map, 0, 100);

};
Enemy.prototype = Object.create(Movable.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.goBack = function(){
	this._direction = -this._direction;
};
Enemy.prototype.numeroRandom = function(max, min){
	return (Math.random() * (max - min) + min);
};

//YETI--------------------------------------------------------------------------------------
function Yeti(game, x, y,  graphic){
	Enemy.call(this, game, x, y, graphic);
	this.MoveLeftYeti = this.animations.add('MoveRightYeti',[144,145,146]);
	this.MoveRightYeti = this.animations.add('MoveLeftYeti',[143,142,141]);
	this.MuertoYeti = this.animations.add('MuertoYeti',[140,147]);
};
Yeti.prototype = Object.create(Enemy.prototype);
Yeti.prototype.constructor = Yeti;

Yeti.prototype.update = function(){
	this.suelo = this.body.onFloor();
	if(!this.muerto){
		this.move();
		//ajusto el collider a el tamaño del yeti
		this.body.setSize(18,18,5,3);
		if(this._direction == 1)
			this.play('MoveRightYeti',15);
		else if (this._direction == -1)
			this.play('MoveLeftYeti',15);
	}else{
		this.move();
		this.alpha -= 0.01;
		this.play('MuertoYeti',5);
		if(this.alpha <=0)
			this.destroy();
	}


};

Yeti.prototype.morir = function (){
	this.killEnemySound.play();
	this.muerto = true;
	this._direction = - this._direction;
	this._velocity = this._velocity + 3;
	this.body.enable = false;
};



//OSO--------------------------------------------------------------------------------------
function Oso(game, x, y, graphic, camera){
	Enemy.call(this, game, x, y, graphic);
	this.MoveLeftOso = this.animations.add('MoveRightOso',[0,1,2]);
	this.MoveRightOso = this.animations.add('MoveLeftOso',[3,4,5]);
	this._velocity = 5;

	this.timeReset = true;
	this.tiempoSalto = 5;
	this.jumpPower = -400;
	this.camara = camera;

	/*
	this.velAux = this._velocity;
	this.dirAux = this._direction;
	this.tiempoIni = 0;
	this.tiempo = 0;
	this.saltando = false;
	this.map = mapa;
	this.tiempoSalto = this.numeroRandom(3, 1.500);*/
};
Oso.prototype = Object.create(Enemy.prototype);
Oso.prototype.constructor = Oso;

Oso.prototype.update = function(){
	

	if(this.timeReset){
		this.timeReset = false;
		this.tiempo = this.game.time.totalElapsedSeconds();
	}

	if(this.game.time.totalElapsedSeconds() > this.tiempo + this.tiempoSalto){
		this.timeReset = true;
		this.jump();
		this.camara.y -= 50;
	}


	if(!this.muerto){
		this.move();
		if(this._direction == 1)
			this.play('MoveRightOso', 10);
		else if (this._direction == -1)
			this.play('MoveLeftOso', 10);
	}
	else if(this.alpha > 0){
		this.alpha -= 0.01;
	}
	else if (this.alpha <= 0)
		this.destroy();

	

	/*if(this.saltando){
		this._velocity = 0;
		this._direction = 0;
		this.jump();
//		this.body.velocity.y = 0;

		if(this.body.onFloor()){
			this.saltando = false;
			this._velocity = this.velAux;
			this._direction = this.dirAux;
		}
	}
	else{
		this.movement();
	}
*/
};
Oso.prototype.jump = function(){
	this.body.velocity.y = this.jumpPower;
}
/*
Oso.prototype.movement = function(){
	if(this.tiempo > this.tiempoIni + this.tiempoSalto && !this.saltado)
		this.saltando = true;
}
Oso.prototype.saltar = function(){

	if(this.tiempo > this.tiempoIni + this.tiempoSalto && !this.saltado){
		this._velocity = 0;
		this._direction = 0;
		if(this.tiempo > this.tiempoIni + this.tiempoSalto + 0.5){
			this.jump();
			this.saltado = true;

		}
	}
	else if(this.tiempo > this.tiempoIni + this.tiempoSalto + 0.5 && this.saltado){
		this.body.velocity.y = 0;
		this._velocity = this.velAux;
		this._direction = this.dirAux;
	}
},
Oso.prototype.jump = function(){
	this.body.velocity.y = -200;
};
*/
Oso.prototype.morir = function (){
	this.killEnemySound.play();
	this.muerto = true;
	this._direction = 0;
	this.body.enable = false;
};


function Pajaro(game, x, y, graphic, camara){
	this.camara = camara;
	this.tiempoIni = 0;
	this.tiempo = 0;
	this.sumTiempo = this.numeroRandom(46, 15); //Tiempo que va a estar en pantalla
	this.changeMove();	
	Enemy.call(this, game, x, y, graphic);
	this.timeToCambio = 0;
	this.MovIzqBird = this.animations.add('MovIzqBird',[99,100]);
	this.MovDerBird = this.animations.add('MovDerBird',[101,102]);
	this.MuerteBird = this.animations.add('MuerteBird',[98,103]);
};

Pajaro.prototype = Object.create(Enemy.prototype);
Pajaro.prototype.constructor = Pajaro;

Pajaro.prototype.move = function(){
	this.x += this.velX * this.dirX;
	this.y += this.velY * this.dirY;
	if(this.dirX > 0)
		this.play('MovDerBird',10);
	else if(this.dirX < 0)
		this.play('MovIzqBird',10);
};

Pajaro.prototype.changeMove = function(){
	this.velX = Math.trunc(this.numeroRandom(3, 1));
	this.velY = Math.trunc(this.numeroRandom(3, 1));
	this.dirX = this.numeroRandom(2, 0);
	this.dirY = this.numeroRandom(2, 0);
	if(this.dirX < 1){
		this.dirX -= 1;
	}
	if(this.dirY < 1){
		this.dirY -= 1;
	}
};

Pajaro.prototype.update = function(){
	this.body.setSize(16,16,7,5);
	this.tiempo = this.game.time.totalElapsedSeconds();
	if(!this.muerto ){
		this.move();
		if (this.tiempo < this.tiempoIni + this.sumTiempo){ //Si aún está en el tiempo que va a estar en pantalla
			if(this.tiempo > this.timeToCambio){
				this.timeToCambio = this.tiempo + this.numeroRandom(1.5, 0);
				this.changeMove();
			}
			if(this.y < this.camara.y){ 
				this.dirY = 1;
			}
			if(this.y > this.camara.y + this.camara.height){
				this.dirY = -1;
			}
			if(this.x < this.camara.x || this.x > this.camara.x + this.camara.width-30){
				this.dirX = -this.dirX;
			}
		}
		else{ //Si se acaba el tiempo sigue en la dirección que tiene hasta que desaparece de la pantalla
			if(this.y < this.camara.y || this.y > this.camara.y + this.camara.height ||this.x < this.camara.x || this.x > this.camara.x + this.camara.width){
				this.destroy();			
			}	
		}

	}else{
		this.alpha -= 0.01;
		this.play('MuerteBird',10);
		if(this.alpha <= 0)
			this.destroy();
	}
};

Pajaro.prototype.morir = function (){
	this.killBirdSound.play();
	this.muerto = true;
	this._direction = 0;
	this.body.enable = false;
};

module.exports = {
	Objeto: Objeto,
	Popo: Popo,
	Yeti: Yeti,
	Oso: Oso,
	Martillo: Martillo,
	Pajaro: Pajaro,
	Pterodactilo: Pterodactilo,
};
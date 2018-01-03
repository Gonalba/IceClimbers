'use strict';

//OBJETO-----------------------------------------------------
function Objeto (game, x, y, graphic){
    Phaser.Sprite.call(this, game, x, y, graphic);
};
Objeto.prototype = Object.create(Phaser.Sprite.prototype)
Objeto.prototype.constructor = Objeto;

//MOVIBLE-----------------------------------------
function Movable (game, x, y, graphic){
  Objeto.call(this, game, x, y, graphic);
  
}
Movable.prototype = Object.create(Objeto.prototype);
Movable.prototype.constructor = Movable;

//POPO-----------------------------------------------------------------
function Popo (game, x,y,graphic){
  Movable.call(this, game, x, y, graphic);
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
}
Yeti.prototype = Object.create(Enemy.prototype);
Yeti.prototype.constructor = Yeti;

//Yeti.prototype.tapaSuelo = function (){};

//OSO-----------------------------------------------------------------
function Oso(game, x, y){
  Enemy.call(this, game, x, y, 'oso');
  
}
Oso.prototype = Object.create(Enemy.prototype);
Oso.prototype.constructor = Oso;

module.exports = {
  Objeto: Objeto,
  Movable: Movable,
  Enemy: Enemy,
  Popo: Popo,
  Yeti: Yeti,
  Oso: Oso,
};
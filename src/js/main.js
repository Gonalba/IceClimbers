'use strict';

var PlayScene = require('./play_scene.js');
var MenuPrincipal = require('./menu_principal.js');
var Creditos = require('./creditos.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('popo', 'images/popo.PNG');
    this.game.load.image('oso', 'images/oso.png');
    this.game.load.image('yeti', 'images/yeti.png');
    this.game.load.image('m', 'images/martillo.png');
    this.game.load.image('button', 'images/start.png');
    
    this.game.load.spritesheet('spritesGame', 'images/Sprites.png', 27, 35, 128);

//SI CAMBIAS DE MAPA 
    this.game.load.tilemap('mapa', 'images/Mapa1.json', null, Phaser.Tilemap.TILED_JSON);

/*Para que sólo aparezcan los hielitos
    this.game.load.tilemap('mapa', 'images/Mapa1_SBN.json', null, Phaser.Tilemap.TILED_JSON);*/

/*Para que aparezcan hielitos y bonus
    this.game.load.tilemap('mapa', 'images/Mapa1_SN.json', null, Phaser.Tilemap.TILED_JSON);*/
    
//Y YA

    this.game.load.image('tiles', 'images/TileSet.png');

  },

  create: function () {
    this.game.state.start('menu_principal');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('menu_principal', MenuPrincipal);
  game.state.add('creditos', Creditos);


  game.state.start('boot');
};

'use strict';

var PlayScene = {
  create: function () {
   /*var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);*/
    var oso = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'oso');
    oso.anchor.setTo(0.5, 0.5);
    oso.x += 200;
    
  }    
};

module.exports = PlayScene;
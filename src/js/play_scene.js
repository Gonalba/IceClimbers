'use strict';

var PlayScene = {
  	create: function () {
   		var oso = this.game.add.sprite(
      	this.game.world.centerX, this.game.world.centerY, 'oso');
    	//oso.anchor.setTo(0.5, 0.5);
    	oso.scale.setTo(0.75, 0.75);
    	
    }    
};

module.exports = PlayScene;
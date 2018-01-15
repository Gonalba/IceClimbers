'use strict';
var scene;
var Creditos = {
	create: function () {
		
		var buttonMenu = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY - 100, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        buttonMenu.anchor.set(0.5);
        var textMenu = this.game.add.text(0, 0, "Menu Principal");
        textMenu.font = 'Sniglet';
        textMenu.anchor.set(0.5);
        buttonMenu.addChild(textMenu);
	},

	actionOnClick: function(){
		scene = 'menu_principal';
        this.initState();
    },

	initState: function(){
		this.game.state.start(scene);
	}
}

module.exports = Creditos;
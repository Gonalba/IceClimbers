'use strict';
var scene;
var MenuLevel = {
	create: function () {
		var buttonPlay = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY - 100, 
                                               'button', 
                                               this.actionOnClickPlay, 
                                               this, 2, 1, 0);
        buttonPlay.anchor.set(0.5);
        var textPlay = this.game.add.text(0, 0, "Play");
        textPlay.font = 'Sniglet';
        textPlay.anchor.set(0.5);
        buttonPlay.addChild(textPlay);

        var buttonCreditos = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY + 100, 
                                               'button', 
                                               this.actionOnClickCreditos, 
                                               this, 2, 1, 0);
        buttonCreditos.anchor.set(0.5);
        var textCreditos = this.game.add.text(0, 0, "Creditos");
        textCreditos.font = 'Sniglet';
        textCreditos.anchor.set(0.5);
        buttonCreditos.addChild(textCreditos);

	},
	
	actionOnClickPlay: function(){
		scene = 'play';
        this.initState();
    },

    actionOnClickCreditos: function(){
		scene = 'creditos';
        this.initState();
    },

	initState: function(){
		this.game.state.start(scene);
	}
}

module.exports = MenuLevel;
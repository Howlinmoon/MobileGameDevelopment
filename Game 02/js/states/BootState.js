var BootState = {
     //initiate some game-level settings
  init: function() {
  	//scaling options
  	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  	this.scale.pageAlignHorizontally = true;
  	this.scale.pageAlignVertically = true;
  },

    // loading screen
    preload: function() {
        this.load.image('preloadBar', 'assets/images/bar.png');
        this.load.image('logo'      , 'assets/images/logo.png');
        
    },
    
    // switch the screen color to white
    create: function() {
        this.game.stage.backgroundColor = '#fff';
        // now switch to the next game state
        this.game.state.start('PreloadState');
    }
    
};
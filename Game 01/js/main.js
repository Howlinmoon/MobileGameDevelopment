//this game will have only 1 state
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('chicken',    'assets/images/chicken.png');
    this.load.image('horse',      'assets/images/horse.png');
    this.load.image('pig',        'assets/images/pig.png');
    this.load.image('sheep',      'assets/images/sheep3.png');
    this.load.image('arrow',      'assets/images/arrow.png');
    
  },
  //executed after everything is loaded
  create: function() {
      
      // adjusting the screen scaling mode
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      // center the canvas
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
      
      this.background = this.game.add.sprite(0, 0, 'background');
      
      // We start by showing just the pig
      this.pig = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pig');
      // adjust the anchor point to the middle of the image
      this.pig.anchor.setTo(0.5, 0.5);

      // left arrow
      this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
      // adjust the anchor point
      this.leftArrow.anchor.setTo(0.5, 0.5);
      this.leftArrow.scale.x = -1;
      this.leftArrow.customParams = {direction: -1};
      
      // allow user input via the left arrow
      this.leftArrow.inputEnabled = true;
      // make sure ONLY the arrow graphic is clicked on
      this.leftArrow.input.pixelPerfectClick = true;
      // add the event when the arrow is clicked
      // we call the function 'switchAnimal' with our current object
      this.leftArrow.events.onInputDown.add(this.switchAnimal, this);
      
      // right arrow
      this.rightArrow = this.game.add.sprite(570, this.game.world.centerY, 'arrow');
      // adjust the anchor point
      this.rightArrow.anchor.setTo(0.5, 0.5);
      this.rightArrow.customParams = {direction: 1};

  
  },

    //this is executed multiple times per second
  update: function() {

  },
  

    // the animal switch function
    switchAnimal: function(sprite, event) {
        console.log('the left arrow was clicked');
        
    }
    
};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
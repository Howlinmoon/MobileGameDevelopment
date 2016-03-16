//this game will have only 1 state
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('chicken',    'assets/images/chicken.png');
    this.load.image('horse',      'assets/images/horse.png');
    this.load.image('pig',        'assets/images/pig.png');
    this.load.image('sheep',      'assets/images/sheep.png');
    
  },
  //executed after everything is loaded
  create: function() {
      this.background = this.game.add.sprite(0, 0, 'background');
      this.chicken = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'chicken');
      // adjust the anchor point of the chicken to the center of the image
      // (X) 0 is far left, 1 is far right, (Y) 0 is the bottom, and 1 is the top
      this.chicken.anchor.setTo(0.5, 0.5);

  
    // adjusting the scale of the image
      // 1,1 means scale 1x - or no change
      // 2,2 means scale 2x
      // 0.5, 0.5 is scale .5 or 1/2x
      this.chicken.scale.setTo(2, 1);
      
      this.horse = this.game.add.sprite(120, 10, 'horse');
      this.horse.scale.setTo(0.5, 0.5);
  },
  //this is executed multiple times per second
  update: function() {
  },
  

};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
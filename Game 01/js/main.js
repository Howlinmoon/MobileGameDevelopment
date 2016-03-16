//this game will have only 1 state
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('chicken',    'assets/images/chicken.png');
    this.load.image('horse',      'assets/images/horse.png');
    this.load.image('pig',        'assets/images/pig.png');
    this.load.image('sheep',      'assets/images/sheep3.png');
    
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
      
      // Experimenting with flipping sprites
      this.pig = this.game.add.sprite(500, 300, 'pig');
      // adjust the anchor point to the middle of the image
      this.pig.anchor.setTo(0.5, 0.5);
      // flip the pig on the X axis by using negative scaling
      this.pig.scale.setTo(-1, 1);
      
      // experimenting with rotating a sprite
      this.sheep = this.game.add.sprite(100, 250, 'sheep');
      // shrink it to 50%
      this.sheep.scale.setTo(0.5, 0.5);
      // rotate it around the default anchor point
      // negative numbers rotate the sprite counter-clockwise
      this.sheep.angle = -45;
      // adjust the anchor point to the center
      this.sheep.anchor.setTo(0.5);
      this.sheep.angle = 90;
  },
  //this is executed multiple times per second
  update: function() {
      // modify the rotation of a sprite every time this is called
      
      this.sheep.angle += 0.5
      if (this.sheep.angle > 360) {
          this.sheep.angle = 0;
      }
  },
  

};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
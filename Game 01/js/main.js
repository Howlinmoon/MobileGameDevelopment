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
      
      // Create a background image sprite
      this.background = this.game.add.sprite(0, 0, 'background');
            
      // A Group for the animals
      var animalData = [
          {key: 'chicken', text: 'CHICKEN'},
          {key: 'horse',   text: 'HORSE'},
          {key: 'pig',     text: 'PIG'},
          {key: 'sheep',   text: 'SHEEP'}
      ];
      
      // create the formal Phaser group
      this.animals = this.game.add.group();
      
      // need to proxy the 'self' for use inside of the anonymous function
      
      var self = this;
      
      animalData.forEach(function(element) {
          // default the animals to be offscreen by setting their X co-ord to -1000
        animal = self.animals.create(-1000, self.game.world.centerY, element.key);
        animal.customParams = {text: element.text};
          // center the sprite anchor
          animal.anchor.setTo(0.5, 0.5);
          
          // allow the current animal to be used for input
          animal.inputEnabled = true;
          // only allow clicks within the graphic
          animal.input.pixelPerfectClick = true;
          animal.events.onInputDown.add(self.animateAnimal, self);
          
          // select animals individually
          this.currentAnimal = self.animals.next();
          // place the current animal in the middle of the screen
          this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);
          
      });

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
      // allow user input on the right arrow
      this.rightArrow.inputEnabled = true;
      this.rightArrow.input.pixelPerfectClick = true;
      this.rightArrow.events.onInputDown.add(this.switchAnimal, this);
      this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

  
  },

    //this is executed multiple times per second
  update: function() {

  },
  

    // the animal switch function
    switchAnimal: function(sprite, event) {
        console.log('An arrow was clicked');
        
    },
    
    // the animate animal function
    animateAnimal: function(sprite, event) {
        console.log('The animal itself was clicked');
        
    }

    
};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
//this game will have only 1 state
var GameState = {

  //initiate some game-level settings
  init: function() {
  	//scaling options
  	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  	this.scale.pageAlignHorizontally = true;
  	this.scale.pageAlignVertically = true;
  },
  //load the game assets before the game starts
  preload: function() {
    this.load.image('backyard', 'assets/images/backyard.png');    
    this.load.image('apple', 'assets/images/apple.png');    
    this.load.image('candy', 'assets/images/candy.png');    
    this.load.image('rotate', 'assets/images/rotate.png');    
    this.load.image('toy', 'assets/images/rubber_duck.png');    
    this.load.image('arrow', 'assets/images/arrow.png');   
    this.load.spritesheet('pet', 'assets/images/pet.png', 97, 83, 5, 1, 1); 
  },
  //executed after everything is loaded
  create: function() {      
  	this.background = this.game.add.sprite(0, 0, 'backyard');

  	this.pet = this.game.add.sprite(100, 400, 'pet');
  	this.pet.anchor.setTo(0.5);

  	//custom properties (Keep track of it's fun and health levels)
  	this.pet.customParams = {health: 100, fun: 100};
      
    // Make the pet draggable
    this.pet.inputEnabled = true;
    this.pet.input.enableDrag();
      
  	this.apple = this.game.add.sprite(72, 570, 'apple');
      this.apple.anchor.setTo(0.5, 0.5);
      this.apple.inputEnabled = true;
      this.apple.events.onInputDown.add(this.pickItem, this);
      // some custom params to dictate what this item does for fun/health
      this.apple.customParams = {health: 20, fun: 0};
      
  	this.candy = this.game.add.sprite(144, 570, 'candy');
      this.candy.anchor.setTo(0.5, 0.5);
      this.candy.inputEnabled = true;
      this.candy.events.onInputDown.add(this.pickItem, this);
      // some custom params to dictate what this item does for fun/health
      this.candy.customParams = {health: -10, fun: 10};
      
  	this.toy = this.game.add.sprite(216, 570, 'toy');
      this.toy.anchor.setTo(0.5, 0.5);
      this.toy.inputEnabled = true;
      this.toy.events.onInputDown.add(this.pickItem, this);
      // some custom params to dictate what this item does for fun/health
      this.toy.customParams = {health: 0, fun: 10};
      
  	this.rotate = this.game.add.sprite(288, 570, 'rotate');
      this.rotate.anchor.setTo(0.5, 0.5);
      this.rotate.inputEnabled = true;
      this.rotate.events.onInputDown.add(this.rotatePet, this);
      
      // some house keeping
      this.buttons = [this.apple, this.candy, this.toy, this.rotate];
      // keep track of what is currently selected
      this.selectedItem = null;

  },
    
    // our pick item routine
    pickItem: function(sprite, event) {
        console.log('pick item was called');
    },
    
    // our rotate pet routine
    rotatePet: function(sprite, event) {
        console.log('rotatePet was called');
    }

  
};

//initiate the Phaser framework
var game = new Phaser.Game(360, 640, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
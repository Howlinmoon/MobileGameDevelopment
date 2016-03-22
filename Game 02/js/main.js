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
      // flesh out the background sprite
      this.background.inputEnabled = true;
      this.background.events.onInputDown.add(this.placeItem, this);

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
      
      // flag to check and see if the UI is blocked or not
      this.uiBlocked = false;

  },
    
    // our pick item routine
    pickItem: function(sprite, event) {
        if (! this.uiBlocked) {
            console.log('pick item was called');
            // clear the previous selected item
            this.clearSelection();
            
            // make the sprite semi-transparent
            sprite.alpha = 0.4;
            
            // assign the item that was passed to us
            this.selectedItem = sprite;
            
        }
    },
    
    // our rotate pet routine
    rotatePet: function(sprite, event) {
        if (! this.uiBlocked) {
            console.log('rotatePet was called');
            
            // block the UI while the rotation is running
            this.uiBlocked = true;
            
            // ensure nothing is selected
            this.clearSelection();
            
            // indicate the button is in use
            sprite.alpha = 0.4;
            
            // rotate the pet
            var petRotation = this.game.add.tween(this.pet);
            petRotation.to({angle: '-720'}, 1000);
            // add an on complete listener
            petRotation.onComplete.add(function() {
                // unblock the UI
               this.uiBlocked = false;
                // restore the button alpha
                sprite.alpha = 1;
                // the pet enjoys this - so increase the fun value by 10
                this.pet.customParams.fun += 10;
                console.log("the current fun value for the pet: " + this.pet.customParams.fun);
                
                // note we are passing the external 'this' context in the following line so we can refer to
                // it from within here 
            }, this);

            
            // try it out
            petRotation.start();
            
            
            
        }
    },
    
    // clear the previous selection
    clearSelection: function() {
        console.log('clearSelection was called');
        // use the shotgun approach to clear the previous selection
        this.buttons.forEach(function(element, index) {
           // set the element's alpha back to normal
            element.alpha = 1;
        });
        
        // ensure nothing is selected
        this.selectedItem = null;

    },
    // placing an item
    placeItem: function(sprite, event) {
        // probably overkill, but this check doesn't hurt
        if (this.selectedItem && !this.uiBlocked) {
            // determine where the background was touched
            var x = event.position.x;
            var y = event.position.y;
            var newItem = this.game.add.sprite(x, y, this.selectedItem.key);
            // ensure the item is centered in the spot we click
            newItem.anchor.setTo(0.5);
            // assign custom parameters
            newItem.customParams = this.selectedItem.customParams;

            console.log('placeItem was called X: ' + x + ' Y: ' + y);
            
            // Move the pet to the item using another tween
            // do not allow another selection until the first one is consumed
            this.uiBlocked = true;
            var petMovement = this.game.add.tween(this.pet);
            petMovement.to({x: x, y: y}, 700);
            petMovement.onComplete.add(function(){
                // unblock the UI on completion of the movement
                this.uiBlocked = false;
                
                // remove the targeted item
                newItem.destroy();
                
                // update the pets health and fun
                var stat;
                for (stat in newItem.customParams) {
                    if (newItem.customParams.hasOwnProperty(stat)) {
                        console.log('stat is '+stat);
                        this.pet.customParams[stat] += newItem.customParams[stat];
                    }
                }
                
            }, this);
            
            petMovement.start();
            
        }
    }

  
};

//initiate the Phaser framework
var game = new Phaser.Game(360, 640, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
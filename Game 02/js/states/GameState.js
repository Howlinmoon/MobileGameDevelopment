//this game will have only 1 state
var GameState = {

  //executed after everything is loaded
  create: function() {      
  	this.background = this.game.add.sprite(0, 0, 'backyard');
      // flesh out the background sprite
      this.background.inputEnabled = true;
      this.background.events.onInputDown.add(this.placeItem, this);

      // defaults to the first sprite in the sheet
  	this.pet = this.game.add.sprite(100, 400, 'pet');
  	this.pet.anchor.setTo(0.5);
      
      // create an animation for the pet when it is eating
      // which frames, how many fps and loop
      this.pet.animations.add('funnyfaces', [1, 2, 3, 2, 1], 7, false);

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
      
      // create our labels
      var style = { font: '20px Arial', fill: '#fff'};
      this.game.add.text(10, 20, 'Health', style);
      this.game.add.text(140, 20, 'Fun', style);
      
      // place holders for the stats
      this.healthText = this.game.add.text(80, 20, '', style);
      this.funText = this.game.add.text(185, 20, '', style);
      
      // update the stats
      this.refreshStats();
      
      // decreaese the health stats every 5 seconds
      this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.reduceProperties, this);
      

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
                // update the stats
                this.refreshStats();
                
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
                
                // play the happy pet animation
                this.pet.animations.play('funnyfaces');
                
                
                // update the pets health and fun
                var stat;
                for (stat in newItem.customParams) {
                    if (newItem.customParams.hasOwnProperty(stat)) {
                        console.log('stat is '+stat);
                        this.pet.customParams[stat] += newItem.customParams[stat];
                    }
                }
                
                this.refreshStats();
                
            }, this);
            
            // move the pet
            petMovement.start();
            
        }
    },
    
    // update the stat labels
    refreshStats: function() {
        this.healthText.text = this.pet.customParams.health;
        this.funText.text = this.pet.customParams.fun;
    },
    
    // the periodic erosion of stats
    reduceProperties: function() {
        this.pet.customParams.health -= 10;
        this.pet.customParams.fun -= 15;
        this.refreshStats();
    },
    
    // adding another built in Phaser Function
    // automatically called multiple times per second
    update: function() {
        // check for death of the pet
        if (this.pet.customParams.health <= 0 || this.pet.customParams.fun <= 0) {
            this.pet.frame = 4;
            // block the UI
            this.uiBlocked = true;
            // wait a few seconds so the player cans see what happened
            this.game.time.events.add(3000, this.gameOver, this);
        }
    },
    
    gameOver: function() {
        console.log("Game Was Over, Restarting");
        this.game.state.restart();
    }

  
};

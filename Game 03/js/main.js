//this game will have only 1 state
var GameState = {

  //initiate game settings
  init: function() {
    //adapt to screen size, fit all the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
      
      // Start up the physics engine - arcade version
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      // set gravity for all elements
      this.game.physics.arcade.gravity.y = 1000;
      
      // enable the cursor keys for usage during the game
      this.cursors = this.game.input.keyboard.createCursorKeys();
      
      // set some speed defaults
      this.RUNNING_SPEED = 180;
      this.JUMPING_SPEED = 550;
  },

  //load the game assets before the game starts
  preload: function() {
    this.load.image('ground', 'assets/images/ground.png');    
    this.load.image('platform', 'assets/images/platform.png');    
    this.load.image('goal', 'assets/images/gorilla3.png');    
    this.load.image('arrowButton', 'assets/images/arrowButton.png');    
    this.load.image('actionButton', 'assets/images/actionButton.png');    
    this.load.image('barrel', 'assets/images/barrel.png');    

    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);    
    this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', 20, 21, 2, 1, 1);      
  },
  //executed after everything is loaded
  create: function() {    

    this.ground = this.add.sprite(0, 500, 'ground');
      // make the sprite aware of the physics engine
      this.game.physics.arcade.enable(this.ground);
      // don't make it react to gravity
      this.ground.body.allowGravity = false;
      // don't make it respond to an object hitting it
      this.ground.body.immovable = true;
      

      
    // creating a platform group
    var platformData = [
        {"x": 0,  "y": 430},
        {"x": 45, "y": 560},
        {"x": 90, "y": 290},
        {"x": 0,  "y": 140}
    ];
      
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    platformData.forEach(function(element){
        this.platforms.create(element.x, element.y, 'platform');
    }, this);
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);

    //create player
    this.player = this.add.sprite(100, 200, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    this.player.play('walking');
    this.game.physics.arcade.enable(this.player);
    // add some custom parameters
    this.player.customParams = {};
    this.player.customParams.mustJump = false;
    this.player.customParams.isMovingLeft = false;
    this.player.customParams.isMovingRight = false;
      
    // start to create the onscreen controls
    this.createOnscreenControls();

  },
  update: function() {
    // check for collisions here
    // collisions result in the objects stopping - if the collided (target) is immovable
    this.game.physics.arcade.collide(this.player, this.ground,   this.landed);
    this.game.physics.arcade.collide(this.player, this.platforms, this.landed);
    // note, 'overlap' is similar - the function is called while they are overlapping, BUT
    // the objects are not stopped.
      
    // set the speed of the player to zero by default
    this.player.body.velocity.x = 0;
      
    // check for key presses
    if (this.cursors.left.isDown || this.player.customParams.isMovingLeft == true) {
        // adjust the player velocity by the constant
        this.player.body.velocity.x = -this.RUNNING_SPEED;
    } else if (this.cursors.right.isDown || this.player.customParams.isMovingRight == true) {
        this.player.body.velocity.x = this.RUNNING_SPEED;
    }
      
    // check for jumping (up) - but ONLY if the player is DOWN touching something (floor/platform)
    if ( (this.cursors.up.isDown || this.player.customParams.mustJump == true) && this.player.body.touching.down) {
        this.player.body.velocity.y = -this.JUMPING_SPEED;
        // reset our jump flag
        this.player.customParams.mustJump = false;
    }
      
  },
    
    landed: function(player, ground) {
        //console.log("player has hit the ground");
    },
    
    createOnscreenControls: function () {
        // creating buttons instead of sprites
        this.leftArrow = this.add.button(20    , 535, 'arrowButton');
        this.leftArrow.alpha = 0.5;
        this.rightArrow = this.add.button(110  , 535, 'arrowButton');
        this.rightArrow.alpha = 0.5;
        this.actionButton = this.add.button(280, 535, 'actionButton');
        this.actionButton.alpha = 0.5;
        
        // give the buttons some listeners
        // action button
        this.actionButton.events.onInputDown.add(function() {
            this.player.customParams.mustJump = true;
        }, this);

        this.actionButton.events.onInputUp.add(function() {
            this.player.customParams.mustJump = false;
        }, this);

        // left arrow button
        this.leftArrow.events.onInputDown.add(function() {
            this.player.customParams.isMovingLeft = true;
        }, this);

        this.leftArrow.events.onInputUp.add(function() {
            this.player.customParams.isMovingLeft = false;
        }, this);

        // hover crutch
        this.leftArrow.events.onInputOver.add(function() {
            this.player.customParams.isMovingLeft = true;
        }, this);

        this.leftArrow.events.onInputOut.add(function() {
            this.player.customParams.isMovingLeft = false;
        }, this);

        // right arrow button
        this.rightArrow.events.onInputDown.add(function() {
            this.player.customParams.isMovingRight = true;
        }, this);

        this.rightArrow.events.onInputUp.add(function() {
            this.player.customParams.isMovingRight = false;
        }, this);

        // hover crutch
        this.rightArrow.events.onInputOver.add(function() {
            this.player.customParams.isMovingRight = true;
        }, this);

        this.rightArrow.events.onInputOut.add(function() {
            this.player.customParams.isMovingRight = false;
        }, this);

    }
  
};

//initiate the Phaser framework
var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');


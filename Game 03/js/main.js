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
      
      // define the size of the world
      this.game.world.setBounds(0, 0, 360, 700);
      
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
      
    // load the json data file
    this.load.text('level', 'assets/data/level.json');
  },
  //executed after everything is loaded
  create: function() {    

    this.ground = this.add.sprite(0, 638, 'ground');
      // make the sprite aware of the physics engine
      this.game.physics.arcade.enable(this.ground);
      // don't make it react to gravity
      this.ground.body.allowGravity = false;
      // don't make it respond to an object hitting it
      this.ground.body.immovable = true;
      

      
    // creating a platform group, loading from external data
    this.levelData = JSON.parse(this.game.cache.getText('level'));
      
      
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.levelData.platformData.forEach(function(element){
        this.platforms.create(element.x, element.y, 'platform');
    }, this);
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);

    //create player - starting player position is loaded from the current level data
    this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    //this.player.play('walking');
    this.game.physics.arcade.enable(this.player);
    // add some custom parameters
    this.player.customParams = {};
    // initialize these params
    this.player.customParams.mustJump = false;
    this.player.customParams.isMovingLeft = false;
    this.player.customParams.isMovingRight = false;
    // have the camera follow the player avatar
    this.game.camera.follow(this.player);
      
    // keep the player on the screen - no running away and hiding!
    this.player.body.collideWorldBounds = true;
      
      
    // start to create the onscreen controls
    this.createOnscreenControls();
      
    // create the fire obstacles
    this.fires = this.add.group();
    this.fires.enableBody = true;
    var fire;
    this.levelData.fireData.forEach(function(element) {
        fire = this.fires.create(element.x, element.y, 'fire');
        fire.animations.add('fire', [0,1], 4, true);
        fire.play('fire');
    }, this);
    // disable gravity
    this.fires.setAll('body.allowGravity', false);
      
    // Add the end game goal
    this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
    this.game.physics.arcade.enable(this.goal);
    this.goal.body.allowGravity = false;
      
    // Create the barrels group
    this.barrels = this.add.group();
    this.barrels.enableBody = true;
    
    // the periodic barrel spawner
    this.barrelCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.barrelFrequency, this.createBarrel, this);
      
    // spawn the initial barrel immediately
    this.createBarrel();
    

  },
  update: function() {
    // check for collisions here

    // collisions result in the objects stopping - if the collided (target) is immovable
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.platforms);
      
    // barrel collisions
    this.game.physics.arcade.collide(this.barrels, this.ground);
    this.game.physics.arcade.collide(this.barrels, this.platforms);

      
    // note, 'overlap' is similar - the function is called while they are overlapping, BUT
    // the objects are not stopped.
      
    // we use 'overlap' when detecting collisions between fire and the player
    this.game.physics.arcade.overlap(this.player, this.fires, this.killPlayer);

      // and we use overlap to detect collision between the player and the end goal
    this.game.physics.arcade.overlap(this.player, this.goal, this.winGame);

    // detect overlap between the barrels and the player
    this.game.physics.arcade.overlap(this.player, this.barrels, this.killPlayer);

    // set the speed of the player to zero by default
    this.player.body.velocity.x = 0;
      
    // check for key presses
    if (this.cursors.left.isDown || this.player.customParams.isMovingLeft == true) {
        // adjust the player velocity by the constant
        this.player.body.velocity.x = -this.RUNNING_SPEED;
        // show the player animation while it is moving, and in the correct (default) direction
        this.player.scale.setTo(1, 1);
        this.player.play('walking');
        
    } else if (this.cursors.right.isDown || this.player.customParams.isMovingRight == true) {
        this.player.body.velocity.x = this.RUNNING_SPEED;
        // show the flipped animation for walking to the right
        this.player.scale.setTo(-1, 1);
        this.player.play('walking');
        
    } else {
        // not pressing left or right
        this.player.animations.stop();
        // reset to correct frame
        this.player.frame = 3;
    }
      
    // check for jumping (up) - but ONLY if the player is DOWN touching something (floor/platform)
    if ( (this.cursors.up.isDown || this.player.customParams.mustJump == true) && this.player.body.touching.down) {
        this.player.body.velocity.y = -this.JUMPING_SPEED;
        // reset our jump flag
        this.player.customParams.mustJump = false;
    }
      
    // check to see if we need to destroy any old barrels at the bottom
    this.barrels.forEach(function(element) {
        if (element.x < 10 && element.y > 600) {
            // barrel is exhausted - remove it.
            element.kill();
        }
    }, this);
      
  },
    
    
    createOnscreenControls: function () {
        // creating buttons instead of sprites
        this.leftArrow = this.add.button(20    , 535, 'arrowButton');
        this.leftArrow.alpha = 0.5;
        this.rightArrow = this.add.button(110  , 535, 'arrowButton');
        this.rightArrow.alpha = 0.5;
        this.actionButton = this.add.button(280, 535, 'actionButton');
        this.actionButton.alpha = 0.5;
        
        // keep the onscreen buttons from moving with the camera
        this.leftArrow.fixedToCamera = true;
        this.rightArrow.fixedToCamera = true;
        this.actionButton.fixedToCamera = true;
        
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

    },
    
    killPlayer: function(player, fire) {
        console.log("YOU LOST!!!");
        game.state.start('GameState');
    },
    
    winGame: function(player, goal) {
        alert("YOU WIN!!!!");
        game.state.start('GameState');
    },
    
    // spawn the barrels
    createBarrel: function() {
        // get the first dead sprite (if any)
        var barrel = this.barrels.getFirstExists(false);
        if (! barrel) {
            // no dead sprites - so create one
            barrel = this.barrels.create(0, 0, 'barrel');
        }
        
        // make the barrels bounce
        barrel.body.collideWorldBounds = true;
        barrel.body.bounce.set(1, 0);
        
        // new or revived dead barrel - we don't care - place it
        barrel.reset(this.levelData.goal.x, this.levelData.goal.y);
        // not sure what 'reset' does - was not explained
        // adjust the barrel velocity
        barrel.body.velocity.x = this.levelData.barrelSpeed;
    }
  
};

//initiate the Phaser framework
var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');


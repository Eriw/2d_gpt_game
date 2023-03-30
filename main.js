const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };
  
  const game = new Phaser.Game(config);
  
  function preload() {
    this.load.image("sky", "assets/gradient1.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image('coin', 'assets/coin.png');
    this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
  }
  
  let platforms;
  let coins;
  let coinCounter;
  let collectedCoins = 0;

  function spawnCoin() {
    let x = Phaser.Math.Between(0, 800);
    let y = Phaser.Math.Between(100, 400);
    let coin = coins.create(x, y, 'coin');
    coin.setScale(0.2);
    coin.setBounce(0.2);
    coin.setCollideWorldBounds(true);
    coin.body.setAllowGravity(false);
    coin.body.setImmovable(true);

    // Check for overlap with platforms
    let overlapsPlatform = false;
    platforms.children.iterate(function (platform) {
    if (Phaser.Geom.Intersects.RectangleToRectangle(coin.getBounds(), platform.getBounds())) {
        overlapsPlatform = true;
        return false;
    }
    });

    // Destroy and respawn coin if it overlaps with a platform
    if (overlapsPlatform) {
        coin.destroy();
        spawnCoin();
    }
  }

  function create() {
    this.add.image(400, 300, "sky");
  
    platforms = this.physics.add.staticGroup();
  
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
  
    player = this.physics.add.sprite(100, 450, "dude");
  
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
  
    this.physics.add.collider(player, platforms);

    // Load player sprite
    // player = this.physics.add.sprite(100, 450, 'dude');

    // Define player animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Set up player physics and collisions
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // Add smaller platforms
    platforms.create(200, 400, 'ground').setScale(0.5).refreshBody();
    platforms.create(100, 200, 'ground').setScale(0.5).refreshBody();
    platforms.create(600, 300, 'ground').setScale(0.5).refreshBody();
    
    // Create coins
    coins = this.physics.add.group();

    for (let i = 0; i < 6; i++) {
        spawnCoin();
    }

    coinCounter = this.add.text(750, 50, 'Coins: 0', { fontSize: '32px', fill: '#fff' }).setOrigin(1, 0);

    
  }
  
  function update() {
    cursors = this.input.keyboard.createCursorKeys();
  
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
  
      player.anims.play("left", true);
    }
    else if (cursors.right.isDown) {
      player.setVelocityX(160);
  
      player.anims.play("right", true);
    }
    else {
      player.setVelocityX(0);
  
      player.anims.play("turn");
    }
  
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }

    this.physics.add.collider(player, platforms);

    // Collect coins
    this.physics.add.overlap(player, coins, collectCoin, null, this);
  }
  
  function collectCoin(player, coin) {
    coin.disableBody(true, true);
    collectedCoins++;
    coinCounter.setText(`Coins: ${collectedCoins}`);

     // Spawn a new coin
     spawnCoin();
  }

  function resize() {
    let canvas = this.sys.game.canvas;
    let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
  
    if (fullscreenElement) {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    } else {
      let ratio = Math.min(width / config.width, height / config.height);
      canvas.style.width = `${config.width * ratio}px`;
      canvas.style.height = `${config.height * ratio}px`;
    }
  }
  
  window.addEventListener('resize', resize);

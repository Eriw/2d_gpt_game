const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('ground', 'assets/ground.png');
    this.load.image('objects', 'assets/objects_long.png', 'assets/objects_long.json');
}

function create() {
    this.add.image(400, 300, 'ground');
    const mySprite = this.add.sprite(200, 200, 'objects', 'sprite1');

    // Set up collisions, animations, and text for quests
}

function update() {
    // Update game state, handle user input, and check for quest completion here
}

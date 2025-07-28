let config = {
  renderer: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

let game = new Phaser.Game(config);

function preload () {
    this.load.image('background', 'assets/background.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('column', 'assets/column.png');
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
 
}
let bird;
let hasLanded = false;
let cursors;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;

function create () {
    const centerX = this.cameras.main.width / 2;
    const screenBottom = this.cameras.main.height;

    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    const roads = this.physics.add.staticGroup();
/*
    const topColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 2,
        setXY: { x: this.cameras.main.width * 0.4, y: 0, stepX: this.cameras.main.width * 0.2 }
    });

    const bottomColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 2,
        setXY: { x: this.cameras.main.width * 0.5, y: this.cameras.main.height * 0.65, stepX: this.cameras.main.width * 0.2 }
    });
*/
    const topColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 3,
        setXY: {
            x: this.cameras.main.width * 0.2,
            y: this.cameras.main.height * 0.2,  // shifted down to create gap
            stepX: this.cameras.main.width * 0.2
        }
    });

    const bottomColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 3,
        setXY: {
            x: this.cameras.main.width * 0.3,
            y: this.cameras.main.height * 0.65,
            stepX: this.cameras.main.width * 0.2
        }
    });


    const road = roads.create(this.cameras.main.width / 2, this.cameras.main.height - 32, 'road').setScale(2).refreshBody();

    messageToPlayer = this.add.text(centerX, screenBottom - 50, 
        'Instructions: Press space bar to start',
        {
        font: '20px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        align: 'center',
        padding: { x: 10, y: 5 }
        }
    ).setOrigin(0.5, 1);
    
    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);

    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(bird, topColumns, ()=>hasBumped=true,null, this);
    this.physics.add.overlap(bird, bottomColumns, ()=>hasBumped=true,null, this)
    this.physics.add.collider(bird, topColumns);
    this.physics.add.collider(bird, bottomColumns);


}


function update() {
    if (cursors.up.isDown && !hasLanded && !hasBumped) {  
        bird.setVelocityY(-160);
    }

    if (cursors.space.isDown && !isGameStarted) {
        isGameStarted = true;
        messageToPlayer.text = 'Instructions: Press the "^" button to stay upright\nAnd don\'t hit the columns or ground';
    }

    if (hasLanded || hasBumped) {
        messageToPlayer.text = `Oh no! You crashed!`;
    }
   
    if (bird.x > this.cameras.main.width - 50) {
        bird.setVelocityY(40);
        messageToPlayer.text = `Congrats! You won!`;
    }

    if (!hasLanded || !hasBumped) {
        bird.body.velocity.x = 50;
    }

    if (hasLanded || hasBumped || !isGameStarted) {
        bird.body.velocity.x = 0;
    }

    if (!isGameStarted) {
        bird.setVelocityY(-160);
    }
}
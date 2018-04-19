'use strict'

var space
var space2
var player1
var player2
var enemy
var hud

const config = {}
config.RES_X = 1200 // resolucao HD
config.RES_Y = 1200

config.SCALE = 1.5

config.PLAYER_VELOCITY = 500
config.PLAYER_HEALTH = 5

config.BULLET_FIRE_RATE = 20
config.BULLET_QNT = 30
config.BULLET_LIFE_SPAN = 1000
config.BULLET_VELOCITY = 1000
config.BULLET_FIRE_RATE = 250

var game = new Phaser.Game(config.RES_X, config.RES_Y, Phaser.CANVAS,
    'game-container',
    {
        preload: preload,
        create: create,
        update: update,
        render: render
    })

function preload() {
    game.load.image('space', 'assets/space.png')
    game.load.image('plane1', 'assets/airplane1.png')
    game.load.image('shot', 'assets/shot.png')
    game.load.image('enemy', 'assets/airplane2.png')
}

function createBullets() {
    var bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(config.BULLET_QNT, 'shot')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)
    return bullets
}

function createHealthText(x, y, text) {
    var style = { font: 'bold 20px Arial', fill: 'white' }
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 5;
    text.anchor.setTo(0.5, 0.5)
    return text
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    space = game.add.sprite(0, 0, 'space')
    space2 = game.add.sprite(0, config.RES_Y, 'space')
    space.x = game.width / 2
    space.y = game.height / 2
    space.anchor.setTo(0.5, 0.5)
    space.scale.setTo(2, 2)

    player1 = new Player(game, game.width/2, game.height - 100, 'plane1', createBullets(),
        {
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        }
    )

    game.add.existing(player1)

    hud = {
        text1: createHealthText(game.width * 1 / 9, 50, 'PLAYER 1: 5'),
        text2: createHealthText(game.width * 8 / 9, 50, 'PLAYER 2: 5'),
    }
    updateHud()

    enemy = new Enemy1(game, game.width / 2, -50, 'enemy')
    game.add.existing(enemy)
}

function hitEnemy(enemy, bullet) {
    if (enemy.alive) {
        enemy.damage(1)
        bullet.kill()
    }
}

function hitPlayer(player, damager) {
    if (player.alive) {
        player.damage(1)
        damager.kill()
        updateHud()
    }
}

function update() {
    space.y += 2
    space2.y += 2
    if (space.y == config.RES_Y) {
        space.y = 0
        space2.y = config.RES_Y
    }

    /* enemy.y += 3 */

    game.physics.arcade.overlap(enemy, player1.bullets, hitEnemy);
    game.physics.arcade.collide(player1, enemy, hitPlayer);
}

function updateHud() {
    hud.text1.text = `PLAYER 1: ${player1.health}`
}

function render() {
    game.debug.body(player1)
    game.debug.body(enemy)
}
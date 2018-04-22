'use strict'

var space
var space2
var player1
var player2
var asteroid
var boss
var enemies1
var enemiesToBoss = 0
var hud
var level = 1
var gameEvents = {}

const config = {}
config.RES_X = 1200 // resolucao HD
config.RES_Y = 1200

config.SCALE = 1.5

config.PLAYER_VELOCITY = 500
config.PLAYER_HEALTH = 5
config.PLAYER_SCALE = 3

config.ENEMY_HEALTH = 1
config.ENEMY_QNT = 10
config.ENEMY_VELOCITY = 100
config.ENEMY_SPAWN_RATE = Phaser.Timer.SECOND * 4

config.BOSS_SPAWN = 0

config.BULLET_FIRE_RATE = 20
config.BULLET_QNT = 30
config.BULLET_LIFE_SPAN = 1000
config.BULLET_VELOCITY = 1000
config.BULLET_FIRE_RATE = 250

config.ENEMY_BULLET_VELOCITY = 200
config.ENEMY_BULLET_FIRE_RATE = 50

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
    game.load.image('plane1', 'assets/ship.png')
    game.load.image('shot', 'assets/shot.png')
    game.load.image('enemy1', 'assets/airplane2.png')
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

function createScoreText(x, y, text) {
    var style = { font: 'bold 20px Arial', fill: 'white' }
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 5;
    text.anchor.setTo(0.5, 0.5)
    return text
}

function createLevelText(x, y, text) {
    var style = { font: 'bold 30px Arial', fill: 'white' }
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 5;
    text.anchor.setTo(0.5, 0.5)
    return text
}

function createGameOverText(x, y, text) {
    var style = { font: 'bold 100px Arial', fill: 'white' }
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 5;
    text.anchor.setTo(0.5, 0.5)
    text.visible = false;
    return text
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.world.setBounds(0, 0, config.RES_X, config.RES_Y);

    space = game.add.sprite(0, 0, 'space')
    space2 = game.add.sprite(0, config.RES_Y, 'space')
    space.x = game.width / 2
    space.y = game.height / 2
    space.anchor.setTo(0.5, 0.5)
    space.scale.setTo(2, 2)

    player1 = new Player(game, (game.width / 2) - 100, game.height -100, 'plane1', 0xff0000,createBullets(),
        {
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            fire: Phaser.Keyboard.SPACEBAR
        }
    )

    player2 = new Player(game, (game.width / 2) + 100, game.height -100, 'plane1', 0x0000ff, createBullets(),
        {
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        }
    )

    game.add.existing(player1)
    game.add.existing(player2)


    enemies1 = game.add.group()
    enemies1.enableBody = true
    enemies1.physicsBodyType = Phaser.Physics.ARCADE
    enemies1.classType = Enemy1
    enemies1.createMultiple(config.ENEMY_QNT, 'enemy1')
    enemies1.setAll('anchor.x', 0.5)
    enemies1.setAll('anchor.y', 0.5)

    gameEvents.enemy1 = game.time.events.loop(config.ENEMY_SPAWN_RATE, createEnemy, this)

    boss = new Boss(game, game.width / 2, -50, 'enemy1')
    game.add.existing(boss)

    hud = {
        text1: createHealthText(game.width * 1 / 9, 50, 'PLAYER 1: 5'),
        text2: createHealthText(game.width * 8 / 9, 50, 'PLAYER 2: 5'),
        score1: createScoreText(game.width * 1 / 9, 80, 'SCORE: 0'),
        score2: createScoreText(game.width * 8 / 9, 80, 'SCORE: 0'),
        gameOver: createGameOverText(game.width / 2, 600, 'GAME OVER'),
        level: createLevelText(game.width / 2, 50, 'LEVEL: 1'),
    }
    updateHud()
}

function createEnemy() {
    var enemy = enemies1.getFirstExists(false)
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), -10)
        enemy.health = config.ENEMY_HEALTH
        enemy.angle = 90
    }
}

function hitEnemy(enemy1, bullet, p) {
    if (enemy1.alive && enemy1.y > 0) {
        enemy1.damage(1)
        bullet.kill()
        if (!enemy1.alive) {
            p.score += 10
            enemiesToBoss += 1
            if(enemiesToBoss == config.ENEMY_QNT){
                game.time.events.remove(gameEvents.enemy1)
                boss.reset(game.width / 2, -200)
                boss.health = config.ENEMY_HEALTH * 5
                config.BOSS_SPAWN = 1
            }
            updateHud()
        }
    }
}

function hitBoss(boss, bullet, p) {
    if (boss.alive && boss.y > 0) {
        boss.damage(1)
        bullet.kill()
        if (!boss.alive) {
            p.score += 100
            enemiesToBoss = 0
            config.ENEMY_QNT += 5
            config.ENEMY_HEALTH += 1
            config.ENEMY_VELOCITY += 60
            config.BOSS_SPAWN = 0
            level++
            config.ENEMY_SPAWN_RATE *= 8/10
            gameEvents.enemy1 = game.time.events.loop(config.ENEMY_SPAWN_RATE, createEnemy, this)
            updateHud()
        }
    }
}

function hitPlayer(player, damager) {
    if (player.alive) {
        player.damage(1)
        damager.kill()
        updateHud()
    }
}

function hitPlayerBoss(player, boss) {
    if (player.alive) {
        player.damage(1)
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

    if (boss.y < 199 && config.BOSS_SPAWN == 1){
        console.log("!")
        boss.y += 10
    }
    /* enemy1.y += 3 */

    game.physics.arcade.overlap(enemies1, player1.bullets, hitEnemy);
    game.physics.arcade.overlap(boss, player1.bullets, hitBoss);
    game.physics.arcade.collide(player1, enemies1, hitPlayer);
    game.physics.arcade.collide(player1, boss, hitPlayerBoss);

    
    game.physics.arcade.overlap(enemies1, player2.bullets, hitEnemy);
    game.physics.arcade.overlap(boss, player2.bullets, hitBoss);
    game.physics.arcade.collide(player2, enemies1, hitPlayer);
    game.physics.arcade.collide(player2, boss, hitPlayerBoss);
}


function updateHud() {
    hud.text1.text = `PLAYER 1: ${player1.health}`
    hud.score1.text = `SCORE: ${player1.score}`
    hud.text2.text = `PLAYER 2: ${player2.health}`
    hud.score2.text = `SCORE: ${player2.score}`
    if (!player1.alive) {
        hud.gameOver.visible = true;
    }
    hud.level.text = `LEVEL: ${level}`
}

function render() {
    /* game.debug.body(player1)
    game.debug.body(player2) */
}
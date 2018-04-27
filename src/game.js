'use strict'

var space
var space2
var player1
var player2
var asteroid
var boss
var enemies1
var enemies2
var enemies3
var enemiesToBoss = 0
var hud
var level = 1
var gameEvents = {}
var itens1 = {}
var itens2 = {}
var itens3 = {}
var backgroundMusic
var gameOverMusic


//Configurações do jogo
const config = {}
config.RES_X = 1200 // resolucao HD
config.RES_Y = 1200
config.SCALE = 1.5

config.INVECIBILITY_TIME = 5

//Configurações dos players
config.PLAYER_VELOCITY = 500
config.PLAYER_HEALTH = 10
config.PLAYER_SCALE = 3

config.BULLET_QNT = 100
config.BULLET_LIFE_SPAN = 1000
config.BULLET_VELOCITY = 1500
config.BULLET_FIRE_RATE = 1000

//Configurações dos inimigos
config.BOSS_HEALTH = 5
config.BOSS_VELOCITY = 100
config.BOSS_SPAWN = 0
config.BOSS_BULLET_VELOCITY = 400
config.BOSS_BULLET_FIRE_RATE = 500


config.ENEMY_QNT = 5

config.ENEMY1_HEALTH = 0
config.ENEMY1_VELOCITY = 100
config.ENEMY1_SPAWN_RATE = Phaser.Timer.SECOND * 6

config.ENEMY2_HEALTH = 1
config.ENEMY2_VELOCITY = 100
config.ENEMY2_SPAWN_RATE = Phaser.Timer.SECOND * 4
config.ENEMY2_BULLET_VELOCITY = 200
config.ENEMY2_BULLET_FIRE_RATE = 3000

config.ENEMY3_HEALTH = 1
config.ENEMY3_VELOCITY = 100
config.ENEMY3_SPAWN_RATE = Phaser.Timer.SECOND * 6
config.ENEMY3_BULLET_VELOCITY = 300
config.ENEMY3_BULLET_FIRE_RATE = 3000


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

    game.load.image('shot1', 'assets/shot1.png')
    game.load.image('shot2', 'assets/shot2.png')
    game.load.image('shot3', 'assets/shot3.png')
    game.load.image('bossShot', 'assets/bossShot.png')
    game.load.image('nuke', 'assets/nuke.png')

    game.load.image('enemy1', 'assets/asteroid.png')
    game.load.image('enemy2', 'assets/airplane2.png')
    game.load.image('enemy3', 'assets/airplane3.png')
    game.load.image('boss', 'assets/boss.png')

    game.load.image('item1', 'assets/health.png')
    game.load.image('item2', 'assets/fireRate.png')
    game.load.image('item3', 'assets/invencibility.png')

    game.load.audio(`backgroundMusic`, `assets/EpicEnd.ogg`)
    game.load.audio(`gameover`, `assets/GameOver.ogg`)
    game.load.audio(`bossShotSound`, `assets/bossShot.mp3`)
    game.load.audio(`playerShotSound`, `assets/playerShot.mp3`)
    game.load.audio(`enemy3ShotSound`, `assets/enemy3Shot.mp3`)
}

function createBullets(img) {
    var bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(config.BULLET_QNT, img)
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)
    return bullets
}

function createItems(img) {
    var itens = game.add.group()
    itens.enableBody = true
    itens.physicsBodyType = Phaser.Physics.ARCADE
    itens.createMultiple(10, img)
    itens.setAll('anchor.x', 0.5)
    itens.setAll('anchor.y', 0.5)
    itens.setAll('scale.x', 0.4)
    itens.setAll('scale.y', 0.4)

    return itens
}

function createHealthText(x, y, text) {
    var style = { font: 'bold 25px Arial', fill: 'white' }
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000'
    text.strokeThickness = 5
    text.anchor.setTo(0.5, 0.5)
    return text
}

function createScoreText(x, y, text) {
    var style = { font: 'bold 25px Arial', fill: 'white' }
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000'
    text.strokeThickness = 5
    text.anchor.setTo(0.5, 0.5)
    return text
}

function createLevelText(x, y, text) {
    var style = { font: 'bold 35px Arial', fill: 'white' }
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000'
    text.strokeThickness = 5
    text.anchor.setTo(0.5, 0.5)
    return text
}

function createGameOverText(x, y, text) {
    var style = { font: 'bold 100px Arial', fill: 'white' }
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000'
    text.strokeThickness = 5
    text.anchor.setTo(0.5, 0.5)
    text.visible = false
    return text
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.world.setBounds(0, 0, config.RES_X, config.RES_Y)

    backgroundMusic = game.add.audio(`backgroundMusic`)
    backgroundMusic.volume = 0.1
    backgroundMusic.loop = true
    backgroundMusic.play()

    gameOverMusic = game.add.audio(`gameover`)
    gameOverMusic.volume = 0.1

    space = game.add.sprite(0, 0, 'space')
    space2 = game.add.sprite(0, config.RES_Y, 'space')
    space.x = game.width / 2
    space.y = game.height / 2
    space.anchor.setTo(0.5, 0.5)
    space.scale.setTo(2, 2)

    player1 = new Player(game, (game.width / 2) - 100, game.height - 100, 'plane1', 0x008000, createBullets(`shot1`),
        {
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            fire: Phaser.Keyboard.SPACEBAR
        },
        'playerShotSound'
    )

    player2 = new Player(game, (game.width / 2) + 100, game.height - 100, 'plane1', 0xff0000, createBullets(`shot2`),
        {
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        },
        'playerShotSound'
    )

    game.add.existing(player1)
    game.add.existing(player2)

    //Criação dos asteroides
    enemies1 = game.add.group()
    enemies1.enableBody = true
    enemies1.physicsBodyType = Phaser.Physics.ARCADE
    enemies1.classType = Enemy1
    enemies1.createMultiple(config.ENEMY_QNT, 'enemy1')
    enemies1.setAll('anchor.x', 0.5)
    enemies1.setAll('anchor.y', 0.5)

    //Criação das naves inimigas tipo 1
    enemies2 = game.add.group()
    enemies2.enableBody = true
    enemies2.physicsBodyType = Phaser.Physics.ARCADE
    enemies2.classType = Enemy2
    enemies2.createMultiple(config.ENEMY_QNT, 'enemy2')
    enemies2.setAll('anchor.x', 0.5)
    enemies2.setAll('anchor.y', 0.5)

    gameEvents.enemy2 = game.time.events.loop(config.ENEMY2_SPAWN_RATE, createEnemy2, this)

    //Criação das naves inimigas tipo 2
    enemies3 = game.add.group()
    enemies3.enableBody = true
    enemies3.physicsBodyType = Phaser.Physics.ARCADE
    enemies3.classType = Enemy3
    enemies3.createMultiple(config.ENEMY_QNT, 'enemy3')
    enemies3.setAll('anchor.x', 0.5)
    enemies3.setAll('anchor.y', 0.5)

    itens1 = createItems('item1')

    itens2 = createItems('item2')

    itens3 = createItems('item3')

    boss = new Boss(game, game.width / 2, -50, 'boss', 'bossShot','bossShotSound')
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
        enemy.reset(game.rnd.integerInRange(48, game.width - 48), -10)
        enemy.health = config.ENEMY1_HEALTH
        enemy.angle = 90
    }
}

function createEnemy2() {
    var enemy = enemies2.getFirstExists(false)
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(48, game.width - 48), -10)
        enemy.health = config.ENEMY2_HEALTH
        enemy.angle = 90
        if (enemy.x > game.width / 2) {
            enemy.angle += (enemy.x - (game.width / 2)) / 22
        } else {
            enemy.angle -= ((game.width / 2) - enemy.x) / 22
        }
    }
}

function createEnemy3() {
    var enemy = enemies3.getFirstExists(false)
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(48, game.width - 48), -10)
        enemy.health = config.ENEMY3_HEALTH
        enemy.angle = 90
    }
}

function spawnItem(x, y) {
    var aux = game.rnd.integerInRange(1, 3)

    if (aux == 1) {
        var item = itens1.getFirstExists(false)
        if (item) {
            item.reset(x, y)
            item.body.velocity.y = 200
        }
    } else if (aux == 2) {
        var item = itens2.getFirstExists(false)
        if (item) {
            item.reset(x, y)
            item.body.velocity.y = 200
        }
    } else if (aux == 3) {
        var item = itens3.getFirstExists(false)
        if (item) {
            item.reset(x, y)
            item.body.velocity.y = 200
        }
    }
}

function player1HitEnemy1(enemy, bullet) {
    if (enemy.alive && enemy.y > 0) {
        enemy.damage(1)
        bullet.kill()
        if (!enemy.alive) {
            player1.score += 5 * level
            spawnItem(enemy.x, enemy.y)
            updateHud()
        }
    }
}

function player1HitEnemy2(enemy, bullet) {
    if (enemy.alive && enemy.y > 0) {
        enemy.damage(1)
        bullet.kill()
        if (!enemy.alive) {
            player1.score += 10 * level
            enemiesToBoss += 1
            if (enemiesToBoss == config.ENEMY_QNT) {
                game.time.events.remove(gameEvents.enemy2)
                game.time.events.remove(gameEvents.enemy3)
                boss.reset(game.width / 2, -200)
                boss.health = config.BOSS_HEALTH
                boss.weapon.fireRate = config.BOSS_BULLET_FIRE_RATE
                config.BOSS_SPAWN = 1
            }
            updateHud()
        }
    }
}

function player1HitEnemy3(enemy, bullet) {
    if (enemy.alive && enemy.y > 0) {
        enemy.damage(1)
        bullet.kill()
        if (!enemy.alive) {
            player1.score += 10 * level
            enemiesToBoss += 1
            if (enemiesToBoss == config.ENEMY_QNT) {
                game.time.events.remove(gameEvents.enemy2)
                game.time.events.remove(gameEvents.enemy3)
                boss.reset(game.width / 2, -200)
                boss.health = config.BOSS_HEALTH
                boss.weapon.fireRate = config.BOSS_BULLET_FIRE_RATE
                config.BOSS_SPAWN = 1
            }
            updateHud()
        }
    }
}

function player1HitBoss(boss, bullet) {
    if (boss.alive && boss.y > 0) {
        boss.damage(1)
        bullet.kill()
        if (!boss.alive) {
            player1.score += 100 * level
            enemiesToBoss = 0
            config.ENEMY_QNT += 0
            config.ENEMY1_HEALTH += 1

            config.ENEMY2_HEALTH += 1
            config.ENEMY2_VELOCITY += 60

            config.ENEMY3_HEALTH += 1
            config.ENEMY3_VELOCITY += 60

            config.BOSS_SPAWN = 0
            if (config.BOSS_BULLET_FIRE_RATE > 100) {
                config.BOSS_BULLET_FIRE_RATE -= 50
            }
            level++
            config.ENEMY2_SPAWN_RATE *= 8 / 10
            if (level >= 2) {
                gameEvents.enemy1 = game.time.events.loop(config.ENEMY1_SPAWN_RATE, createEnemy, this)
            }
            if (level >= 3) {
                gameEvents.enemy3 = game.time.events.loop(config.ENEMY3_SPAWN_RATE, createEnemy3, this)
            }
            gameEvents.enemy2 = game.time.events.loop(config.ENEMY2_SPAWN_RATE, createEnemy2, this)
            updateHud()
        }
    }
}

function player2HitEnemy1(enemy1, bullet) {
    if (enemy1.alive && enemy1.y > 0) {
        enemy1.damage(1)
        bullet.kill()
        if (!enemy1.alive) {
            player2.score += 5 * level
            spawnItem(enemy1.x, enemy1.y)
            updateHud()
        }
    }
}

function player2HitEnemy2(enemy2, bullet) {
    if (enemy2.alive && enemy2.y > 0) {
        enemy2.damage(1)
        bullet.kill()
        if (!enemy2.alive) {
            player2.score += 10 * level
            enemiesToBoss += 1
            if (enemiesToBoss == config.ENEMY_QNT) {
                game.time.events.remove(gameEvents.enemy2)
                game.time.events.remove(gameEvents.enemy3)
                boss.reset(game.width / 2, -200)
                boss.health = config.BOSS_HEALTH
                config.BOSS_SPAWN = 1
            }
            updateHud()
        }
    }
}

function player2HitEnemy3(enemy, bullet) {
    if (enemy.alive && enemy.y > 0) {
        enemy.damage(1)
        bullet.kill()
        if (!enemy.alive) {
            player2.score += 10 * level
            enemiesToBoss += 1
            if (enemiesToBoss == config.ENEMY_QNT) {
                game.time.events.remove(gameEvents.enemy2)
                game.time.events.remove(gameEvents.enemy3)
                boss.reset(game.width / 2, -200)
                boss.health = config.BOSS_HEALTH
                boss.weapon.fireRate = config.BOSS_BULLET_FIRE_RATE
                config.BOSS_SPAWN = 1
            }
            updateHud()
        }
    }
}


function player2HitBoss(boss, bullet) {
    if (boss.alive) {
        boss.damage(1)
        bullet.kill()
        if (!boss.alive) {
            player2.score += 100 * level
            enemiesToBoss = 0
            config.ENEMY_QNT += 0
            config.ENEMY1_HEALTH += 1

            config.ENEMY2_HEALTH += 1
            config.ENEMY2_VELOCITY += 60

            config.ENEMY3_HEALTH += 1
            config.ENEMY3_VELOCITY += 60

            config.BOSS_SPAWN = 0
            if (config.BOSS_BULLET_FIRE_RATE > 100) {
                config.BOSS_BULLET_FIRE_RATE -= 50
            }
            level++
            config.ENEMY2_SPAWN_RATE *= 8 / 10
            config.ENEMY3_SPAWN_RATE *= 8 / 10
            if (level >= 2) {
                gameEvents.enemy1 = game.time.events.loop(config.ENEMY1_SPAWN_RATE, createEnemy, this)
            }
            if (level >= 3) {
                gameEvents.enemy3 = game.time.events.loop(config.ENEMY3_SPAWN_RATE, createEnemy3, this)
            }
            gameEvents.enemy2 = game.time.events.loop(config.ENEMY2_SPAWN_RATE, createEnemy2, this)
            updateHud()
        }
    }
}

function enemyBulletHitPlayer(player, damager) {
    if (player.alive) {
        if (player.invencible != 1) {
            player.damage(1)
        }
        damager.kill()
        updateHud()
    }
}

function enemyHitPlayer(player, damager) {
    if (player.alive) {
        if (player.invencible != 1) {
            player.damage(level)
        }
        damager.kill()
        updateHud()
    }
}

function bossHitPlayer(player, boss) {
    if (player.alive) {
        if (player.invencible != 1) {
            player.damage(2 * level)
        }
        updateHud()
    }
}

function bossBulletHitPlayer(player, bossBullet) {
    if (player.alive) {
        if (player.invencible != 1) {
            player.damage(2)
        }
        bossBullet.kill()
        updateHud()
    }
}

function pickHealthPack(player, healthPack) {
    player.health += 1
    healthPack.kill()
    updateHud()
}

function pickFireRateUpgrade(player, fireRateUpgrade) {
    if (player.fireRate > 100) {
        player.fireRate -= 50
    } else {
        player.score += 10
    }
    fireRateUpgrade.kill()
}

function pickInvencibility(player, invencibilityDrop) {
    invencibilityDrop.kill()
    player.invencible = 1
    player.tweenInvencible.start()
    gameEvents.invencibilityTimer = game.time.events.add(Phaser.Timer.SECOND * config.INVECIBILITY_TIME, removeInvencibility, this, player)
}

function removeInvencibility(player) {
    player.invencible = 0
}

function update() {
    space.y += 2
    space2.y += 2
    if (space.y == config.RES_Y) {
        space.y = 0
        space2.y = config.RES_Y
    }

    if (boss.y < 149 && config.BOSS_SPAWN == 1) {
        boss.y += 10
    }


    game.physics.arcade.overlap(enemies1, player1.bullets, player1HitEnemy1)
    game.physics.arcade.overlap(enemies2, player1.bullets, player1HitEnemy2)
    game.physics.arcade.overlap(enemies3, player1.bullets, player1HitEnemy3)
    game.physics.arcade.overlap(boss, player1.bullets, player1HitBoss)

    game.physics.arcade.collide(player1, enemies1, enemyHitPlayer)
    game.physics.arcade.collide(player1, enemies2, enemyHitPlayer)
    game.physics.arcade.collide(player1, enemies3, enemyHitPlayer)

    enemies2.forEach(function (enemy2) {
        game.physics.arcade.collide(player1, enemy2.weapon.bullets, enemyBulletHitPlayer)
    })
    enemies3.forEach(function (enemy3) {
        game.physics.arcade.collide(player1, enemy3.weapon.bullets, enemyBulletHitPlayer)
    })
    game.physics.arcade.collide(player1, boss, bossHitPlayer)
    game.physics.arcade.collide(player1, boss.weapon.bullets, bossBulletHitPlayer)

    game.physics.arcade.overlap(player1, itens1, pickHealthPack)
    game.physics.arcade.overlap(player1, itens2, pickFireRateUpgrade)
    game.physics.arcade.overlap(player1, itens3, pickInvencibility)




    game.physics.arcade.overlap(enemies1, player2.bullets, player2HitEnemy1)
    game.physics.arcade.overlap(enemies2, player2.bullets, player2HitEnemy2)
    game.physics.arcade.overlap(enemies3, player2.bullets, player1HitEnemy3)
    game.physics.arcade.overlap(boss, player2.bullets, player2HitBoss)

    game.physics.arcade.collide(player2, enemies1, enemyHitPlayer)
    game.physics.arcade.collide(player2, enemies2, enemyHitPlayer)
    game.physics.arcade.collide(player2, enemies3, enemyHitPlayer)

    enemies2.forEach(function (enemy2) {
        game.physics.arcade.collide(player2, enemy2.weapon.bullets, enemyBulletHitPlayer)
    })
    enemies3.forEach(function (enemy3) {
        game.physics.arcade.collide(player2, enemy3.weapon.bullets, enemyBulletHitPlayer)
    })
    game.physics.arcade.collide(player2, boss, bossHitPlayer)
    game.physics.arcade.collide(player2, boss.weapon.bullets, bossBulletHitPlayer)

    game.physics.arcade.overlap(player2, itens1, pickHealthPack)
    game.physics.arcade.overlap(player2, itens2, pickFireRateUpgrade)
    game.physics.arcade.overlap(player2, itens3, pickInvencibility)



    updateBullets(player1.bullets)
    updateBullets(player2.bullets)
    updateBullets(itens1)
    updateBullets(itens2)
    updateBullets(itens3)
    updateEnemy(enemies1)
    updateEnemy(enemies2)
    updateEnemy(enemies3)
}


function updateHud() {
    if (player1.health < 0) player1.health = 0
    if (player2.health < 0) player2.health = 0
    hud.text1.text = `PLAYER 1: ${player1.health}`
    hud.score1.text = `SCORE: ${player1.score}`
    hud.text2.text = `PLAYER 2: ${player2.health}`
    hud.score2.text = `SCORE: ${player2.score}`
    if (!player1.alive && !player2.alive) {
        hud.gameOver.visible = true
        backgroundMusic.stop()
        gameOverMusic.play()
    }
    hud.level.text = `LEVEL: ${level}`
}

function updateBullets(bullets) {
    bullets.forEach(function (bullet) {
        killOutOfScreen(bullet)
    })
}

function updateEnemy(bullets) {
    bullets.forEach(function (bullet) {
        killEnemyOutOfScreen(bullet)
    })
}

function killOutOfScreen(sprite) {
    if (sprite.x < 0 || sprite.x > game.width || sprite.y < 0 || sprite.y > game.height) {
        sprite.kill()
    }
}

function killEnemyOutOfScreen(sprite) {
    if (sprite.x < 0 || sprite.x > game.width || sprite.y > game.height) {
        sprite.kill()
    }
}

function render() {
    /* game.debug.body(player1)
    game.debug.body(player2) */
    /* enemies3.forEach(function (obj) {
        game.debug.body(obj)
    }) */
    /* game.debug.body(boss) */
}
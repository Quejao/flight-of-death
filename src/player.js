
class Player extends Phaser.Sprite {
    constructor(game, x, y, img, tint, bullets, keys, sound) {
        super(game, x, y, img)
        this.scale.setTo(config.PLAYER_SCALE, config.PLAYER_SCALE)
        this.tint = tint
        this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.maxVelocity.set(config.PLAYER_VELOCITY)
        this.body.isCircle = true
        this.nextFire = 0
        this.angle = -90
        this.score = 0
        this.body.collideWorldBounds = true
        this.invencible = 0

        this.playerColor = tint

        this.fireRate = config.BULLET_FIRE_RATE

        this.sound = game.add.audio(sound)
        this.sound.volume = 0.1

        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            up: game.input.keyboard.addKey(keys.up),
            down: game.input.keyboard.addKey(keys.down),
            fire: game.input.keyboard.addKey(keys.fire)
        }

        this.bullets = bullets

        this.tweenInvencible = game.add.tween(this).to({ alpha: 20 }, 2000).to({ alpha: 100 }, 2000).loop(true)
    }

    moveAndStop() {


        this.body.velocity.setTo(0, 0)

        if (this.cursors.left.isDown) {
            this.body.velocity.x = -config.PLAYER_VELOCITY
        }
        else
            if (this.cursors.right.isDown) {
                this.body.velocity.x = config.PLAYER_VELOCITY
            }

        if (this.cursors.up.isDown) {
            this.body.velocity.y = -config.PLAYER_VELOCITY
        }
        else
            if (this.cursors.down.isDown) {
                this.body.velocity.y = config.PLAYER_VELOCITY
            }

        // limita velocidade maxima (nas diagonais)
        if (this.body.velocity.getMagnitude() > config.PLAYER_VELOCITY) {
            this.body.velocity.setMagnitude(config.PLAYER_VELOCITY)
        }
    }

    fireBullet() {
        if (!this.alive)
            return

        if (this.cursors.fire.isDown) {
            if (this.game.time.time > this.nextFire) {
                var bullet = this.bullets.getFirstExists(false)
                if (bullet) {
                    bullet.reset(this.x, this.y)
                    bullet.lifespan = config.BULLET_LIFE_SPAN
                    bullet.rotation = this.rotation
                    bullet.scale.setTo(config.SCALE, config.SCALE)
                    bullet.body.bounce.setTo(1, 1)
                    bullet.body.friction.setTo(0, 0)
                    game.physics.arcade.velocityFromRotation(
                        bullet.rotation, config.BULLET_VELOCITY, bullet.body.velocity
                    )
                    this.sound.play()

                    this.nextFire = this.game.time.time + this.fireRate
                }
            }
        }
    }

    update() {
        this.moveAndStop()
        this.fireBullet()
        if (this.invencible == 1) {
            this.tweenInvencible.start()
        }
    }
}

class Player extends Phaser.Sprite {
    constructor(game, x, y, img, bullets, keys) {
        super(game, x, y, img)
        this.scale.setTo(config.SCALE, config.SCALE)
        this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.maxVelocity.set(config.PLAYER_VELOCITY)
        this.body.isCircle = true
        this.nextFire = 0
        this.angle = -90
        this.score = 0
        this.body.collideWorldBounds = true;
        
        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            up: game.input.keyboard.addKey(keys.up),
            down: game.input.keyboard.addKey(keys.down),        
            fire: game.input.keyboard.addKey(keys.fire)
        }

        this.bullets = bullets
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
            return;
    
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
    
                    this.nextFire = this.game.time.time + config.BULLET_FIRE_RATE
                }
            }
        }
    }

    update() {
        this.moveAndStop()
        this.fireBullet()
    }
}
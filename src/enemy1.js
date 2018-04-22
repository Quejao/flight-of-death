class Enemy1 extends Phaser.Sprite {
    constructor(game, x, y, img, bullets) {
        super(game, x, y, img)
        this.scale.setTo(config.SCALE, config.SCALE)
        this.y = 0 - this.height
        this.SPEED_X = config.ENEMY_VELOCITY
        this.SPEED_Y = config.ENEMY_VELOCITY
        this.nextFire = 0
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.maxVelocity.set(this.SPEED_X)
        this.health = config.ENEMY_HEALTH
        
        this.nextFire = 0
        this.bullets = bullets

        this.body.isCircle = true

        this.angle = game.rnd.integerInRange(60, 120)

    }

    /* fireBullet(){
        if (this.game.time.time > this.nextFire) {
            var bullet = this.bullets.getFirstExists(false)
            if (bullet) {
                bullet.reset(this.x, this.y)
                bullet.lifespan = config.ENEMY_BULLET_LIFE_SPAN
                bullet.rotation = this.rotation
                bullet.scale.setTo(config.SCALE, config.SCALE)
                bullet.body.bounce.setTo(1, 1)
                bullet.body.friction.setTo(0, 0)
                game.physics.arcade.velocityFromRotation(
                    bullet.rotation, config.ENEMY_BULLET_VELOCITY, bullet.body.velocity
                )

                this.nextFire = this.game.time.time + config.ENEMY_BULLET_FIRE_RATE
            }
        }
    } */

    update() {
        game.physics.arcade.accelerationFromRotation(this.rotation, 2000, this.body.acceleration);
    }
}
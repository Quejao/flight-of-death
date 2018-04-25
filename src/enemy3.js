class Enemy3 extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.scale.setTo(config.SCALE, config.SCALE)
        this.y = 0 - this.height
        this.SPEED_X = config.ENEMY3_VELOCITY
        this.SPEED_Y = config.ENEMY3_VELOCITY
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.maxVelocity.set(this.SPEED_X)
        this.health = config.ENEMY3_HEALTH
        this.body.isCircle = true

    }

    update() {
        game.physics.arcade.accelerationFromRotation(this.rotation, 2000, this.body.acceleration) 
    }
}
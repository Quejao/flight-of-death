class Boss extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.scale.setTo(config.SCALE * 5, config.SCALE * 5)
        this.y = -200
        this.SPEED_X = config.ENEMY_VELOCITY
        this.SPEED_Y = config.ENEMY_VELOCITY
        this.nextFire = 0
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.maxVelocity.set(this.SPEED_X)
        this.health = config.ENEMY_HEALTH * 5

        this.body.isCircle = true

        this.angle = 90

    }


    update() {
    }
}
class Enemy1 extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.scale.setTo(config.SCALE, config.SCALE)
        this.x = game.width / 2
        this.y = 0 - this.height
        this.SPEED_X = config.PLAYER_VELOCITY
        this.SPEED_Y = config.PLAYER_VELOCITY
        this.nextFire = 0
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.maxVelocity.set(this.SPEED_X)
        this.health = 5

        this.body.isCircle = true
        

        this.angle = 90

    }

    update() {
        this.y += 3
    }
}
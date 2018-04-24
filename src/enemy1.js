class Enemy1 extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.scale.setTo(config.SCALE, config.SCALE)
        this.y = 0 - this.height
        this.SPEED_X = config.ENEMY1_VELOCITY
        this.SPEED_Y = config.ENEMY1_VELOCITY
        this.nextFire = 0
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.maxVelocity.set(this.SPEED_X)
        this.health = config.ENEMY1_HEALTH
        this.body.isCircle = true
        
        this.nextFire = 0

        this.body.isCircle = true

    }

    update() {
        game.physics.arcade.accelerationFromRotation(this.rotation, 2000, this.body.acceleration) 
    }
}
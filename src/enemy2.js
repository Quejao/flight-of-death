class Enemy2 extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.scale.setTo(config.SCALE, config.SCALE)
        this.y = 0 - this.height
        this.SPEED_X = config.ENEMY2_VELOCITY
        this.SPEED_Y = config.ENEMY2_VELOCITY
        this.nextFire = 0
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.maxVelocity.set(this.SPEED_X)
        this.health = config.ENEMY2_HEALTH
        this.body.setSize(60,40,-10,10)
        
        this.weapon = game.add.weapon(10, 'nuke')
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        this.weapon.fireAngle = 90
        this.weapon.bulletSpeed = config.ENEMY2_BULLET_VELOCITY
        this.weapon.fireRate = config.ENEMY2_BULLET_FIRE_RATE
        this.weapon.trackSprite(this, 0, 14)

    }

    update() {
        game.physics.arcade.accelerationFromRotation(this.rotation, 2000, this.body.acceleration) 
        
        if (this.alive) {
            this.weapon.fire()
        }

    }
}
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

        this.weapon = game.add.weapon(10, 'shot2')
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        this.weapon.fireAngle = 90
        this.weapon.bulletSpeed = config.ENEMY3_BULLET_VELOCITY
        this.weapon.fireRate = 0
        this.weapon.trackSprite(this, 0, 0)
        this.nextFire = game.time.now + config.ENEMY3_BULLET_FIRE_RATE 

    }

    update() {
        game.physics.arcade.accelerationFromRotation(this.rotation, 2000, this.body.acceleration)
        if (game.time.now > this.nextFire && this.position.x > 0 && this.alive) {
            var center = new Phaser.Point(this.position.x, this.position.y+20) 
            this.weapon.fireAngle = 90 
            this.weapon.fire(center)

            var left = new Phaser.Point(this.position.x - 16, this.position.y+20) 
            this.weapon.fireAngle = 95 + 15 
            this.weapon.fire(left) 

            // Right bullets
            var right = new Phaser.Point(this.position.x + 16, this.position.y+20) 
            this.weapon.fireAngle = 85 - 15 
            this.weapon.fire(right) 

            this.nextFire = game.time.now + config.ENEMY3_BULLET_FIRE_RATE
        }

    }
}
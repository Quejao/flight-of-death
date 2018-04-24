class Boss extends Phaser.Sprite {
    constructor(game, x, y, img, bulletKey) {
        super(game, x, y, img)
        this.scale.setTo(config.SCALE * 5, config.SCALE * 5)
        this.y = -200
        this.SPEED_X = config.BOSS_VELOCITY
        this.SPEED_Y = config.BOSS_VELOCITY
        this.nextFire = 0
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.maxVelocity.set(this.SPEED_X)
        this.health = config.BOSS_HEALTH

        this.body.isCircle = true

        this.angle = 90


        this.weapon = game.add.weapon(10, bulletKey)
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        this.weapon.fireAngle = 90
        this.weapon.bulletSpeed = config.BOSS_BULLET_VELOCITY
        this.weapon.fireRate = config.BOSS_BULLET_FIRE_RATE
        this.weapon.bulletAngleVariance = 50
        this.weapon.trackSprite(this, 0, 120)
        

        var left = this.width
        var right = game.width - this.width
        var hDelay = game.width / (200 / 1000)

        this.movementTween = game.add.tween(this)
            .to({ x: right }, hDelay/2)
            .to({ x: left }, hDelay)
            .to({ x: game.width/2 }, hDelay)
            .loop(true)

    }

    update() {
        if (this.alive) {
            this.weapon.fire()
        }

        if(this.y > 0){
            this.movementTween.start()
        }
    }
}
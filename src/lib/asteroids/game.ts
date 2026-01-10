
import { Game, Scene } from "phaser";
import { CONSTANTS } from "./constants";

const physicsBody = (gameObject: Phaser.GameObjects.GameObject) => {
    if (gameObject.body) {
        return gameObject.body as Phaser.Physics.Arcade.Body;
    } else {
        throw new Error("GameObject does not have a body");
    }
}

interface Position {
    x: number;
    y: number;
}

class MyScene extends Scene {
    cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
    player!: Phaser.GameObjects.Triangle;
    asteroids!: Phaser.Physics.Arcade.Group;
    bullets!: Phaser.Physics.Arcade.Group;
    reloading: boolean = false;

    constructor() {
        super({ key: 'MyScene' });
    }

    // asset load
    preload() { }

    // scene setup
    create() {
        // input setup
        this.cursorKeys = this.input.keyboard!.createCursorKeys();

        // player setup
        this.player = this.add.triangle(400, 300, 0, 0, 40, 15, 0, 30, 0x0000ff);
        this.physics.add.existing(this.player);
        physicsBody(this.player).setMaxSpeed(CONSTANTS.MOVEMENT_MAX_SPEED);

        // asteroids
        this.asteroids = this.physics.add.group();
        this.createAsteroids(AsteroidSize.LARGE, 3);

        // bullets group
        this.bullets = this.physics.add.group();

        // collisions
        this.physics.add.overlap(this.bullets, this.asteroids, (bullet, asteroidObj) => {
            const asteroid = asteroidObj as Asteroid;
            if (asteroid.size === AsteroidSize.LARGE) {
                this.createAsteroids(AsteroidSize.MEDIUM, 2, { x: asteroid.x, y: asteroid.y });
            } else if (asteroid.size === AsteroidSize.MEDIUM) {
                this.createAsteroids(AsteroidSize.SMALL, 2, { x: asteroid.x, y: asteroid.y });
            }
            bullet.destroy();
            asteroid.destroy();
        });
    }

    // game loop
    update() {
        this.shoot();
        this.move();

        // when moving off the world bounds, wrap around
        this.wrapBounds(this.player);
        this.asteroids.children.iterate((asteroid) => {
            this.wrapBounds(asteroid as Phaser.GameObjects.Shape);
            return true;
        })
        this.bullets.children.iterate((bullet) => {
            this.wrapBounds(bullet as Phaser.GameObjects.Shape);
            return true;
        });
    }

    private shoot() {
        if (this.cursorKeys.space.isDown && !this.reloading) {
            const bullet = this.add.ellipse(this.player.x, this.player.y, 5, 5, 0xffffff);
            this.bullets.add(bullet);
            // appear under the player
            bullet.setDepth(-1);
            this.physics.add.existing(bullet);
            bullet.rotation = this.player.rotation;
            physicsBody(bullet).setVelocity(
                CONSTANTS.BULLET_SPEED * Math.cos(bullet.rotation),
                CONSTANTS.BULLET_SPEED * Math.sin(bullet.rotation)
            );

            // start reload timer
            this.reloading = true;
            this.time.delayedCall(CONSTANTS.BULLET_RELOAD_TIME, () => {
                this.reloading = false;
            });

            // destroy bullet after 2 seconds
            this.time.delayedCall(CONSTANTS.BULLET_LIFETIME, () => {
                bullet.destroy();
            });
        }
    }

    private move() {
        const body = physicsBody(this.player);

        if (this.cursorKeys.up.isDown) {
            body.setVelocity(
                body.velocity.x + CONSTANTS.MOVEMENT_SPEED_DELTA * Math.cos(this.player.rotation),
                body.velocity.y + CONSTANTS.MOVEMENT_SPEED_DELTA * Math.sin(this.player.rotation)
            );
        }

        if (this.cursorKeys.right.isDown) {
            this.player.setRotation(this.player.rotation + CONSTANTS.MOVEMENT_ROTATION_DELTA);
        } else if (this.cursorKeys.left.isDown) {
            this.player.setRotation(this.player.rotation - CONSTANTS.MOVEMENT_ROTATION_DELTA);
        }
    }

    private wrapBounds(object: Phaser.GameObjects.Shape) {
        if (object.x < 0) {
            object.setX(this.sys.canvas.width);
        } else if (object.x > this.sys.canvas.width) {
            object.setX(0);
        }
        if (object.y < 0) {
            object.setY(this.sys.canvas.height);
        } else if (object.y > this.sys.canvas.height) {
            object.setY(0);
        }
    }

    private createAsteroids(size: AsteroidSize, count: number = 1, position?: Position) {
        for (let i = 0; i < count; i++) {
            const x = position ? position.x : Phaser.Math.Between(0, this.sys.canvas.width);
            const y = position ? position.y : Phaser.Math.Between(0, this.sys.canvas.height);
            new Asteroid(this.asteroids, x, y, size);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    scene: [
        MyScene
    ]
};

export default class MyGame extends Game {
    constructor() {
        super(config);
    }
}

enum AsteroidSize {
    LARGE,
    MEDIUM,
    SMALL
}

class Asteroid extends Phaser.GameObjects.Ellipse {
    size: AsteroidSize;

    static AsteroidSizeMap = {
        [AsteroidSize.LARGE]: { diameter: CONSTANTS.ASTEROID_SIZE_LARGE, speed: CONSTANTS.ASTEROID_SPEED_LARGE },
        [AsteroidSize.MEDIUM]: { diameter: CONSTANTS.ASTEROID_SIZE_MEDIUM, speed: CONSTANTS.ASTEROID_SPEED_MEDIUM },
        [AsteroidSize.SMALL]: { diameter: CONSTANTS.ASTEROID_SIZE_SMALL, speed: CONSTANTS.ASTEROID_SPEED_SMALL },
    }

    constructor(group: Phaser.Physics.Arcade.Group, x: number, y: number, size: AsteroidSize) {
        let diameter = Asteroid.AsteroidSizeMap[size].diameter;
        let speed = Asteroid.AsteroidSizeMap[size].speed;
        super(group.scene, x, y, diameter, diameter, 0x00ff00);

        this.size = size;

        group.scene.add.existing(this);
        group.add(this);

        this.setRotation(Phaser.Math.DegToRad(Phaser.Math.Between(0, 360)));
        physicsBody(this).setVelocity(Math.sin(this.rotation) * speed, Math.cos(this.rotation) * speed);
    }
}
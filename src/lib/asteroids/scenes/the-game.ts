
import { Scene } from "phaser";
import { ScoreBug } from "../objects/score-bug";
import { physicsBody, Position, randomOutsidePosition } from "../helpers";
import { CONSTANTS } from "../constants";
import { Asteroid, AsteroidSize } from "../objects/asteroid";
import { EndData } from "./end";
import { Player } from "../objects/player";

export class TheGame extends Scene {
    cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
    pauseKey!: Phaser.Input.Keyboard.Key;
    player!: Phaser.GameObjects.Triangle;
    asteroids!: Phaser.Physics.Arcade.Group;
    bullets!: Phaser.Physics.Arcade.Group;
    reloading: boolean = false;
    scoreBug!: ScoreBug;
    paused: boolean = false;

    constructor() {
        super({ key: 'the-game' });
    }

    // asset load
    preload() { }

    // scene setup
    create() {
        console.log("scene size", this.scale.width, this.scale.height);

        // input setup
        this.cursorKeys = this.input.keyboard!.createCursorKeys();
        this.pauseKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // score bug
        this.scoreBug = new ScoreBug(this, 10, 10, 0);

        // player setup
        this.player = new Player(this, this.physics, 400, 300);

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

            this.scoreBug.addToScore(Asteroid.AsteroidConfigMap[asteroid.size].score);

            bullet.destroy();
            asteroid.destroy();
        });

        this.physics.add.overlap(
            this.player,
            this.asteroids,
            () => {
                const endData: EndData = { finalScore: this.scoreBug.getScore() };
                this.scene.start('end', endData);
            },
            (playerArg, asteroidArg) => {
                // phaser types are too broad
                const player = playerArg as Player;
                const asteroid = asteroidArg as Asteroid;

                // only trigger if the player actually collides with the asteroid, not just overlaps
                return Phaser.Geom.Intersects.TriangleToCircle(player.getGeomTriangle(), asteroid.getGeomCircle());
            }
        );
    }

    // game loop
    update() {
        this.shoot();
        this.move();
        this.pause();

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

    private pause() {
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.paused = !this.paused;
            this.physics.world.isPaused = this.paused;
        }
    }

    private shoot() {
        if (this.cursorKeys.space.isDown && !this.reloading && !this.paused) {
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
        if (this.paused) {
            return;
        }

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
            const { x, y } = position ? position : randomOutsidePosition(this);

            console.log(`Creating asteroid at (${x}, ${y})`);

            new Asteroid(this.asteroids, x, y, size);
        }
    }
}
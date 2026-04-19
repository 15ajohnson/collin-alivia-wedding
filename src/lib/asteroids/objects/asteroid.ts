
import { CONSTANTS } from "../constants";
import { physicsBody } from "../helpers";

export enum AsteroidSize {
    LARGE,
    MEDIUM,
    SMALL
}

export class Asteroid extends Phaser.GameObjects.Ellipse {
    size: AsteroidSize;

    static AsteroidConfigMap = {
        [AsteroidSize.LARGE]: { diameter: CONSTANTS.ASTEROID_SIZE_LARGE, speed: CONSTANTS.ASTEROID_SPEED_LARGE, score: CONSTANTS.ASTEROID_SCORE_LARGE },
        [AsteroidSize.MEDIUM]: { diameter: CONSTANTS.ASTEROID_SIZE_MEDIUM, speed: CONSTANTS.ASTEROID_SPEED_MEDIUM, score: CONSTANTS.ASTEROID_SCORE_MEDIUM },
        [AsteroidSize.SMALL]: { diameter: CONSTANTS.ASTEROID_SIZE_SMALL, speed: CONSTANTS.ASTEROID_SPEED_SMALL, score: CONSTANTS.ASTEROID_SCORE_SMALL },
    }

    constructor(group: Phaser.Physics.Arcade.Group, x: number, y: number, size: AsteroidSize) {
        const diameter = Asteroid.AsteroidConfigMap[size].diameter;
        const speed = Asteroid.AsteroidConfigMap[size].speed;
        super(group.scene, x, y, diameter, diameter, 0x00ff00);

        this.size = size;

        group.scene.add.existing(this);
        group.add(this);

        this.setRotation(Phaser.Math.DegToRad(Phaser.Math.Between(0, 360)));
        physicsBody(this).setVelocity(Math.sin(this.rotation) * speed, Math.cos(this.rotation) * speed);
    }

    public getGeomCircle(): Phaser.Geom.Circle {
        return new Phaser.Geom.Circle(this.x, this.y, Asteroid.AsteroidConfigMap[this.size].diameter / 2);
    }
}
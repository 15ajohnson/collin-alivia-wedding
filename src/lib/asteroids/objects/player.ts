import { CONSTANTS } from "../constants";
import { physicsBody } from "../helpers";

export class Player extends Phaser.GameObjects.Triangle {

    // coordinates relative to center
    static initialGeomTriangle = new Phaser.Geom.Triangle(
        // left wing
        -CONSTANTS.PLAYER_LENGTH / 2,
        CONSTANTS.PLAYER_SPAN / 2,
        // nose
        CONSTANTS.PLAYER_LENGTH / 2,
        0,
        // right wing
        -CONSTANTS.PLAYER_LENGTH / 2,
        -CONSTANTS.PLAYER_SPAN / 2,
    );

    constructor(scene: Phaser.Scene, physics: Phaser.Physics.Arcade.ArcadePhysics, x: number, y: number) {
        // offset triangle so origin is at left wing
        const { x1, y1, x2, y2, x3, y3 } = Phaser.Geom.Triangle.Offset(
            Phaser.Geom.Triangle.Clone(Player.initialGeomTriangle),
            CONSTANTS.PLAYER_LENGTH / 2,
            CONSTANTS.PLAYER_SPAN / 2,
        );

        super(scene, x, y, x1, y1, x2, y2, x3, y3, 0x0000ff);

        scene.add.existing(this);
        physics.add.existing(this);
        physicsBody(this).setMaxSpeed(CONSTANTS.MOVEMENT_MAX_SPEED);
    }

    public getGeomTriangle(): Phaser.Geom.Triangle {
        return Phaser.Geom.Triangle.Rotate(
            Phaser.Geom.Triangle.Offset(
                Phaser.Geom.Triangle.Clone(Player.initialGeomTriangle),
                this.x,
                this.y
            ),
            this.rotation
        )
    }
}
import { Scene } from "phaser";

export interface Position {
    x: number;
    y: number;
}


export const physicsBody = (gameObject: Phaser.GameObjects.GameObject) => {
    if (gameObject.body) {
        return gameObject.body as Phaser.Physics.Arcade.Body;
    } else {
        throw new Error("GameObject does not have a body");
    }
}

export const randomOutsidePosition = (scene: Scene): Position => {
    const thirdWidth = scene.scale.width / 3;
    const thirdHeight = scene.scale.height / 3;

    // Randomly choose between left third (0), right third (1), top third (2), or bottom third (3)
    const region = Phaser.Math.Between(0, 3);

    if (region === 0) {
        return {
            x: Phaser.Math.Between(0, thirdWidth),
            y: Phaser.Math.Between(0, scene.scale.height)
        };
    } else if (region === 1) {
        return {
            x: Phaser.Math.Between(thirdWidth * 2, scene.scale.width),
            y: Phaser.Math.Between(0, scene.scale.height)
        };
    } else if (region === 2) {
        return {
            x: Phaser.Math.Between(0, scene.scale.width),
            y: Phaser.Math.Between(0, thirdHeight)
        };
    } else {
        return {
            x: Phaser.Math.Between(0, scene.scale.width),
            y: Phaser.Math.Between(thirdHeight * 2, scene.scale.height)
        };
    }
}
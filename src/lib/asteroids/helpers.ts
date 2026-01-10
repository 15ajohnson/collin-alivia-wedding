
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

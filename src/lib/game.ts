
import { Game, Scene } from "phaser";

class MyScene extends Scene {
    constructor() {
        super({ key: 'MyScene' });
    }

    preload() { }

    create() {
        this.add.text(100, 100, 'Hello Phaser!', { font: '32px Arial' });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
        MyScene
    ]
};

export default class MyGame extends Game {
    constructor() {
        super(config);
    }
}
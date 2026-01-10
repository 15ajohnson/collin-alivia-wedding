
import { Scene } from "phaser";

export class Start extends Scene {
    constructor() {
        super({ key: 'start' });
    }

    // asset load
    preload() { }

    // scene setup
    create() {
        const startText = this.add.text(400, 300, 'Click to Start', { font: '32px Arial', color: '#ffffff' });
        startText.setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('the-game');
        });
    }

    // game loop
    update() { }
}
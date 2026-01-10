import { Scene } from "phaser";

export interface EndData {
    finalScore: number;
}

export class End extends Scene {

    constructor() {
        super({ key: 'end' });
    }

    // asset load
    preload() { }

    // scene setup
    create(data: EndData) {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 2, `Game Over`, { font: '48px Arial', color: '#ff0000' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2 + 60, `Final Score: ${data.finalScore}`, { font: '24px Arial', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2 + 100, 'Press SPACE to Restart', { font: '24px Arial', color: '#ffffff' }).setOrigin(0.5);

        this.input.keyboard!.once('keydown-SPACE', () => {
            this.scene.start('the-game');
        });
    }

    // game loop
    update() { }
}
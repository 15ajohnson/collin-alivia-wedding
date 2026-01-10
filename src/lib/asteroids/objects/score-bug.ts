
export class ScoreBug extends Phaser.GameObjects.Text {
    score: number;

    static text(score: number) {
        return `Score: ${score}`;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, score: number) {
        super(scene, x, y, ScoreBug.text(score), { font: '24px Arial', color: '#ffffff' });
        scene.add.existing(this);
        this.score = score;
    }

    addToScore(amount: number) {
        this.score += amount;
        this.setText(ScoreBug.text(this.score));
    }
}
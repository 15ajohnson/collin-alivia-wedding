
import { Game } from "phaser";
import { TheGame } from "./scenes/the-game";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    scene: [
        TheGame
    ]
};

export default class MyGame extends Game {
    constructor() {
        super(config);
    }
}

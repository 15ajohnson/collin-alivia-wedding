
import { Game } from "phaser";
import { TheGame } from "./scenes/the-game";
import { Start } from "./scenes/start";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    scene: [
        Start,
        TheGame
    ]
};

export default class MyGame extends Game {
    constructor() {
        super(config);
    }
}

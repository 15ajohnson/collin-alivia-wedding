
import { Game } from "phaser";
import { TheGame } from "./scenes/the-game";
import { Start } from "./scenes/start";
import { End } from "./scenes/end";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    scene: [
        Start,
        TheGame,
        End
    ]
};

export default class MyGame extends Game {
    constructor() {
        super(config);
    }
}

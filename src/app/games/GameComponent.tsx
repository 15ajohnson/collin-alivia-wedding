import MyGame from "@/lib/game";
import { Game } from "phaser";
import { useLayoutEffect, useRef } from "react";

export default function GameComponent() {
    const ref = useRef<Game | null>(null);

    useLayoutEffect(() => {
        // Only create the game if it hasn't been created yet
        if (ref.current) {
            return;
        }

        const game = new MyGame();
        ref.current = game;

        return () => {
            if (ref.current) {
                ref.current.destroy(true);
                ref.current = null;
            }
        };
    }, []);

    return (
        <div>coming soon</div>
    )
}
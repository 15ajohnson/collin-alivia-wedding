"use client";

import dynamic from 'next/dynamic';

const GameComponent = dynamic(
    () => import('./GameComponent'),
    { ssr: false } // the prerendering wasn't working well with phaser
)

export default function GamesPage() {
    return (
        <GameComponent />
    );
}
import Phaser from 'phaser';
import GameScene from './GameScene';
import TitleScene from "./TitleScene";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#0',
    parent: 'phaser-example',
    antialias: false,
};

let game = new Phaser.Game(config);

game.scene.add('game', GameScene);
game.scene.add('title', TitleScene)

game.scene.start('title');
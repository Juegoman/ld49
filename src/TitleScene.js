import titleImage from './assets/titlescreen.png';
import song from "./assets/song.mp3";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'title' });
    }
    preload() {
        this.load.spritesheet('title', titleImage, { frameWidth: 800, frameHeight: 600 });
        this.load.audio('song', song);
    }
    create() {
        this.sound.play('song', { volume: 0.5, loop: true });
        const splash = this.add.sprite(0, 0, 'title', 0);
        splash.setOrigin(0,0);
        this.anims.create({
            key: 'titlescreen',
            frames: this.anims.generateFrameNumbers('title', { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 3,
            repeat: 1
        })
        splash.play('titlescreen')
        this.input.keyboard.on('keydown', () => {
            this.scene.switch('game');
        })
    }
}
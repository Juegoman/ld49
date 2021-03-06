import characterImage from './assets/dude.png';
import zapperImage from './assets/zapper.png';
import sparkImage from './assets/spark.png';
import terrainImage from './assets/terrain.png';
import titleImage from './assets/titlescreen.png';
import gameOverImage from './assets/gameovertext.png';

import rumble from './assets/rumble.wav';
import zap from './assets/zap.wav';
import boom from './assets/boom.wav';
import strike from './assets/strike.wav';
import jet from './assets/jet.wav';
import song from './assets/song.mp3';

import World from './World';
import Player from './Player';
import UI from './UI';
import Enemy from './Enemy';
import Hitspark from './Hitspark';

export default class GameScene extends Phaser.Scene {
    constructor () {
        super({ key: 'game' });
        this.gameModules = {
            world: null,
            player: null,
            UI: null,
            enemy: null,
            hitspark: null,
        }
        this.deathScreen = null;
        this.deathTextImage = null;
        this.frameTime = 0;
    }

    preload () {
        this.load.image('terrain', terrainImage);
        this.load.image('gameover', gameOverImage);
        this.load.audio('rumble', rumble);
        this.load.audio('zap', zap);
        this.load.audio('boom', boom);
        this.load.audio('strike', strike);
        this.load.audio('jet', jet);
        this.load.audio('song', song);
        this.load.spritesheet('character', characterImage, { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('zapper', zapperImage, { frameWidth: 125, frameHeight: 100 });
        this.load.spritesheet('spark', sparkImage, { frameWidth: 30, frameHeight: 30 });
        this.load.spritesheet('title', titleImage, { frameWidth: 800, frameHeight: 600 });
    }

    create () {
        this.gameModules.UI = new UI(this.gameModules, this);
        this.gameModules.player = new Player(this.gameModules, this);
        this.gameModules.enemy = new Enemy(this.gameModules, this);
        this.gameModules.world = new World(this.gameModules, this);
        this.gameModules.hitspark = new Hitspark(this.gameModules, this);

        this.sound.stopAll();
        this.sound.play('song', { volume: 0.5, loop: true });
        
        this.sys.canvas.addEventListener('click', () => {
          if (this.sys.isPaused())  {
            this.sys.resume();
            this.sound.play('song', { volume: 0.5, loop: true });
          }
        });
        document.addEventListener('keypress', () => {
            if (!this.gameModules.player.alive) {
                this.sound.stopAll();
                this.scene.restart();
            }
        })
        this.anims.create({
            key: 'titlescreen',
            frames: this.anims.generateFrameNumbers('title', { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 3,
            repeat: -1
        })
        this.deathScreen = this.add.sprite(400, 300, 'title', 0).setVisible(false).setDepth(10);
        this.deathTextImage = this.add.image(400, 300, 'gameover').setVisible(false).setDepth(11);
        this.gameModules.UI.mainCameraIgnore([this.deathScreen, this.deathTextImage]);
    }

    update (time, delta) {
        this.frameTime += delta;
        if (this.frameTime > 16.5) {
            this.frameTime = 0;
            this.gameModules.world.update();
            this.gameModules.player.update();
            this.gameModules.enemy.update();
            this.gameModules.hitspark.update();
            this.gameModules.UI.update();
        }
        if (this.input.mousePointer.primaryDown) {
          if (!(this.input.mousePointer.x <= 800 &&
            this.input.mousePointer.x >= 0 &&
            this.input.mousePointer.y <= 600 &&
            this.input.mousePointer.y >= 0)) {
            this.sys.pause();
            this.sound.stopAll();
          }
        }
        if (!this.gameModules.player.alive && !this.deathScreen.visible) {
            this.deathScreen.setVisible(true);
            this.deathTextImage.setVisible(true);
            this.deathScreen.play('titlescreen');
        }
    }
}
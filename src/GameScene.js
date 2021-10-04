import grassImage from './assets/grass.png';
import sandImage from './assets/sand.png';
import stoneImage from './assets/stone.png';
import characterImage from './assets/dude.png';
import barrelImage from './assets/barrel.png';
import shatteringImage from './assets/shattering.png';
import zapperImage from './assets/zapper.png';
import sparkImage from './assets/spark.png';
import duderunImage from './assets/duderun.png'

import rumble from './assets/rumble.wav';

import World from './World';
import Player from './Player';
import UI from './UI';
import Enemy from './Enemy';
import Weapon from './Weapon';
import Hitspark from './Hitspark';

export default class GameScene extends Phaser.Scene {
    constructor () {
        super({ key: 'game' });
        this.gameModules = {
            world: null,
            player: null,
            UI: null,
            weapon: null,
            enemy: null,
            hitspark: null,
        }
    }

    preload () {
        this.load.image('sand', sandImage);
        this.load.image('stone', stoneImage);
        this.load.image('grass', grassImage);
        this.load.image('barrel', barrelImage);
        this.load.image('shattering', shatteringImage);
        this.load.audio('rumble', rumble);
        this.load.spritesheet('character', characterImage, { frameWidth: 125, frameHeight: 100 });
        this.load.spritesheet('duderun', duderunImage, { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('zapper', zapperImage, { frameWidth: 125, frameHeight: 100 });
        this.load.spritesheet('spark', sparkImage, { frameWidth: 30, frameHeight: 30 });
    }

    create () {
        this.anims.create({
            key: 'runtest',
            frames: this.anims.generateFrameNumbers('duderun', { frames: [0, 1, 2, 3, 4, 5, 6] }),
            frameRate: 10,
            repeat: -1,
        })
        this.add.sprite(0,0, 'duderun', 0).play('runtest')
        this.gameModules.UI = new UI(this.gameModules, this);
        this.gameModules.player = new Player(this.gameModules, this);
        this.gameModules.weapon = new Weapon(this.gameModules, this);
        this.gameModules.enemy = new Enemy(this.gameModules, this);
        this.gameModules.world = new World(this.gameModules, this);
        this.gameModules.hitspark = new Hitspark(this.gameModules, this);
        this.sys.canvas.addEventListener('click', () => {
          if (this.sys.isPaused())  {
            this.sys.resume();
            // this.sound.play('song', { volume: 0.5, loop: true });
          }
        });
        document.addEventListener('keypress', () => {
            if (!this.gameModules.player.alive) {
                this.gameModules.UI.cleanUpDeathText();
                this.sound.stopAll();
                this.scene.restart();
            }
        })
    }

    update () {
        this.gameModules.world.update();
        this.gameModules.player.update();
        if (this.input.mousePointer.primaryDown) {
          if (!(this.input.mousePointer.x <= 800 &&
            this.input.mousePointer.x >= 0 &&
            this.input.mousePointer.y <= 600 &&
            this.input.mousePointer.y >= 0)) {
            this.sys.pause();
            this.sound.stopAll();
          }
        }
        this.gameModules.weapon.update();
        this.gameModules.enemy.update();
        this.gameModules.hitspark.update();
        this.gameModules.UI.update();
    }
}
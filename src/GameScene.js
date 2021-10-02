import grassImage from './assets/grass.png';
import sandImage from './assets/sand.png';
import stoneImage from './assets/stone.png';
import characterImage from './assets/dude.png';
import barrelImage from './assets/barrel.png';

import World from './World';
import Player from './Player';

export default class GameScene extends Phaser.Scene {
    constructor () {
        super({ key: 'game' });
        this.gameModules = {
            world: null,
            player: null,
            // weapon: null,
            // enemy: null,
            // hitspark: null,
        }
    }

    preload () {
        this.load.image('sand', sandImage);
        this.load.image('stone', stoneImage);
        this.load.image('grass', grassImage);
        this.load.image('barrel', barrelImage);
        this.load.spritesheet('character', characterImage, { frameWidth: 125, frameHeight: 100 });
    }

    create () {
        this.gameModules.world = new World(this.gameModules, this);
        this.gameModules.player = new Player(this.gameModules, this);
        // this.gameModules.weapon = new Weapon(this.gameModules, this);
        // this.gameModules.enemy = new Enemy(this.gameModules, this);
        // this.gameModules.hitspark = new hitspark(this.gameModules, this);
    }

    update () {
        this.gameModules.world.update();
        this.gameModules.player.update();
        // if (this.input.mousePointer.primaryDown) {
        //   if (this.input.mousePointer.x <= 800 &&
        //     this.input.mousePointer.x >= 0 &&
        //     this.input.mousePointer.y <= 600 &&
        //     this.input.mousePointer.y >= 0) {
        //     this.gameModules.weapon.attack(this.input.mousePointer.x, this.input.mousePointer.y);
        //   } else if (!this.sys.isPaused()) {
        //     this.sys.pause();
        //     this.sound.stopAll();
        //   }
        // }
        // this.gameModules.weapon.update();
        // this.gameModules.enemy.update();
        // this.gameModules.hitspark.update();
    }
}
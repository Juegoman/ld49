import Phaser from 'phaser';
import GameModule from './GameModule';

export default class World extends GameModule {
    constructor(gameModules, scene) {
        super(gameModules);
        this.scene = scene;
    }
    update() {
        
    }
}
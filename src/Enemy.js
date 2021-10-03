import Phaser from 'phaser';
import GameModule from './GameModule';
import Zapper from './Zapper';

export default class Enemy extends GameModule {
    constructor(gameModules, scene) {
        super(gameModules);
        this.scene = scene;
        this.enemyList = [];
        this.zappers = [...(new Array(20)).keys()]
            .map((_,v) => new Zapper(v, this));
    }
    update() { 

    }
}
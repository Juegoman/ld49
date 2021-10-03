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
        
        scene.anims.create({
            key: 'zapper',
            frames: scene.anims.generateFrameNumbers('zapper', { frames: [6, 7, 8, 9, 10, 11] }),
            frameRate: 4,
            repeat: -1,
        });
        scene.anims.create({
            key: 'zapperdeath',
            frames: scene.anims.generateFrameNumbers('zapper', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 4,
            repeat: 0,
        });
    }
    update() { 
        const cleanup = [];
        this.enemyList.forEach(e => {
            if (e.update()) cleanup.push(e.id);
        })
        cleanup.forEach(id => {
            const index = this.enemyList.findIndex(e => e.id === id);
            this.enemyList[index].activate(false)
            switch (this.enemyList[index].TYPE) {
                case 'zapper': 
                    this.zappers.push(this.enemyList.splice(index, 1));
                    break;
                default:
            }
        });
    }
}
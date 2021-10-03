import Phaser from 'phaser';
import GameModule from './GameModule';
import getRndInteger from './getRndInteger';
import Zapper from './Zapper';
import { getCoordinates } from './worldUtils';

export default class Enemy extends GameModule {
    constructor(gameModules, scene) {
        super(gameModules);
        this.scene = scene;
        this.enemyList = [];
        this.zappers = [...(new Array(100)).keys()]
            .map((_,v) => new Zapper(v, this));
        gameModules.UI.uiCameraIgnore(this.zappers.map(z => z.sprite));
        
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
                    this.zappers.push(...this.enemyList.splice(index, 1));
                    break;
                default:
            }
        });
    }
    populate(gridCoords) {
        let rng = getRndInteger(2, 4);
        if (this.world && this.world.unstableCycles > 5) {
            rng = getRndInteger(3, 5);
        }
        if (this.world && this.world.unstableCycles > 10) {
            rng = getRndInteger(4, 5 + Math.floor(this.world.unstableCycles / 5));
        }
        const coords = getCoordinates(gridCoords);
        const wBound = coords.x - 250;
        const eBound = coords.x + 250;
        const nBound = coords.y - 175;
        const sBound = coords.y + 175;
        let zapper;
        while (rng) {
            zapper = this.zappers.pop();
            zapper.spawn({ x: getRndInteger(wBound, eBound), y: getRndInteger(nBound, sBound) });
            this.enemyList.push(zapper);
            rng--;
        }
    }
}
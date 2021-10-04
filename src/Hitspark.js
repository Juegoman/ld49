import GameModule from "./GameModule";
import getRndInteger from "./getRndInteger";

export default class HitsparkManager extends GameModule {
    constructor(gameModules, scene) {
        super(gameModules);
        this.scene = scene;
        this.pool = [...(new Array(200)).keys()]
            .map((_, v) => new Hitspark(v, scene));
        this.UI.uiCameraIgnore(this.pool.map(h => h.sprite));
        this.activeHitsparks = [];
        scene.anims.create({
            key: 'spark1',
            frames: scene.anims.generateFrameNumbers('spark', { frames: [0, 4, 2, 1, 5, 3] }),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true,
        })
        scene.anims.create({
            key: 'spark2',
            frames: scene.anims.generateFrameNumbers('spark', { frames: [0, 3, 2, 4, 5, 1] }),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true,
        })
        scene.anims.create({
            key: 'spark3',
            frames: scene.anims.generateFrameNumbers('spark', { frames: [1, 6, 4, 2, 3, 0] }),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true,
        })
    }
    update() {
        const cleanup = []
        this.activeHitsparks.forEach(h => {
            if (!h.active) cleanup.push(h.id);
        })
        cleanup.forEach(id => {
            const index = this.activeHitsparks.findIndex(h => h.id === id);
            this.activeHitsparks[index].sprite.setVisible(false);
            this.pool.push(...this.activeHitsparks.splice(index, 1));
        })
    }
    spawn(x, y) {
        this.activeHitsparks.push(this.pool.pop().spawn(x, y));
    }
}

export class Hitspark {
    constructor(id, scene) {
        this.scene = scene
        this.id = id;
        this.sprite = scene.add.sprite(0, 0, 'spark', 0).setVisible(false);
    }
    spawn(x, y) {
        this.sprite.setPosition(x, y);
        const rng = getRndInteger(1, 3);
        this.sprite.play(`spark${rng}`);
        this.sprite.setVisible(true);
        return this;
    }
    get active() {
        return this.sprite.anims.isPlaying;
    }
}

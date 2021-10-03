import Phaser from 'phaser';
import EnemyBase from './EnemyBase';

export default class Zapper extends EnemyBase {
    constructor(id, parent) {
        const sprite = parent.scene.add.sprite(0, 0, 'zapper', 0);
        super(`z${id}`, sprite, parent, 'zapper');
        this.health = 1;
    }
    spawn(gridCoords) {
        this.randomizeLocation(gridCoords);
        this.activate()
        return this;
    }
    randomizeLocation(gridCoords) {

    }
    hit() {

    }
    get alive() {
      return this.health > 0;
    }
    activate() {

    }
    update() {

    }
}
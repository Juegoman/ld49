import Phaser from 'phaser';
import EnemyBase from './EnemyBase';

export default class Zapper extends EnemyBase {
    constructor(id, parent) {
        const sprite = parent.scene.add.sprite(0, 0, 'zapper', 0);
        super(`z${id}`, sprite, parent, 'zapper');
        this.health = 1;
        this.speed = 1;
        this.sleepTimer = 
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
    get active() {
        return this.sprite.visible && this.player.alive;
    }
    activate() {

    }
    update() {
        if (!this.active) return true;
        // tick sleep timer
        // if sleep timer is zero:
        // is player in vision radius
        // if yes then move towards player at speed
        // if player in hurt radius then call this.player.hit()
        //
        // finally after doing ai logic reset sleep timer
    }
}
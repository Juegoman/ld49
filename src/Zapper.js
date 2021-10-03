import Phaser from 'phaser';
import EnemyBase from './EnemyBase';
import { getGridCoordinates } from './worldUtils';

export default class Zapper extends EnemyBase {
    constructor(id, parent) {
        const sprite = parent.scene.add.sprite(0, 0, 'zapper', 0);
        super(`z${id}`, sprite, parent, 'zapper');
        this.health = 1;
        this.speed = 3;
        this.sleepTimer = 15;
        this.vision = 250;
        this.hurtbox = 50;
    }
    spawn({x, y}) {
        this.sprite.setPosition(x, y);
        this.activate()
        return this;
    }
    hit() {

    }
    get alive() {
      return this.health > 0;
    }
    get active() {
        return this.sprite.visible && this.player.alive;
    }
    get world() {
        return this.parent.world;
    }
    activate() {
        this.health = 1;
        this.sprite.setVisible(true);
        this.sprite.setActive(true);
        this.sprite.play('zapper')
    }
    update() {
        if (!this.currentTile) {
            console.log('poof')
            this.health = 0;
            this.sprite.setVisible(false);
            this.sprite.setActive(false);
            this.sprite.setPosition(99999,99999);
            this.sprite.stop()
            return true;
        }
        if (this.alive) {
            // tick sleep timer
            this.sleepTimer -= 1;
            // if sleep timer is zero:
            if (this.sleepTimer === 0) {
                // is player in vision radius
                const full = { x: this.player.x - this.x, y: this.player.y - this.y };
                const distance = Math.sqrt(full.x**2 + full.y**2);
                if (distance < this.vision) {
                    // if yes then move towards player at speed
                    const direction = { x: full.x / distance, y: full.y / distance };
                    const newPos = {x: this.x + (direction.x * this.speed), y: this.y + (direction.y * this.speed)}
                    this.sprite.setPosition(newPos.x, newPos.y);
                    // if player in hurt radius then call this.player.hit()
                    const newPosDist = Math.sqrt((this.player.x - newPos.x)**2 + (this.player.y - newPos.y)**2);
                    if (newPosDist < this.hurtbox) {
                        this.player.hit(direction);
                    }
                }
                // finally after doing ai logic reset sleep timer
                this.sleepTimer = 15;
            }
        }
        return false;
    }

    get currentTile() {
        const tile = this.world.getTile(getGridCoordinates({x: this.sprite.x, y: this.sprite.y + 30}));
        return tile || null;
    }

}
import Phaser from 'phaser';
import EnemyBase from './EnemyBase';
import getRndInteger from './getRndInteger';
import { getGridCoordinates } from './worldUtils';

const getRndPlsMns = num => ((getRndInteger(0, 1)) ? -1 : 1) * getRndInteger(0, num);

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
    spawn({x, y}, angry = false) {
        this.sprite.setPosition(x, y);
        this.activate(true, angry);
        return this;
    }
    hit() {
        this.health = 0;
        this.sprite.setDepth(-1)
        this.sprite.setFlipX(!getRndInteger(0, 1))
        this.sprite.play('zapperdeath');
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
    get angry() {
        return this.world && this.world.unstableCycles > 0;
    }
    activate(value = true, angry = false) {
        this.sleepTimer = 15;
        this.sprite.setVisible(value);
        this.sprite.setActive(value);
        this.sprite.setDepth(1);
        if (value) {
            const rng = getRndInteger(1, 3);
            this.health = 1;
            if (this.angry) {
                this.vision = 400;
                this.speed = 14;
                this.sprite.play({key: `zapper${rng}`, frameRate: 12});
            } else {
                this.sprite.play(`zapper${rng}`);
            }
        }
    }
    update() {
        if (!this.currentTile) {
            this.health = 0;
            this.sprite.setVisible(false);
            this.sprite.setActive(false);
            this.sprite.setPosition(99999,99999);
            this.sprite.stop()
            return true;
        }
        if (this.active) {
            // tick sleep timer
            this.sleepTimer -= 1;
            // if sleep timer is zero:
            if (this.sleepTimer === 0) {
                if (this.alive) {
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
                            if (this.player.actuallyBoosting) {
                                this.hit();
                            } else {
                                // get midpoint between player and self, then spawn 3 sparks with variance
                                const midpoint = { x: newPos.x + (direction.x * (newPosDist / 2)), y: newPos.y + (direction.y * (newPosDist / 2))};
                                let count = 5;
                                while (count) {
                                    this.hitspark.spawn(midpoint.x + getRndPlsMns(20), midpoint.y + getRndPlsMns(20));
                                    count -= 1;
                                }
                                this.player.hit(direction);
                            }
                        }
                    }
                    // finally after doing ai logic reset sleep timer
                    this.sleepTimer = 15;
                } else {
                    let count = 5;
                    while (count) {
                        this.hitspark.spawn(this.x + getRndPlsMns(20), this.y + getRndPlsMns(20));
                        count -= 1;
                    }
                    // finally after doing ai logic reset sleep timer
                    this.sleepTimer = 50;
                }
            }
        } else {

        }
        return false;
    }

    get currentTile() {
        const tile = this.world.getTile(getGridCoordinates({x: this.sprite.x, y: this.sprite.y + 30}));
        return tile || null;
    }

}
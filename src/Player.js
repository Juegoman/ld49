import Phaser from 'phaser';
import GameModule from './GameModule';
import { getGridCoordinates } from './worldUtils';

const direction_offset = {
    E: 0,
    NE: 1,
    N: 2,
    NW: 3,
    W: 4,
    SW: 5,
    S: 6,
    SE: 7,
};
const frame_offset = {
    IDLE: [0, 1],
    BOOST: [2, 3],
    RUN: [4, 5, 6, 7, 8, 9],
};
const anim_framerate = {
    IDLE: 4,
    BOOST: 8,
    RUN: 10,
}

const RUMBLETIME = 50;

export default class Player extends GameModule {
    constructor(gameModules, scene) {
        super(gameModules);
        this.scene = scene;
        this.sprite = scene.add.sprite(400, 300, 'character', 0).setDepth(1);
        this.UI.uiCameraIgnore(this.sprite);
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false,
            lastDir: 'S',
        };

        this.cursors = scene.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
        });
        this.cursors.up.on('down', () => { this.direction.up = true; });
        this.cursors.up.on('up', () => { this.direction.up = false; });
        this.cursors.down.on('down', () => { this.direction.down = true; });
        this.cursors.down.on('up', () => { this.direction.down = false; });
        this.cursors.left.on('down', () => { this.direction.left = true; });
        this.cursors.left.on('up', () => { this.direction.left = false; });
        this.cursors.right.on('down', () => { this.direction.right = true; });
        this.cursors.right.on('up', () => { this.direction.right = false; });
        this.cursors.space.on('down', () => { this.boosting = true; })
        this.cursors.space.on('up', () => { this.boosting = false; })

        this.speed = 2;
        this.rumbleTime = 15;
        this.stun = 0;
        this.knockbackDirection = { x: 0, y: 0 };
        this.knockbackSpeed = 2;
        this.boosting = false;
        this.MAXENERGY = 500;
        this.energy = 500;
        this.energyRate = 1;
        this.boostDrain = 5;
        this.boostSpeed = 4;
        
        const animConfigs = Object.entries(direction_offset)
            .flatMap(([dir, offset]) => Object.entries(frame_offset)
                .map(([anim, f_offset]) => ({
                    key: `${dir}_${anim}`,
                    frames: scene.anims.generateFrameNumbers('character', { frames: f_offset.map(o => o + (10 * offset)) }),
                    frameRate: anim_framerate[anim],
                    repeat: -1,
                })
            ));
        animConfigs.forEach(c => { scene.anims.create(c); });
        this.sprite.play('S_IDLE');
        
        scene.cameras.main.startFollow(this.sprite, false, 0.5, 0.5);
        
        this.alive = true;
    }

    update() {
        if (this.alive) {
            if (!this.currentTile) {
                this.alive = false;
                this.sprite.setVisible(false);
            }
    
            if (this.stun) {
                this.setStunPosition();
                this.stun -= 1;
            } else {
                this.setDirection();
                if (this.boosting && (this.direction.up || this.direction.down || this.direction.left || this.direction.right)) {
                    this.energy -= (this.energy < this.energyRate) ? this.energy : this.boostDrain;
                    this.setPosition(this.actuallyBoosting);
                } else {
                    this.setPosition(false);
                }
            }

            this.energy = (this.energy === this.MAXENERGY) ? this.MAXENERGY : this.energy + this.energyRate
    
            if (this.currentTile && this.currentTile.toBeCulled) {
                this.scene.cameras.main.shake(10);
                if (this.rumbleTime === RUMBLETIME) {
                    this.scene.sound.play('rumble', { volume: 0.25 });
                    this.rumbleTime = 0;
                } else {
                    this.rumbleTime += 1;
                }
            }
        }
    }

    get currentTile() {
        const tile = this.world.getTile(getGridCoordinates({x: this.sprite.x, y: this.sprite.y + 50}));
        return tile || null;
    }
    get x() {
        return this.sprite.x
    }
    get y() {
        return this.sprite.y
    }
    get actuallyBoosting() {
        return this.boosting && this.energy >= this.boostDrain * 10;
    }
    hit(direction) {
        this.stun = 50;
        this.knockbackDirection = direction;
    }
    setStunPosition() {
        const { x, y } = this.sprite;
        this.sprite.setPosition(x + (this.knockbackDirection.x * this.knockbackSpeed), y + this.knockbackDirection.y * this.knockbackSpeed);
    }
    setPosition(boosting) {
        const { x, y } = this.sprite;
        let dx = 0;
        let dy = 0;
        const speed = (boosting) ? this.boostSpeed : this.speed;
        dx += this.direction.left ? -1 * speed : 0;
        dx += this.direction.right ? speed : 0;
        dy += this.direction.up ? -1 * speed : 0;
        dy += this.direction.down ? speed: 0;
        const canMove = this.world.getTile(getGridCoordinates({x: x + dx, y: y + dy + 50})) !== undefined;
        if (canMove) {
            this.sprite.setPosition(x + dx, y + dy);
        }
        if (this.actuallyBoosting) {
            this.scene.sound.play('jet', { volume: 0.15 })
        }
        if (boosting && canMove && this.sprite.anims.currentAnim && this.sprite.anims.currentAnim.key !== `${this.direction.lastDir}_BOOST`) {
            this.sprite.play(`${this.direction.lastDir}_BOOST`);
        } else if (!boosting && canMove && (dx || dy) && this.sprite.anims.currentAnim && this.sprite.anims.currentAnim.key !== `${this.direction.lastDir}_RUN`) {
            this.sprite.play(`${this.direction.lastDir}_RUN`);
        } else if (this.sprite.anims.currentAnim && this.sprite.anims.currentAnim.key !== `${this.direction.lastDir}_IDLE` && !(dx || dy)) {
            this.sprite.play(`${this.direction.lastDir}_IDLE`);
        }

    }

    setDirection() {    
        let dir = '';
        dir += this.direction.up ? 'N' : this.direction.down ? 'S' : '';
        dir += this.direction.left ? 'W' : this.direction.right ? 'E' : '';
        if (!dir) {
            dir = this.direction.lastDir;
        }
    
        // this.sprite.setFlipX(dir.indexOf('W') !== -1);
        // switch (dir) {
        //     case 'N':
        //         this.sprite.play('N');
        //         break;
        //     case 'NE':
        //     case 'NW':
        //         this.sprite.play('NE');
        //         break;
        //     case 'W':
        //     case 'E':
        //         this.sprite.play('E');
        //         break;
        //     case 'SW':
        //     case 'SE':
        //         this.sprite.play('SE');
        //         break;
        //     case 'S':
        //         this.sprite.play('S');
        //     default:
        //         break;
        // }
        this.direction.lastDir = dir;
    }
}
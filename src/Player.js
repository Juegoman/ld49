import Phaser from 'phaser';
import GameModule from './GameModule';
import { getGridCoordinates } from './worldUtils';

const FRAMES = {
    N: 0,
    S: 1,
    E: 2,
    NE: 3,
    SE: 4,
};

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
        
        scene.anims.create({
            key: 'N',
            frames: scene.anims.generateFrameNumbers('character', {frames: [0]}),
            frameRate: 1,
            repeat: -1,
        });
        scene.anims.create({
            key: 'S',
            frames: scene.anims.generateFrameNumbers('character', {frames: [1]}),
            frameRate: 1,
            repeat: -1,
        });
        scene.anims.create({
            key: 'E',
            frames: scene.anims.generateFrameNumbers('character', {frames: [2]}),
            frameRate: 1,
            repeat: -1,
        });
        scene.anims.create({
            key: 'NE',
            frames: scene.anims.generateFrameNumbers('character', {frames: [3]}),
            frameRate: 1,
            repeat: -1,
        });
        scene.anims.create({
            key: 'SE',
            frames: scene.anims.generateFrameNumbers('character', {frames: [4]}),
            frameRate: 1,
            repeat: -1,
        });
        this.sprite.play('S');
        
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
        const tile = this.world.getTile(getGridCoordinates({x: this.sprite.x, y: this.sprite.y + 30}));
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
        if (this.world.getTile(getGridCoordinates({x: x + dx, y: y + dy + 30})) !== undefined) {
            this.sprite.setPosition(x + dx, y + dy);
        }
    }

    setDirection() {    
        let dir = '';
        dir += this.direction.up ? 'N' : this.direction.down ? 'S' : '';
        dir += this.direction.left ? 'W' : this.direction.right ? 'E' : '';
        if (!dir) {
            dir = this.direction.lastDir;
        }
    
        this.sprite.setFlipX(dir.indexOf('W') !== -1);
        switch (dir) {
            case 'N':
                this.sprite.play('N');
                break;
            case 'NE':
            case 'NW':
                this.sprite.play('NE');
                break;
            case 'W':
            case 'E':
                this.sprite.play('E');
                break;
            case 'SW':
            case 'SE':
                this.sprite.play('SE');
                break;
            case 'S':
                this.sprite.play('S');
            default:
                break;
        }
        this.direction.lastDir = dir;
    }
}
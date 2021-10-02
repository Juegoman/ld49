import Phaser from 'phaser';
import GameModule from './GameModule';

const FRAMES = {
    N: 0,
    S: 1,
    E: 2,
    NE: 3,
    SE: 4,
};

export default class Player extends GameModule {
    constructor(gameModules, scene) {
        super(gameModules);
        this.scene = scene;
        this.sprite = scene.add.sprite(400, 300, 'character', 0);
        this.UI.uiCameraIgnore(this.sprite);
        this.cursors = scene.input.keyboard.addKeys({
          'up': Phaser.Input.Keyboard.KeyCodes.W,
          'down': Phaser.Input.Keyboard.KeyCodes.S,
          'left': Phaser.Input.Keyboard.KeyCodes.A,
          'right': Phaser.Input.Keyboard.KeyCodes.D
        });
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false,
            lastDir: 'S',
        };
        this.speed = 3

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

    }

    update() {
        this.setDirection();
        this.setPosition();
    }

    setPosition() {
        const { x, y } = this.sprite;
        let dx = 0;
        let dy = 0;
        dx += this.direction.left ? -1 * this.speed : 0;
        dx += this.direction.right ? this.speed : 0;
        dy += this.direction.up ? -1 * this.speed : 0;
        dy += this.direction.down ? this.speed: 0;
        this.sprite.setPosition(x + dx, y + dy);
    }

    setDirection() {
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false,
            lastDir: this.direction.lastDir,
        };
        if (this.cursors.up.isDown) {
            this.direction.up = true;
        } else if (this.cursors.down.isDown) {
            this.direction.down = true;
        }
        if (this.cursors.left.isDown) {
            this.direction.left = true;
        } else if (this.cursors.right.isDown) {
            this.direction.right = true;
        }
    
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
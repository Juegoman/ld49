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
        };
        this.speed = 3

        scene.anims.create({
            key: 'N',
            frames: scene.anims.generateFrameNumbers('character', {frames: [0]}),
            frameRate: 1,
            repeat: -1
        });
        scene.anims.create({
            key: 'S',
            frames: scene.anims.generateFrameNumbers('character', {frames: [1]}),
            frameRate: 1,
            repeat: -1
        });
        scene.anims.create({
            key: 'E',
            frames: scene.anims.generateFrameNumbers('character', {frames: [2]}),
            frameRate: 1,
            repeat: -1
        });
        scene.anims.create({
            key: 'NE',
            frames: scene.anims.generateFrameNumbers('character', {frames: [3]}),
            frameRate: 1,
            repeat: -1
        });
        scene.anims.create({
            key: 'SE',
            frames: scene.anims.generateFrameNumbers('character', {frames: [4]}),
            frameRate: 1,
            repeat: -1
        });
        this.sprite.play('S');
    }

    update() {
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false,
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

         if (this.direction.up) {
             if (this.direction.left) {
                // NW
                this.sprite.setPosition(this.sprite.x - this.speed, this.sprite.y - this.speed);
                this.sprite.play('NE');
                this.sprite.setFlipX(true);
             } else if (this.direction.right) {
                // NE
                this.sprite.setPosition(this.sprite.x + this.speed, this.sprite.y - this.speed);
                this.sprite.play('NE');
                this.sprite.setFlipX(false);
             } else {
                // N
                this.sprite.setPosition(this.sprite.x, this.sprite.y - this.speed);
                this.sprite.play('N');
                this.sprite.setFlipX(false);
             }
         } else if (this.direction.down) {
            if (this.direction.left) {
               // SW
               this.sprite.setPosition(this.sprite.x - this.speed, this.sprite.y + this.speed);
               this.sprite.play('SE');
               this.sprite.setFlipX(true);
            } else if (this.direction.right) {
               // SE
               this.sprite.setPosition(this.sprite.x + this.speed, this.sprite.y + this.speed);
               this.sprite.play('SE');
               this.sprite.setFlipX(false);
            } else {
               // S
               this.sprite.setPosition(this.sprite.x, this.sprite.y + this.speed);
               this.sprite.play('S');
               this.sprite.setFlipX(false);
            }
         } else {
            if (this.direction.left) {
                // W
                this.sprite.setPosition(this.sprite.x - this.speed, this.sprite.y);
                this.sprite.play('E');
                this.sprite.setFlipX(true);
             } else if (this.direction.right) {
                // E
                this.sprite.setPosition(this.sprite.x + this.speed, this.sprite.y);
                this.sprite.play('E');
                this.sprite.setFlipX(false);
             } else {
                // no movement
                // last direction
             }
         }
    }
}
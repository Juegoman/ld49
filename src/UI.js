import GameModule from "./GameModule";
import titleImage from './assets/titlescreen.png';

export default class UI extends GameModule {
    constructor(gameModule, scene) {
        super(gameModule);
        this.scene = scene;
        this.title = scene.add.sprite();
        this.uiCamera = scene.cameras.add();
        this.timerText = scene.add.text(630, 60, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.statusText = scene.add.text(630, 30, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.cycleText = scene.add.text(630, 90, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.scoreText = scene.add.text(30, 90, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.energyText = scene.add.text(30, 30, 'ENERGY', { font: '24px Courier', fill: '#FFFFFF' });
        this.energyBar = new Bar(scene, 120, 32);
        this.mainCameraIgnore([this.timerText, this.statusText, this.cycleText, this.energyBar.bar, this.scoreText, this.energyText]);
    }
    update() {
        const totalSecondsElapsed = Math.floor(this.world.cycleTick.elapsed / 1000);
        this.timerText.setText(`Next: ${4 - totalSecondsElapsed}`);
        this.statusText.setText(`${this.world.isUnstable ? 'UNSTABLE' : 'CALM'}`);
        this.cycleText.setText(`Cycle: ${this.world.unstableCycles}`);
        this.energyBar.set(Math.floor((this.player.energy / this.player.MAXENERGY) * 100));
        this.scoreText.setText(`Score: ${this.score}`);
    }
    uiCameraIgnore(obj) {
        this.uiCamera.ignore(obj);
    }
    mainCameraIgnore(obj) {
        this.scene.cameras.main.ignore(obj);
    }
    get score() {
        const cycles = (this.world) ? this.world.unstableCycles : 0
        return Math.floor(this.enemy.enemiesDestroyed) + (cycles * 10);
    }
}

class Bar {

    constructor (scene, x, y) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 76 / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    set(amount) {
        this.value = amount;

        if (this.value < 0) {
            this.value = 0;
        }

        this.draw();
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

        if (this.value < 20)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ffff);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}
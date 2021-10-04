import GameModule from "./GameModule";

export default class UI extends GameModule {
    constructor(gameModule, scene) {
        super(gameModule);
        this.scene = scene;
        
        this.uiCamera = scene.cameras.add();
        this.timerText = scene.add.text(30, 30, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.statusText = scene.add.text(30, 60, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.cycleText = scene.add.text(60, 30, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.scoreText = scene.add.text(30, 90, '', { font: '24px Courier', fill: '#FFFFFF' })
        this.energyBar = new Bar(scene, 100, 32);
        this.deathText = null;
        this.mainCameraIgnore([this.timerText, this.statusText, this.cycleText, this.energyBar.bar, this.scoreText]);
    }
    update() {
        const totalSecondsElapsed = Math.floor(this.world.cycleTick.elapsed / 1000);
        this.timerText.setText(4 - totalSecondsElapsed);
        this.statusText.setText(this.world.isUnstable ? 'UNSTABLE' : 'CALM');
        this.cycleText.setText(this.world.unstableCycles);
        this.energyBar.set(Math.floor((this.player.energy / this.player.MAXENERGY) * 100));
        this.scoreText.setText(`Score: ${this.score}`);
        
        if (!this.player.alive && this.deathText === null) {
            this.deathText = this.scene.add.text(180, 200, '', { backgroundColor: '#646161', font: '32px Arial', fill: '#f6451a', align: 'center', padding: { x: 20, y: 20 } });
            this.deathText.setText([
                'You Died',
                'Restart by pressing R',
            ]);
            this.mainCameraIgnore(this.deathText);
        }
    }
    uiCameraIgnore(obj) {
        this.uiCamera.ignore(obj);
    }
    mainCameraIgnore(obj) {
        this.scene.cameras.main.ignore(obj);
    }
    cleanUpDeathText() {
        this.deathText = null;
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
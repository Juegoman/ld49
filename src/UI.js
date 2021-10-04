import GameModule from "./GameModule";

export default class UI extends GameModule {
    constructor(gameModule, scene) {
        super(gameModule);
        this.scene = scene;
        
        this.uiCamera = scene.cameras.add();
        this.timerText = scene.add.text(30, 30, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.statusText = scene.add.text(30, 60, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.cycleText = scene.add.text(60, 30, '', { font: '24px Courier', fill: '#FFFFFF' });
        this.deathText = null;
        this.mainCameraIgnore([this.timerText, this.statusText, this.cycleText]);
    }
    update() {
        const totalSecondsElapsed = Math.floor(this.world.cycleTick.elapsed / 1000);
        this.timerText.setText(4 - totalSecondsElapsed);
        this.statusText.setText(this.world.isUnstable ? 'UNSTABLE' : 'CALM');
        this.cycleText.setText(this.world.unstableCycles);

        
        if (!this.player.alive && this.deathText === null) {
            this.deathText = this.scene.add.text(180, 200, '', { backgroundColor: '#646161', font: '32px Arial', fill: '#f6451a', align: 'center', padding: { x: 20, y: 20 } });
            this.deathText.setText([
                'You Died',
                'Restart by pressing space',
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
}
import GameModule from "./GameModule";

export default class UI extends GameModule {
    constructor(gameModule, scene) {
        super(gameModule);
        this.scene = scene;
        
        this.uiCamera = scene.cameras.add();
        this.timerText = scene.add.text(30, 30, '', { font: '24px Courier', fill: '#aaaaaa' });
        this.statusText = scene.add.text(30, 60, '', { font: '24px Courier', fill: '#aaaaaa' });
        this.mainCameraIgnore([this.timerText, this.statusText]);
    }
    update() {
        const totalSecondsElapsed = Math.floor(this.world.cycleTick.elapsed / 1000);
        this.timerText.setText(10 - totalSecondsElapsed);
        this.statusText.setText(this.world.isUnstable ? 'UNSTABLE' : 'CALM');
    }
    uiCameraIgnore(obj) {
        this.uiCamera.ignore(obj);
    }
    mainCameraIgnore(obj) {
        this.scene.cameras.main.ignore(obj);
    }
}
import GameModule from "./GameModule";

export default class UI extends GameModule {
    constructor(gameModule, scene) {
        super(gameModule);
        this.scene = scene;
        
        this.uiCamera = scene.cameras.add();
        this.timerText = scene.add.text(30, 30, '', { font: '24px Courier', fill: '#aaaaaa' });
        this.mainCameraIgnore(this.timerText);
    }
    update() {
        const totalSecondsElapsed = Math.floor(this.world.cycleTick.elapsed / 1000);
        const minutes = Math.floor(totalSecondsElapsed / 60)
        const seconds = totalSecondsElapsed % 60;
        this.timerText.setText((minutes) ? `${minutes}:${(seconds < 10) ? '0' : ''}${seconds}` : seconds);
    }
    uiCameraIgnore(obj) {
        this.uiCamera.ignore(obj);
    }
    mainCameraIgnore(obj) {
        this.scene.cameras.main.ignore(obj);
    }
}
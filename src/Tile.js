import getRndInteger from "./getRndInteger";

export default class Tile {
    constructor(world, { type }) {
        this.world = world;
        this.type = type;
        this.image = world.scene.add.image(0, 0, type).setActive(false).setVisible(false);
        this.mask = world.scene.make.image({ x: 0, y: 0, key: 'shattering', add: false });
        this.toBeCulled = false;
    }
    update() {
        if (this.toBeCulled && !this.image.mask) {
            console.log(this.image.mask)
            this.image.mask = new Phaser.Display.Masks.BitmapMask(this.world.scene, this.mask);
            this.mask.setPosition(this.image.x, this.image.y);
            this.mask.setFlip(getRndInteger(0, 1), getRndInteger(0, 1));
        } else if (!this.toBeCulled && this.image.mask) {
            this.image.mask = null;
            this.mask.setPosition(0, 0);
        }
    }
    activate(gridCoords) {
        this.image.setActive(true);
        this.image.setVisible(true);
        const {x, y} = this.world.getCoordinates(gridCoords);
        this.image.setPosition(x, y);
        return this;
    }
    preCull() {
        this.toBeCulled = true;
        return this;
    }
    cull() {
        this.toBeCulled = false;
        this.image.setActive(false);
        this.image.setVisible(false);
        this.image.setPosition(0, 0);
        return this;
    }
    contains({x, y}) {
        const wBound = this.image.x - 300;
        const eBound = this.image.x + 300;
        const nBound = this.image.y - 200;
        const sBound = this.image.y + 200;
        return wBound < x && x < eBound &&
            nBound < y && y < sBound;
    }
    get x() {
        return this.image.x;
    }
    get y() {
        return this.image.y;
    }
}
import getRndInteger from "./getRndInteger";
import { getCoordinates } from "./worldUtils";

const TINTS = {
    green: 0x00ff00,
    grey: 0xaaaaaa,
    yellow: 0xffff00,
    red: 0xff0000,
}
export default class Tile {
    constructor(world, { type }) {
        this.world = world;
        this.type = type;
        this.image = world.scene.add.image(0, 0, 'terrain')
            .setActive(false)
            .setVisible(false)
            .setDepth(-2)
            .setTint(TINTS[type]);
        this.toBeCulled = false;
        this.flashTimer = 0;
    }
    update() {
        if (this.toBeCulled) {
            if (this.flashTimer === 0) {
                if (this.image.tintTopLeft === TINTS.red) {
                    this.image.setTint(TINTS[this.type]);
                    this.flashTimer = 20;
                } else {
                    this.image.setTint(TINTS.red);
                    this.flashTimer = 10;
                }
            } else {
                this.flashTimer -= 1;
            }
        }
    }
    activate(gridCoords, noEnemies = false) {
        this.image.setTint(TINTS[this.type]);
        this.image.setActive(true);
        this.image.setVisible(true);
        const {x, y} = getCoordinates(gridCoords);
        this.image.setPosition(x, y);
        // populate enemies
        if (!noEnemies) {
            this.world.enemy.populate(gridCoords);
        }
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
        const sBound = this.image.ya + 200;
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
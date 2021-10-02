import Phaser from 'phaser';
import GameModule from './GameModule';
import getRndInteger from './getRndInteger';

export default class World extends GameModule {
    constructor(gameModules, scene) {
        super(gameModules);
        this.scene = scene;

        this.tiles = [
            scene.add.image(0, 0, 'grass').setActive(false).setVisible(false),
            scene.add.image(0, 0, 'grass').setActive(false).setVisible(false),
            scene.add.image(0, 0, 'stone').setActive(false).setVisible(false),
            scene.add.image(0, 0, 'stone').setActive(false).setVisible(false),
            scene.add.image(0, 0, 'sand').setActive(false).setVisible(false),
            scene.add.image(0, 0, 'sand').setActive(false).setVisible(false),
        ];
        this.shuffleTiles();

        this.activeTiles = [];

        this.cycleState = 'CALM';
        this.cycleTick = scene.time.addEvent({ delay: 30000, repeat: -1});
        this.tiles.forEach(tile => this.UI.uiCameraIgnore(tile));

        this.addTiles();
    }
    update() {
    }
    shuffleTiles() {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
    }
    addTiles() {
        let tile;
        while (this.activeTiles.length < 3) {
            tile = this.tiles.pop();
            tile.setActive(true);
            tile.setVisible(true);
            let x, y;
            if (!this.activeTiles.length) {
                ({x, y} = this.getCoordinates({x: 0, y: 0}));
            } else {
                // get last placed
                const last = this.activeTiles[this.activeTiles.length - 1];
                // find open tile spaces
                const openDirections = Object.entries(this.getTileNeighbors(last))
                    .filter(([, tile]) => tile === undefined)
                    .map(([dir]) => dir);
                // pick one and place there
                const dir = openDirections[getRndInteger(0, openDirections.length - 1)];
                ({x, y} = this.getCoordinates(this.moveCoords(this.getGridCoordinates(last), dir)));
            }
            tile.setPosition(x, y);
            this.activeTiles.push(tile);
        }
    }
    // return xy coords for the center of a grid point
    getCoordinates({x, y}) {
        return {
            x: 400 + (x * 600),
            y: 300 + (y * 400),
        }
    }
    // given xy coords for center of grid point returns corresponding grid point coords
    getGridCoordinates({x, y}) {
        return {
            x: Math.round((x - 400) / 600),
            y: Math.round((y - 300) / 400),
        }
    }
    getTile(gridCoords) {
        const { x, y } = this.getCoordinates(gridCoords);
        return this.activeTiles.find(tile => tile.x === x && tile.y === y);
    }
    getTileNeighbors(tile) {
        const {x, y} = this.getGridCoordinates(tile);
        return {
            N: this.getTile({x, y: y - 1}),
            S: this.getTile({x, y: y + 1}),
            E: this.getTile({x: x + 1, y}),
            W: this.getTile({x: x - 1, y}),
        };
    }
    moveCoords({x, y}, dir) {
        switch (dir) {
            case 'N':
                return { x, y: y - 1 };
            case 'S':
                return {x, y: y + 1};
            case 'E':
                return {x: x + 1, y};
            case 'W':
                return {x: x - 1, y};
            default:
                return {x, y};
        }
    }
}
import Phaser from 'phaser';
import GameModule from './GameModule';
import getRndInteger from './getRndInteger';
import Tile from './Tile';
import { getCoordinates, getGridCoordinates, moveCoords, getTileNeighbors } from './worldUtils';

export default class World extends GameModule {
    constructor(gameModules, scene) {
        super(gameModules);
        this.scene = scene;

        this.tiles = [
            new Tile(this, { type: 'grass' }),
            new Tile(this, { type: 'grass' }),
            new Tile(this, { type: 'stone' }),
            new Tile(this, { type: 'stone' }),
            new Tile(this, { type: 'sand' }),
            new Tile(this, { type: 'sand' }),
        ];
        this.UI.uiCameraIgnore(this.tiles.map(tile => tile.image));
        this.shuffleTiles();

        this.activeTiles = [];

        this.unstableCycles = 0;
        this.isUnstable = false;
        const unstableTick = () => {
            if (!this.isUnstable) {
                this.isUnstable = true;
                // CALM -> UNSTABLE
                // add 2 tiles
                this.addTiles(5);
                // mark 2 tiles for cull
                this.activeTiles[0].preCull();
                this.activeTiles[1].preCull();
            } else {
                this.isUnstable = false;
                // UNSTABLE -> CALM
                // cull the unstable tiles
                this.tiles.push(this.activeTiles.shift().cull())
                this.tiles.push(this.activeTiles.shift().cull())
                this.unstableCycles += 1;
            }
        }
        this.cycleTick = scene.time.addEvent({ delay: 5000, repeat: -1, callback: unstableTick });

        this.addTiles();
    }
    update() {
        this.activeTiles.forEach(tile => {
            tile.update();
        });
    }
    shuffleTiles() {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
    }
    addTiles(finalCount = 3) {
        let tile;
        this.shuffleTiles();
        while (this.activeTiles.length < finalCount) {
            tile = this.tiles.pop();
            let coords = {x: 0, y: 0};
            if (this.activeTiles.length) {
                // get last placed
                const last = this.activeTiles[this.activeTiles.length - 1];
                // find open tile spaces with an occupied NSEW neighbor
                const openDirections = Object.entries(getTileNeighbors(getGridCoordinates(last)))
                    .filter(([dir, gridCoords]) => {
                        const coordNeighbors = getTileNeighbors(gridCoords);
                        return this.getTile(gridCoords) === undefined &&
                          Object.values(coordNeighbors).some(tile => this.getTile(tile) !== undefined);
                    })
                    .map(([dir]) => dir);
                // pick one and place there
                const dir = openDirections[getRndInteger(0, openDirections.length - 1)];
                coords = moveCoords(getGridCoordinates(last), dir);
            }
            tile.activate(coords, this.activeTiles.length === 0);
            this.activeTiles.push(tile);
        }
    }

    getTile(gridCoords) {
        const { x, y } = getCoordinates(gridCoords);
        return this.activeTiles.find(tile => tile.x === x && tile.y === y);
    }
}
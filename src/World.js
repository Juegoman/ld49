import Phaser from 'phaser';
import GameModule from './GameModule';
import getRndInteger from './getRndInteger';
import Tile from './Tile';

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
            }
        }
        this.cycleTick = scene.time.addEvent({ delay: 10000, repeat: -1, callback: unstableTick });

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
                const openDirections = Object.entries(this.getTileNeighbors(this.getGridCoordinates(last)))
                    .filter(([dir, gridCoords]) => {
                        const coordNeighbors = this.getTileNeighbors(gridCoords);
                        return this.getTile(gridCoords) === undefined &&
                          Object.values(coordNeighbors).some(tile => this.getTile(tile) !== undefined);
                    })
                    .map(([dir]) => dir);
                // pick one and place there
                const dir = openDirections[getRndInteger(0, openDirections.length - 1)];
                coords = this.moveCoords(this.getGridCoordinates(last), dir);
            }
            tile.activate(coords);
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
    getTileNeighbors(gridCoords) {
        return {
            N: this.moveCoords(gridCoords, 'N'),
            S: this.moveCoords(gridCoords, 'S'),
            E: this.moveCoords(gridCoords, 'E'),
            W: this.moveCoords(gridCoords, 'W'),
        }
    }
    moveCoords({x, y}, dir) {
        let result = {x, y};
        if (dir.includes('N')) result.y -= 1;
        if (dir.includes('S')) result.y += 1;
        if (dir.includes('E')) result.x += 1;
        if (dir.includes('W')) result.x -= 1;
        return result;
    }
}
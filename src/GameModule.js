export default class GameModule {
    constructor(gameModules) {
      this.gameModules = gameModules;
    }
    get world() {
      return this.gameModules.world;
    }
    get player() {
      return this.gameModules.player;
    }
    get UI() {
        return this.gameModules.UI;
    }
    // get weapon() {
    //   return this.gameModules.weapon;
    // }
    // get enemy() {
    //   return this.gameModules.enemy;
    // }
    // get hitspark() {
    //   return this.gameModules.hitspark;
    // }
  }
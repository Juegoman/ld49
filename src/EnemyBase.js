export default class EnemyBase {
    constructor(id, sprite, parent, type = 'base') {
        this.id = id;
        this.sprite = sprite;
        sprite.setVisible(false);
        sprite.setActive(false);
        this.parent = parent;
        this.TYPE = type;
    }
    get x() { return this.sprite.x; }
    setX(x) { this.sprite.x = x; }
    get y() { return this.sprite.y; }
    setY(y) { this.sprite.y = y; }
    get coords() { return {x: this.x, y: this.y}; }
    get player() { return this.parent.player; }
    get scene() { return this.parent.scene; }
    get hitspark() { return this.parent.hitspark; }
}
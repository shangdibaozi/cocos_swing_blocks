cc.Class({
    extends: cc.Sprite,

    properties: {
        active: {
            default: null,
            type: cc.SpriteFrame
        }
    },
    toggle() {
        this.node.color = new cc.Color(0,0,0);
        this.spriteFrame = this.active
    }
});
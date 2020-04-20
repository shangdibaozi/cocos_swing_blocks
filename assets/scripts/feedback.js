cc.Class({
    extends: cc.Component,

    properties: {
        increasing:true,
        graphics:null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.graphics = this.node.getComponent(cc.Graphics)
        this.node.width = cc.winSize.width
    },

    vibe() {
        this.node.active = true
        this.increasing = true
    },

    update (dt) {
        if(!this.graphics)return;
        this.graphics.clear()
        this.graphics.fillRect(-cc.winSize.width / 2, -cc.winSize.height / 2, cc.winSize.width, cc.winSize.height)
        if (this.increasing) {
            this.graphics.lineWidth += 8
            if (this.graphics.lineWidth >= 40) {
                this.increasing = false
            }
        } else {
            this.graphics.lineWidth -= 6
            if (this.graphics.lineWidth <= 0) {
                this.graphics.clear()
                this.increasing = true
                this.node.active = false
                return
            }
        }
        this.graphics.stroke()
    },
});
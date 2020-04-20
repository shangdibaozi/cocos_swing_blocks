cc.Class({
    extends: cc.Component,

    properties: {
        onImg: {
            default: null,
            type: cc.SpriteFrame
        },
        offImg: {
            default: null,
            type: cc.SpriteFrame
        },
        se: {
            type: cc.AudioClip,
            default: null
        },
        on: true
    },
    toggle() {
        let sp = this.getComponent(cc.Sprite)
        if (this.on) {
            sp.spriteFrame = this.offImg
        } else {
            sp.spriteFrame = this.onImg
        }
        window.ext.toggleSound()
        this.on = window.ext.temp.sound
        cc.audioEngine.playEffect(this.se);
    },
    onLoad() {
        this.on = window.ext.temp.sound
        let sp = this.getComponent(cc.Sprite)
        if (this.on) {
            sp.spriteFrame = this.onImg
        } else {
            sp.spriteFrame = this.offImg
        }
        this.node.on('touchstart', (ev) => {
            this.toggle()
        });
    }
});
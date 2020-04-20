cc.Class({
    extends: cc.Component,

    properties: {
        mode: Number,
        tools: {
            default: null,
            type: cc.Node
        },
        buttonText: {
            default: null,
            type: cc.Node
        },
        line1: {
            default: null,
            type: cc.Node
        },
        se: {
            default: null,
            type: cc.AudioClip
        },
        lock:false,
        hexColor:'#00ACFF'
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let canvas = cc.director.getScene().getChildByName('Canvas')
        this.node.on('touchstart', (ev) => {
            ev.stopPropagation();
        })
        this.node.getChildByName('shade').width = cc.winSize.width;
        let btn = this.node.getChildByName("button")
        btn.on('touchstart', (ev) => {
            if (this.lock) return;
            ev.stopPropagation();
            cc.audioEngine.playEffect(this.se);
            switch (this.mode) {
                case 0: //failed
                    canvas.getComponent("stage").reloadStage()
                    break;
                case 1: //accomplish
                    canvas.getComponent("stage").nextStage()
                    break;
                case 2:
                    canvas.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(() => {
                        canvas.getComponent("stage").destruct()
                        cc.audioEngine.stopMusic()
                        cc.director.loadScene("series");
                    })))
                    break;
            }
            this.node.active = false
        })
    },

    changeMode(mode, ext) {
        this.mode = mode
        let buttonText = this.buttonText.getComponent(cc.RichText)
        let line1 = this.line1.getComponent(cc.RichText)
        switch (mode) {
            case 0:
                buttonText.string = '<b><color='+this.hexColor+'>重试</c><b>'
                line1.string = '<b><color=#ffffff>再试一次吧</c></b>'
                break;
            case 1:
                buttonText.string = '<b><color='+this.hexColor+'>下一关</c></b>'
                line1.string = '<b><color=#ffffff>关卡通过</c></b>'
                break;
            case 2:
                buttonText.string = '<b><color='+this.hexColor+'>好的</c></b>'
                line1.string = '<b><color=#ffffff>系列关卡已完成！</c></b>'
                break;
        }
        if (this.node.active && this.node.opacity == 255) return;
        this.node.opacity = 0
        this.node.active = true
        this.node.runAction(cc.fadeIn(0.2))
    },

    start() {

    },

    // update (dt) {},
});
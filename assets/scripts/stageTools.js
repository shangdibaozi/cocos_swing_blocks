
cc.Class({
    extends: cc.Component,

    properties: {
        backSe: {
            default: null,
            type: cc.AudioClip
        },
    },
    onLoad () {
        let back = this.node.getChildByName('back_arrow')
        let canvas = cc.find('Canvas')
        let stage = canvas.getComponent('stage')
        back.once('touchstart',(ev)=>{
            ev.stopPropagation();
            cc.audioEngine.playEffect(this.backSe);
            canvas.runAction(cc.sequence(cc.fadeOut(0.2),cc.callFunc(()=>{
                stage.destruct()
                cc.audioEngine.stopMusic()
                cc.director.loadScene('series')
            })))
        })
    },

});

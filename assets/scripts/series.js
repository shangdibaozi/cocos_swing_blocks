cc.Class({
    extends: cc.Component,
    properties: {
        decideSe: {
            default: null,
            type: cc.AudioClip
        },
        bgm: {
            default: null,
            type: cc.AudioClip
        },
        animateEnded:false,
        decided:false,
        navigating:false,
    },
    go(type) {
        if(!this.animateEnded||this.decided)return
        this.decided = true
        cc.audioEngine.playEffect(this.decideSe);
        //更新的时候增加多个系列的判断
        let dur = 0.35
        let pv = this.node.getChildByName('pageview')
        let h2 = this.node.getChildByName('topHint')
        pv.runAction(cc.spawn(cc.fadeOut(dur), cc.moveBy(dur, cc.v2(0, 40))))
        h2.runAction(cc.sequence(
            cc.fadeOut(dur),
            cc.callFunc(()=>{
                cc.director.loadScene("select");
            })
        ))
    },
    onLoad() {
        cc.loader.setAutoRelease(this.bgm,false);
        if(!cc.audioEngine.isMusicPlaying()){
            cc.audioEngine.playMusic(this.bgm, true);
        }
        let ext = cc.find("ext")
        if(!ext.active){
            ext.active = true
            ext.runAction(cc.fadeIn(0.2))
        }
    },
    start() {
        let hint = this.node.getChildByName('topHint').getComponent(cc.RichText)
        let bg = this.node.getChildByName('bg')
        let pvNode = this.node.getChildByName('pageview')
        let pv = pvNode.getComponent(cc.PageView)
        let h2 = this.node.getChildByName('topHint')
        pvNode.on('page-turning', (ev) => {
            switch (ev.getCurrentPageIndex()) {
                case 0:
                    bg.runAction(cc.tintTo(0.3, 0, 150, 223))
                    hint.string = ''
                    break;
                case 1:
                    bg.runAction(cc.tintTo(0.3, 0, 171, 100))
                    hint.string = ''
                    break;
                case 2:
                    bg.runAction(cc.tintTo(0.3, 207, 42, 0))
                    hint.string = '<b><color=#ffffff>制作中....</c></b>'
                    break;
            }
        }, this)
        pv.scrollToRight(0)
        pvNode.runAction(cc.sequence(cc.fadeIn(1),cc.callFunc(()=>{
            this.animateEnded = true
        })))
        pv.scrollToLeft(2)
    }

});
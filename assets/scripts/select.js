cc.Class({
    extends: cc.Component,

    properties: {
        decideSe: {
            default: null,
            type: cc.AudioClip
        },
        backSe: {
            default: null,
            type: cc.AudioClip
        },
        block: {
            default: null,
            type: cc.Prefab,
        },
        series: {
            default: 0,
            type: cc.Integer,
        },
        progress: {
            default: 1,
            type: cc.Integer,
        },
        navigating: false,
        themeColor: new cc.Color()
    },
    animate() {
        let container = this.node.getChildByName('blockContainer')
        container.scale = (cc.winSize.width < 750) ? (cc.winSize.width / 750) : 1
        let stages = []
        let limit = 6
        // if (window.ext.temp.series == 1) {
        //     //如果是图形关卡，还没更新完，所以只打出两行
        //     limit = 4
        // }
        for (let i = 0; i < limit; i++) {
            for (let j = 0; j < 5; j++) {
                let row = i
                let col = j
                let x = col * (120 + 21)
                let y = row * (120 + 21)
                let node = cc.instantiate(this.block);
                let cur = row * 5 + col + 1
                let opacity = 255
                let label = node.getChildByName('label')
                label.color = this.themeColor
                label.getComponent(cc.Label).string = cur
                node.parent = container;
                node.position = cc.v2(700, -y)
                if (cur <= this.progress) {
                    node.on('touchstart', (ev) => {
                        if (this.navigating) return;
                        cc.audioEngine.playEffect(this.decideSe);
                        let ext = cc.find("ext")
                        this.navigating = true
                        window.ext.temp.stage = cur - 1
                        ext.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(() => {
                            ext.active = false
                        })))
                        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(() => {
                            cc.director.loadScene("stage");
                        })))
                    })
                } else {
                    opacity = 128
                }
                let action = cc.sequence(cc.delayTime(row * 0.1 + col * 0.3), cc.spawn(cc.fadeTo(1.0, opacity), cc.moveTo(1, cc.v2(x, -y))))
                action.easing(cc.easeCircleActionOut())
                node.action = action
                stages.push(node)
            }
        }
        for (let i = 0; i < stages.length; i++) {
            stages[i].runAction(stages[i].action)
        }
    },
    onLoad() {
        let seriesLabel = cc.find('Canvas/top/series').getComponent(cc.RichText)
        let bg = this.node.getChildByName("bg")
        let color = null
        switch (Number(window.ext.temp.series)) {
            case 1:
                color = new cc.Color(0, 171, 100)
                seriesLabel.string = '<b><color=#ffffff>图形</c></b>'
                break;
            case 2:
                color = new cc.Color(207, 42, 0)
                seriesLabel.string = '<b><color=#ffffff>大师</c></b>'
                break;
            default:
                color = new cc.Color(0, 150, 223)
                seriesLabel.string = '<b><color=#ffffff>矩形</c></b>'
                break;
        }
        this.themeColor = color
        bg.color = this.themeColor
        this.series = window.ext.temp.series
        this.progress = window.ext.getSeriesProgress(this.series)
    },
    start() {
        this.animate()
        let top = this.node.getChildByName('top')
        let backArrow = top.getChildByName('back')
        backArrow.once('touchstart', () => {
            cc.audioEngine.playEffect(this.backSe);
            cc.director.loadScene("series");
        });
        top.width = cc.winSize.width
        top.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(0.35)))
    },

});
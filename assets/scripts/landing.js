cc.Class({
    extends: cc.Component,

    properties: {
        phsicsSquare: {
            default: null,
            type: cc.Prefab,
        },
        decideSe: {
            default: null,
            type: cc.AudioClip
        },
        bgm: {
            default: null,
            type: cc.AudioClip
        }
    },
    generateSquare() {
        var node = cc.instantiate(this.phsicsSquare);
        node.parent = this.node;
    },
    onLoad() {
        cc.loader.setAutoRelease(this.bgm, false);
        window.ext.init()
        //播放背景音乐
        let bgm = cc.audioEngine.playMusic(this.bgm, true);
        //开启场景物理引擎
        let manager = cc.director.getPhysicsManager()
        manager.enabled = true;
        manager.enabledAccumulator = true;
        manager.gravity = cc.v2(0, -960);
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;
        let ext = cc.find("ext")
        cc.game.addPersistRootNode(ext)
        let tools = cc.find("ext/tools")
        //设置自适应宽度
        ext.width = cc.winSize.width
        tools.width = cc.winSize.width
        this.node.getChildByName("title").getChildByName("logo").scale = (cc.winSize.width < 750) ? (cc.winSize.width / 750) : 1
        //显示UI动画
        this.scheduleOnce(function () {
            this.node.getComponent(cc.Animation).play('uiFadeIn')
            tools.runAction(cc.sequence(cc.fadeIn(1), cc.callFunc(
                () => {
                    //按钮按下事件
                    this.node.getChildByName("button").once('touchstart', (ev) => {
                        cc.audioEngine.playEffect(this.decideSe);
                        let animation = this.node.getComponent(cc.Animation)
                        animation.on('finished', () => {
                            cc.director.loadScene("series");
                        }, this);
                        animation.play('uiFadeOut')
                        cc.director.getScheduler().unschedule(this.generateSquare, this)
                        //隐藏场景中的物理块
                        var children = this.node.children;
                        for (var i = 0; i < children.length; ++i) {
                            let node = children[i];
                            if (node.name == 'titleSquare') {
                                node.runAction(cc.fadeOut(0.6))
                            }
                        }
                    })
                }
            )))
        }, 1);
    },
    start() {
        this.schedule(this.generateSquare, 3);
    }

});
cc.Class({
    extends: cc.Component,

    properties: {
        stage: null,
        graphics:null
    },

    reDraw() {
        if(!this.stage||!this.graphics)return;
        let pair = this.stage.currentPair
        if (!pair) {
            this.graphics.clear();
            return
        }
        let jointPos = pair[1].position
        let blockPos = []
        if(pair[0].jointOffset){
            let point = pair[0].convertToWorldSpaceAR(cc.v2(pair[0].jointOffset))
            blockPos = point
            blockPos.x-=cc.winSize.width/2
            blockPos.y-=cc.winSize.height/2
        }else{
            blockPos = pair[0].position
        }
        this.graphics.clear()
        this.graphics.moveTo(jointPos.x, jointPos.y)
        this.graphics.lineTo(blockPos.x, blockPos.y)
        this.graphics.stroke()
    },
    onLoad() {
        this.stage = cc.find('Canvas').getComponent("stage")
        this.graphics = this.node.getComponent(cc.Graphics)
    }
});
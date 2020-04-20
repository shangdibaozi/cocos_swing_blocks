// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        chain:null
    },

    updateJointGraphics(){
        let joint = this.node.getComponent(cc.DistanceJoint)
        if(!joint||!joint.connectedBody)return
        let bodyPos = joint.connectedBody.getComponent(cc.Sprite).node.position
        if(!this.chain){
            this.chain = cc.find('Canvas/chainGraphic').getComponent(cc.Graphics)
        }
        let pos = this.node.position
        let chain = this.chain
        chain.clear()
        chain.moveTo(pos.x,pos.y)
        chain.lineTo(bodyPos.x,bodyPos.y)
        chain.stroke()
    }
});

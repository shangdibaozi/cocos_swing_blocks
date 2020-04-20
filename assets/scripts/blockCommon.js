cc.Class({
    extends: cc.Component,

    properties: {

    },
    update() {
        let aabb = this.node.getComponent(cc.PhysicsCollider).getAABB()
        if (aabb.y < (0 - aabb.height)) {
            let stage = cc.director.getScene().getChildByName('Canvas').getComponent("stage")
            stage.showMask(0)
            let type = 0
            switch (this.node.name) {
                case 'square':
                    type = 1;
                    break;
                case 'orb':
                    type = 5;
                    break;
                case 'triangle':
                    type = 6;
                    break;
            }
            stage.recoverNode(this.node, type)
        }
    }
});
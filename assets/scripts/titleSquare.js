cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad() {
        let rigid = this.getComponent(cc.RigidBody)
        rigid.linearVelocity = cc.v2(ext.random(-50, 50), ext.random(0, 100))
        rigid.angularVelocity = ext.random(-1000, 1000)
    },
    update() {
        let aabb = this.getComponent(cc.PhysicsBoxCollider).getAABB()
        if (aabb.y < 0) {
            this.node.destroy()
        }
    }
});
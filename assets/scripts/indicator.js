cc.Class({
    extends: cc.Component,

    properties: {
        progress:0,
        childs:[],
        dotPrefab: {
            default: null,
            type: cc.Prefab,
        }
    },
    next(){
        let dot = this.childs[this.progress]
        if(!dot)return;
        dot.getComponent(cc.Sprite).toggle()
        this.progress++
    },
    init(count){
        this.node.active = true
        this.progress = 0
        this.childs = []
        this.node.removeAllChildren()
        this.node.x = -(count*42-20)/2
        for(let i =0;i<count;i++){
            let dot = cc.instantiate(this.dotPrefab);
            dot.parent = this.node
            dot.x = i*42
            this.childs.push(dot)
        }
    }
});

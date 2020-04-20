cc.Class({
	extends: cc.Component,

	properties: {
		shapeScale: {
			default: 0,
			animatable: true
		},
		max: 1334,
		graphics:null
	},
	onLoad(){
		this.graphics = this.node.getComponent(cc.Graphics)
	},
	lateUpdate(dt) {
		if(!this.graphics)return;
		let newSize = this.max * this.shapeScale
		this.graphics.clear()
		let opacity = (this.shapeScale >= 0.5) ? Math.floor(255 * (1 - this.shapeScale) * 2) : Math.floor(255 * this.shapeScale * 2);
		this.graphics.strokeColor = new cc.Color(255, 255, 255, opacity);
		this.graphics.lineWidth = 20
		this.graphics.rect(-newSize / 2, -newSize / 2, newSize, newSize);
		this.graphics.stroke();
	}

});
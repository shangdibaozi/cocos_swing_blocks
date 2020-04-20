cc.Class({
    extends: cc.Component,

    properties: {

    },

    clicked(ev,data){
        let series = cc.find('Canvas').getComponent('series')
        window.ext.temp.series = data
        series.go(data)
    },
    start () {

    },
});

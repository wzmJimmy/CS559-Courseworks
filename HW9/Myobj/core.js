var core;

(function() {
    "use strict";

    core = function core( size,  pos) {
        this.size = size || 1;
        this.position = pos || [0,4,0];
        this.flag = true;
        this.obj = [new reflect_ball("s1", 2/3)];

        var the0 = [Math.PI/12,Math.PI/4*3,Math.PI/12*17];
        var trans = new Transform();
        trans.trans(m4.translation([0,-.5,0]),true);
        for(var i=0;i<3;i++){
            trans.save();
            trans.trans(m4.rotationY(the0[i]));
            this.obj.push(new bound("s1",0.8, [2,trans]));
            trans.restore();
        }
    };
    core.prototype.init = function () {
        this.obj.forEach(function (o) { o.init(); })

        // ----
    };
    core.prototype.setflag = function(f) {
        this.flag = f;
    }
    core.prototype.draw = function (ts) {
        advance(this);

        var trans = new Transform();
        if(this.flag) trans.trans(m4.translation(this.position),true);

        this.obj.forEach(function (o) { o.draw(trans); });
    };

    var r0 = 3;
    var h = 2.5;
    function advance(core){
        var angle = Number(drawingState.realtime)/800.0;
        core.position = [r0*Math.cos(angle),h,r0*Math.sin(angle)];
    };
}());


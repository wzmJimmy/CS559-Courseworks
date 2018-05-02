var mineral;

(function() {
    "use strict";

    var r2 = Math.sqrt(2);

    mineral = function mineral( size,  pos) {
        this.size = size || 1;
        this.position = pos || [0,4,0];
        this.flag = true;
        this.obj = [];
        this.mineral = true;

        var axis = [[1,0,0],[0,0,1]];
        var angle = [Math.PI/4,-Math.PI/4];
        var trans = new Transform();

        trans.save();
        trans.trans(m4.translation([0,1/r2,0]),true);
        this.obj.push(new diamond("s2",1/r2,false, [2,trans]));
        trans.restore();

        for(var i=0; i<2; i++){
            for(var j=0; j<2; j++) {
                trans.save();
                trans.trans(m4.axisRotation(axis[i],angle[j]));
                trans.trans(m4.translation([0,1/r2,0]),true);
                this.obj.push(new diamond("s2",1/r2,false, [2,trans]));
                trans.restore();
            }
        }
    };

    mineral.prototype.init = function () {
        this.obj.forEach(function (o) { o.init(); })

        // ----
    };
    mineral.prototype.setflag = function(f) {
        this.flag = f;
    }
    mineral.prototype.draw = function (ts) {
        var trans = new Transform();
        if(this.flag) trans.trans(m4.translation(this.position),true);
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        this.obj.forEach(function (o) { o.draw(trans); });
    };
}());


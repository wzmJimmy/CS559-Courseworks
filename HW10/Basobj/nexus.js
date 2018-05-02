var nexus;

(function() {
    "use strict";

    var r2 = Math.sqrt(2);

    nexus = function nexus( size,  pos) {
        this.size = size || 1;
        this.position = pos || [0,4,0];
        this.flag = true;
        this.obj = [];

        var trans = new Transform();
        trans.save();


        for(var i=0; i<3;i++){
            this.obj.push(new brick("s"+(3-i),1-0.3*i, [2,trans]));
            trans.trans(m4.translation([0,0.41,0]), true);
        }

        trans.trans(m4.translation([0,0.12,0]), true);
        this.obj.push(new diamond("s1",0.12,true, [2,trans]));
        trans.restore();

        var l= 0.35;
        for(var i=0; i<8;i++){
            trans.save();
            trans.trans(m4.translation([0.9 + l*Math.sqrt(3)/6,0,0]),true);
            this.obj.push(new pyramid("s2",l,[2,trans]));
            trans.restore();
            trans.trans(m4.rotationY(Math.PI/4));
        }

        /*for(var i=0; i<8;i++){
            this.obj.push(new pyramid("s2",l,[2,trans]));
            //trans.trans(m4.rotationY(i*Math.PI/4));
            //trans.trans(m4.rotationZ(i*Math.PI/4));
        }*/
    };

    nexus.prototype.init = function () {
        this.obj.forEach(function (o) { o.init(); })

        // ----
    };
    nexus.prototype.setflag = function(f) {
        this.flag = f;
    }
    nexus.prototype.draw = function (ts) {
        var trans = new Transform();
        if(this.flag) trans.trans(m4.translation(this.position),true);
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        this.obj.forEach(function (o) { o.draw(trans); });
    };
}());
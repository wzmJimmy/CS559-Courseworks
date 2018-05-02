var probe;

(function() {
    "use strict";

    probe = function probe( size,  pos) {
        this.size = size || 1;
        this.position = pos || [2,0.1,2];
        this.orientation = undefined;
        this.flag = true;
        this.go_return = "go";

        var trans = new Transform();
        trans.trans(m4.translation([Math.sqrt(3)/6,0,0]),true);

        trans.save();
        trans.trans(m4.rotationZ(Math.PI/6));
        this.obj = [new pyramid("s1",1,[2,trans])];
        trans.restore();

        var loc =[[3/8,1/8,3/8],[3/8,1/8,-3/8]];
        for(var i=0;i<2;i++){
            trans.save();
            trans.trans(m4.translation(loc[i]),true);
            this.obj.push(new sphere("s2",1/8, [2,trans]));
            trans.restore();
        }
    };
    probe.prototype.init = function () {
        this.obj.forEach(function (o) { o.init(); })

        // ----
        this.orientation = 0;
        this.lastMin = undefined;
        this.state = 1;
        this.wait = getRandomInt(250,1000);
        this.lastTime = 0;
    };
    probe.prototype.setflag = function(f) {
        this.flag = f;
    }
    probe.prototype.draw = function (ts) {
        advance(this);

        var trans = new Transform();
        if(this.flag) trans.trans(m4.translation(this.position),true);
        trans.trans(m4.rotationY(this.orientation));
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        this.obj.forEach(function (o) { o.draw(trans); });
    };



    var flyingSpeed = 3/1000;          // units per milli-second
    var turningSpeed = 2/1000;         // radians per milli-second

    var mid ={position:[0,0,0]};

    // utility - generate random  integer
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    // find a random helipad - allow for excluding one (so we don't re-use last target)
    function randomMineral(exclude) {
        var minerals = [];
        for(var name in grobjects){
            var obj =  grobjects[name];
            if (obj.mineral && (obj!=exclude))  minerals.push(obj);
        }
        if (!minerals.length) {throw("No minerals for the probe!");}
        var idx = getRandomInt(0,minerals.length);
        return minerals[idx];
    }

    // this actually does the work
    function advance(probe) {
        // on the first call, the copter does nothing
        if (!probe.lastTime) {
            probe.lastTime = drawingState.realtime;
            return;
        }
        var delta = drawingState.realtime - probe.lastTime;
        probe.lastTime = drawingState.realtime;

        // now do the right thing depending on state
        switch (probe.state) {
            case 0: // on the ground, waiting for take off
                if (probe.wait > 0) { probe.wait -= delta; }
                else {  // take off!
                    probe.state = 1;
                    probe.wait = getRandomInt(250,1000);
                }
                break;
            case 1: // decision
                if(probe.go_return=="go"){
                    var dest = randomMineral(probe.lastMin);
                    probe.go_return="return";
                }else{
                    var dest = mid;
                    probe.go_return="go";
                }
                probe.lastMin = dest;

                // the direction to get there...
                probe.dx = (dest.position[0] - probe.position[0]);
                probe.dz = (dest.position[2] - probe.position[2]);
                probe.dst0 = Math.sqrt(probe.dx*probe.dx + probe.dz*probe.dz);
                probe.dst = Math.sqrt(probe.dx*probe.dx + probe.dz*probe.dz) - (probe.go_return=="go"? 2.4:0.9);
                if (probe.dst < .01) {
                    // small distance - just go there
                    probe.position[0] = dest.position[0];
                    probe.position[2] = dest.position[2];
                    probe.state = 3;
                } else {
                    probe.vx = probe.dx / probe.dst0;
                    probe.vz = probe.dz / probe.dst0;
                }
                probe.dir = Math.atan2(probe.dx,probe.dz) -  Math.PI/2;
                probe.state = 2;
                break;
            case 2: // spin towards goal
                var dtheta = probe.dir - probe.orientation;
                // if we're close, pretend we're there
                if (Math.abs(dtheta) < .01) {
                    probe.state = 3;
                    probe.orientation = probe.dir;
                }
                var rotAmt = turningSpeed * delta;
                if (dtheta > 0) {
                    probe.orientation = Math.min(probe.dir,probe.orientation+rotAmt);
                } else {
                    probe.orientation = Math.max(probe.dir,probe.orientation-rotAmt);
                }
                break;
            case 3: // fly towards goal
                if (probe.dst > .01) {
                    var go = delta * flyingSpeed;
                    // don't go farther than goal
                    go = Math.min(probe.dst,go);
                    probe.position[0] += probe.vx * go;
                    probe.position[2] += probe.vz * go;
                    probe.dst -= go;
                } else { // we're effectively there, so go there
                    probe.state = 0;
                }
                break;
        }
    }
}());
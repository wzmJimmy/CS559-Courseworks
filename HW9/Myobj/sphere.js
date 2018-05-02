var sphere;

(function() {
    "use strict";

    //buffer model for sphere of radius=1, bound=bd, color is gradient from c1 to c2
    function sphere_model(bd,c1,c2) {
        var c2 = c2|| c1;
        var buf = {poi:[],norm:[],col:[],ind:[]};

        for(var i=0;i<=bd; i++){
            var lat = i*Math.PI/bd-Math.PI/2;
            if(i==0) lat+=0.001; if(i==bd) lat-=0.001;
            var col = MyGradient(c1,c2,i,bd+1);

            for(var j=0;j<=bd; j++){
                var lon = j*2*Math.PI/bd-Math.PI;
                var x = Math.cos(lat)*Math.cos(lon);
                var z = Math.cos(lat)*Math.sin(lon);
                var y = Math.sin(lat);
                var poi = [x,y,z];
                poi.forEach(function (v) { buf.poi.push(v);buf.norm.push(v); })
                col.forEach(function (v) { buf.col.push(v); })
            }
        }
        for(var i=0;i<bd; i++) {
            for (var j = 0; j < bd; j++) {
                var lu = i * (bd + 1) + j;
                var ld = lu + bd + 1;
                var inds = [lu, ld + 1, lu + 1, lu, ld, ld + 1];
                inds.forEach(function (v) { buf.ind.push(v); })
            }
        }
        return buf;
    }

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = shader["Myobj"];
    var buffers = {};
    var collection = {s1:{bd:20,c1:[1, 0, 1]},s2:{bd:15,c1:[0,102/255,1]}};

    sphere = function sphere(vers, size,  pos_trans) {
        this.size = size || 1;
        this.vers = vers;
        if (pos_trans) {
            if (pos_trans[0] == 1) this.position = pos_trans[1];
            if (pos_trans[0] == 2) this.transform = new Transform(pos_trans[1]);
        }
        this.flag = true;
    };
    sphere.prototype.init = function () {
        var coll = collection[this.vers];

        if (!buffers[this.vers]) {
            var buf = sphere_model(coll.bd,coll.c1,coll.c2);
            var arrays = {
                pos: {numComponents: 3, data: buf.poi},
                norm: {numComponents: 3, data: buf.norm},
                col: {numComponents: 3, data: buf.col},
                indices: buf.ind
            };
            buffers[this.vers] = twgl.createBufferInfoFromArrays(gl, arrays);
        }
        //console.log(buffers);
    };
    sphere.prototype.setflag = function(f) {
        this.flag = f;
    }
    sphere.prototype.draw = function (ts) {
        var trans = new Transform(ts);
        if(this.flag){
            if (this.position) trans.trans(m4.translation(this.position), true);
            if (this.transform) trans.trans_By_LTrans(this.transform);
        }
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            tview: drawingState.view, tproj: drawingState.proj, dlight: drawingState.sunDirection,
             tmodel: trans.get_Trans() ,tnorm: trans.get_Tnorm()
        });
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers[this.vers]);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers[this.vers]);
    };
}());

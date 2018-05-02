var pyramid;

(function() {
    "use strict";

    var r3 = Math.sqrt(3);
    var r2 = Math.sqrt(2);

    //buffer model for sphere of radius=1, bound=bd, color is gradient from c1 to c2
    function pyramid_model(c1,c2) {
        var c1 = c1 || [1,0,0];
        var c2 = c2 || [0.9, 0.5, 0.9];
        var buf = {poi:[],norm:[],col:[]};

        var v = [0,2,1,0,3,2,1,2,3,0,1,3];
        var point =[[r3/3, 0.0, 0], [-r3/6, 0.0, 0.5], [0.0, r2/r3,  0.0], [-r3/6, 0.0, -0.5]];

        v.forEach(function (i) {
            add_A(buf.poi,point[i]);
            add_A(buf.col,i==2? c2: c1);
        })
        for(var i=0; i<4;i++){
            var e1 = v3.subtract(point[v[3*i+1]],point[v[3*i]]);
            var e2 = v3.subtract(point[v[3*i+2]],point[v[3*i]]);
            var norm = v3.normalize(v3.cross(e1,e2));
            for(var j=0;j<3;j++){
                add_A(buf.norm,norm);
            }
        }
        return buf;
    }

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    pyramid = function pyramid(size,  pos_trans) {
        this.size = size || 1;
        if (pos_trans) {
            if (pos_trans[0] == 1) this.position = pos_trans[1];
            if (pos_trans[0] == 2) this.transform = new Transform(pos_trans[1]);
        }
        this.flag = true;
    };
    pyramid.prototype.init = function () {
        var gl = drawingState.gl;

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["vs", "fs"]);
        }
        if (!buffers) {
            var buf = pyramid_model();
            var arrays = {
                pos: {numComponents: 3, data: buf.poi},
                norm: {numComponents: 3, data: buf.norm},
                col: {numComponents: 3, data: buf.col},
            };
            buffers = twgl.createBufferInfoFromArrays(gl, arrays);
        }
        //console.log(buffers);
    };
    pyramid.prototype.setflag = function(f) {
        this.flag = f;
    }
    pyramid.prototype.draw = function (ts) {
        var trans = new Transform(ts);
        if(this.flag){
            if (this.position) trans.trans(m4.translation(this.position), true);
            if (this.transform) trans.trans_By_LTrans(this.transform);
        }
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            tview: drawingState.view, tproj: drawingState.proj, dlight: drawingState.sunDirection,
            tmodel: trans.get_Trans() ,tnorm: trans.get_Tnorm()
        });
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
}());
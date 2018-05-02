var bound;

(function() {
    "use strict";

    //buffer model for sphere of radius=1, bound=bd, color is gradient from c1 to c2
    function bound_model(th,h,row,col,c1,c2) {
        var h = h || .5;
        var row = row || 10;
        var col = col || 5;
        var c1 = c1 || [1,153/255,153/255];
        var c2 = c2 || c1;

        var buf = {poi:[],norm:[],col:[],ind:[]};

        function point(i,j) {
            var thi = th*i/row;
            return[Math.cos(thi),h*(1-j/col)-h/2,Math.sin(thi)];
        }

        for(var i=0;i<=row; i++){
            var c = MyGradient(c1,c2,i,row+1);
            for(var j=0;j<=col; j++){
                var poi = point(i,j);
                var norm = [poi[0],0,poi[2]];
                poi.forEach(function (v) { buf.poi.push(v); });
                norm.forEach(function (v) { buf.norm.push(v);});
                c.forEach(function (v) { buf.col.push(v); });
            }
        }

        for(var i=0;i<row; i++) {
            for (var j = 0; j <col; j++) {
                var lu =  i * (col+ 1) + j;
                var ld = lu + col + 1;
                var inds = [lu, ld + 1, lu + 1, lu, ld, ld + 1];
                inds.forEach(function (v) { buf.ind.push(v); })
            }
        }
        return buf;
    }

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = {};
    var collection = {s1:{th:Math.PI/2},s2:{th:Math.PI*2,h:.3, row:20}};

    bound = function bound(vers, size,  pos_trans) {
        this.vers = vers;
        this.size = size || 1;

        if (pos_trans) {
            if (pos_trans[0] == 1) this.position = pos_trans[1];
            if (pos_trans[0] == 2) this.transform = new Transform(pos_trans[1]);
        }
        this.flag = true;
    };
    bound.prototype.init = function () {
        var gl = drawingState.gl;
        var coll = collection[this.vers];
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["vs", "fs"]);
        }
        if (!buffers[this.vers]) {
            var buf = bound_model(coll.th, coll.h, coll.row, coll.col, coll.c1,coll.c2);
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
    bound.prototype.setflag = function(f) {
        this.flag = f;
    }
    bound.prototype.draw = function (ts) {
        var theta = Number(drawingState.realtime)/150.0;
        var trans = new Transform(ts);
        if(this.flag){
            if (this.position) trans.trans(m4.translation(this.position), true);
            if (this.transform) trans.trans_By_LTrans(this.transform);
        }
        trans.trans(m4.rotationY(theta));
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            tview: drawingState.view, tproj: drawingState.proj, dlight: drawingState.sunDirection,
            tmodel: trans.get_Trans() ,tnorm: trans.get_Tnorm()
        });
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers[this.vers]);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers[this.vers]);
    };
}());


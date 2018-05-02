var plain;

(function() {
    "use strict";

    function plain_model(bd,col1,col2) {

        var bd = bd || 60;
        var col1 = col1 || [48/255,48/255,48/255];
        var col2 = col2 || [144/255,144/255,144/255];
        var col = [col1,col2];
        var norm = [0,1,0];

        function point(i,j) {
            var lh = 1;
            var lpb = 2/bd;
            return [lh-lpb*i, 0, lpb*j-lh];
        }

        var buf = {poi:[],norm:[],col:[],ind:[]};
        for(var i=0; i<bd; i++) {
            for(var j=0; j<bd; j++) {
                var c = col[(i+j)%2];
                var poi = [point(i,j),point(i+1,j), point(i+1,j+1), point(i,j+1)];
                for(var id=0;id<4;id++){
                    poi[id].forEach(function (v) { buf.poi.push(v); })
                    c.forEach(function (v) { buf.col.push(v); })
                    norm.forEach(function (v) { buf.norm.push(v); })
                }

                var ind = i * bd*4 + j*4;
                var inds = [ind, ind + 2, ind + 3, ind, ind + 1, ind + 2];
                inds.forEach(function (v) { buf.ind.push(v); });
            }
        }
        return buf;
    }

    var shaderProgram = shader["Proj"];
    var buffers = undefined;
    var image = [Images["ATNS"]];
    var textures = undefined;

    plain = function plain(size,  pos) {
        this.size = size || 1;
        this.position = pos || [0,0,0];
        this.flag = true;
    };
    plain.prototype.init = function () {

        if (!buffers) {
            var buf =  plain_model();
            var arrays = {
                pos: {numComponents: 3, data: buf.poi},
                norm: {numComponents: 3, data: buf.norm},
                col: {numComponents: 3, data: buf.col},
                indices: buf.ind
            };
            buffers = twgl.createBufferInfoFromArrays(gl, arrays);
        }
        if(!textures){
            textures = [];
            for(var i = 0;i < image.length;i++){
                var text = {};
                text["ts"] = gl.getUniformLocation(shaderProgram.program, "texSampler"+i);
                text["s"] = createGLTexture(gl, image[i], true);
                textures.push(text);
            }
        }
    };
    plain.prototype.setflag = function(f) {
        this.flag = f;
    }
    plain.prototype.draw = function (ts) {
        var trans = new Transform(ts);
        if(this.flag){
            if (this.position) trans.trans(m4.translation(this.position), true);
            if (this.transform) trans.trans_By_LTrans(this.transform);
        }
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            tview: drawingState.view, tproj: drawingState.proj, dlight: drawingState.sunDirection,
            tmodel: trans.get_Trans() ,tnorm: trans.get_Tnorm(),lview: drawingState.lview, lproj: drawingState.lproj,
        });
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        for(var i = 0;i < image.length;i++){
            gl.activeTexture(gl["TEXTURE"+i]);
            gl.bindTexture(gl.TEXTURE_2D, textures[i].s);
            gl.uniform1i(textures[i].ts, i);
        }
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
}());
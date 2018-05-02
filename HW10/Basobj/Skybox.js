var skybox;

(function() {
    "use strict";

    //buffer model for sphere of radius=1, bound=bd, color is gradient from c1 to c2
    function skybox_model(s) {
        var buf = {poi:[],norm:[]};
        var l = s/2;

        var v = [0,1,2, 0,2,3, 1,5,6, 1,6,2, 4,5,6, 4,6,7, 0,4,7, 0,7,3, 0,1,5, 0,5,4, 3,2,6, 3,6,7];
        var point =[[l, l, -l], [l, l, l], [l, -l, l], [l, -l, -l],
                    [-l, l, -l], [-l, l, l], [-l, -l, l], [-l, -l, -l]];

        v.forEach(function (i) {
            add_A(buf.poi,point[i]);
        })

        return buf;
    }

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = shader["Sky"];
    var buffers = undefined;
    var image = [Images["Space0"],Images["Space1"],Images["Space2"],Images["Space3"],Images["Space4"],Images["Space5"]];
    var textures = undefined;

    skybox = function skybox(size, pos) {
        this.size = size || 150;
        this.position = pos || [0,0,0];
        this.flag = true;
    };
    skybox.prototype.init = function () {

        if (!buffers) {
            var buf = skybox_model(this.size);
            var arrays = {
                pos: {numComponents: 3, data: buf.poi}
            };
            buffers = twgl.createBufferInfoFromArrays(gl, arrays);
        }
        if(!textures){
            textures = {};
            textures["ts"] = gl.getUniformLocation(shaderProgram.program, "skybox");
            textures["s"] = createCubeGLTexture(gl, image);
        }
    };
    skybox.prototype.setflag = function(f) {
        this.flag = f;
    }
    skybox.prototype.draw = function () {
        var trans = new Transform();
        if(this.flag) trans.trans(m4.translation(this.position),true);

        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {tview: drawingState.view, tproj: drawingState.proj,
            tmodel:trans.get_Trans(),tmodel_noT: trans.get_Trans_noT()});

        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);

        gl.activeTexture(gl["TEXTURE0"]);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, textures.s);
        gl.uniform1i(textures.ts, 0);

        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
}());


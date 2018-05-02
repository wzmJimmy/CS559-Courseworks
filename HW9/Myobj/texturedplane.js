var TexturedPlane;

(function() {
    "use strict";

    var vertices = new Float32Array([
         0.5,  0.5,  0.0,
        -0.5,  0.5,  0.0,
        -0.5, -0.5,  0.0,

         0.5,  0.5,  0.0,
        -0.5, -0.5,  0.0,
         0.5, -0.5,  0.0

    ]);

    var uvs = new Float32Array([
       1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,

       1.0, 1.0,
       0.0, 0.0,
       1.0, 0.0
    ]);

    //see above comment on how this works. 
    var image = [Images["Space0"]];
    var shaderProgram = shader["Text"];
    var buffers = undefined;
    var textures = undefined;


    TexturedPlane = function () {
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1]);
        this.flag = true;
    }

    TexturedPlane.prototype.init = function () {

        if (!buffers) {
            var arrays = {
                aPosition: {numComponents: 3, data: vertices},
                aTexCoord: {numComponents: 2, data: uvs}
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

    }

    TexturedPlane.prototype.setflag = function (f) {
        this.flag = f;
    }

    TexturedPlane.prototype.draw = function () {
        var trans = new Transform();
        if(this.flag){
            if (this.position) trans.trans(m4.translation(this.position), true);
            if (this.transform) trans.trans_By_LTrans(this.transform);
        }
        trans.trans(m4.scaling([this.scale[0],this.scale[1], 1]));

        gl.useProgram(shaderProgram.program);
        gl.disable(gl.CULL_FACE);
        twgl.setUniforms(shaderProgram, {
            vMatrix: drawingState.view, pMatrix: drawingState.proj, //dlight: drawingState.sunDirection,
            mMatrix: trans.get_Trans() //,tnorm: trans.get_Tnorm()
        });
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);

        for(var i = 0;i < image.length;i++){
            gl.activeTexture(gl["TEXTURE"+i]);
            gl.bindTexture(gl.TEXTURE_2D, textures[i].s);
            gl.uniform1i(textures[i].ts, i);
        }

        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    }

})();

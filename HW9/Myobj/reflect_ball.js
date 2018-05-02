var reflect_ball;

(function() {
    "use strict";

    //buffer model for sphere of radius=1, bound=bd, color is gradient from c1 to c2
    function reflect_ball_model(bd,c1,c2) {
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
    var shaderProgram = shader["Cube"];
    var buffers = {};
    var collection = {s1:{bd:20,c1:[220/255,223/255,227/255]}};
    var dynamicCubemap = undefined;
    var framebuffer = undefined;

    reflect_ball = function reflect_ball(vers, size, pos) {
        this.size = size || 1;
        this.vers = vers || "s1";
        this.position = pos ||[0,0,0];
    };
    reflect_ball.prototype.init = function () {
        var coll = collection[this.vers];

        if (!buffers[this.vers]) {
            var buf = reflect_ball_model(coll.bd,coll.c1,coll.c2);
            var arrays = {
                pos: {numComponents: 3, data: buf.poi},
                norm: {numComponents: 3, data: buf.norm},
                col: {numComponents: 3, data: buf.col},
                indices: buf.ind
            };
            buffers[this.vers] = twgl.createBufferInfoFromArrays(gl, arrays);
        }
        if(!dynamicCubemap){
            dynamicCubemap = gl.createTexture(); // Create the texture object for the reflection map

            gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubemap);  // create storage for the reflection map images
            for (var i = 0; i < 6; i++) {
                gl.texImage2D(target[i], 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }

            framebuffer = gl.createFramebuffer();  // crate the framebuffer that will draw to the reflection map
            gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);  // select the framebuffer, so we can attach the depth buffer to it
            var depthBuffer = gl.createRenderbuffer();   // renderbuffer for depth buffer in framebuffer
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // so we can create storage for the depthBuffer
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 512, 512);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

        }
    };

    reflect_ball.prototype.draw_1 = function () {
        advance(this);

        createDynamicCubemap(this.position);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0,0,canvas.width,canvas.height);
    };
    reflect_ball.prototype.draw_2 = function () {
        var trans = new Transform();
        trans.trans(m4.translation(this.position), true);
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            tview: drawingState.view, tproj: drawingState.proj, dlight: drawingState.sunDirection,
            tmodel: trans.get_Trans() ,tmodel_noT: trans.get_Trans_noT() ,tnorm: trans.get_Tnorm(),
            inv_view: m4.inverse(drawingState.view)
        });

        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers[this.vers]);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubemap);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers[this.vers]);
    };

    var r0 = 3;
    var h = 2.5;
    function advance(ball){
        var angle = Number(drawingState.realtime)/800.0;
        ball.position = [r0*Math.cos(angle),h,r0*Math.sin(angle)];
    };

    function createDynamicCubemap(pos) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.viewport(0,0,512,512);  //match size of the texture images
        drawingState.proj = m4.perspective( Math.PI/2, 1, 1, 100);  // Set projection to give 90-degree field of view.

        var cameraM = undefined;

        cameraM = m4.lookAt(pos,v3.add(pos,[0,0,-1]),[0,-1,0]);
        drawingState.view = m4.inverse(cameraM);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, dynamicCubemap, 0);
        renderSkyboxAndCubes();

        cameraM = m4.lookAt(pos,v3.add(pos,[1,0,0]),[0,-1,0]);
        drawingState.view = m4.inverse(cameraM);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X, dynamicCubemap, 0);
        renderSkyboxAndCubes();

        cameraM = m4.lookAt(pos,v3.add(pos,[0,0,1]),[0,-1,0]);
        drawingState.view = m4.inverse(cameraM);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, dynamicCubemap, 0);
        renderSkyboxAndCubes();

        cameraM = m4.lookAt(pos,v3.add(pos,[-1,0,0]),[0,-1,0]);
        drawingState.view = m4.inverse(cameraM);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, dynamicCubemap, 0);
        renderSkyboxAndCubes();

        cameraM = m4.lookAt(pos,v3.add(pos,[0,-1,0]),[0,0,-1]);
        drawingState.view = m4.inverse(cameraM);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, dynamicCubemap, 0);
        renderSkyboxAndCubes();

        cameraM = m4.lookAt(pos,v3.add(pos,[0,1,0]),[1,0,0]);
        drawingState.view = m4.inverse(cameraM);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, dynamicCubemap, 0);
        renderSkyboxAndCubes();


        gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubemap);
        gl.generateMipmap( gl.TEXTURE_CUBE_MAP );
    }

    function renderSkyboxAndCubes() {

        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for(var obj in grobjects){
            grobjects[obj].draw();
        }
    }
}());



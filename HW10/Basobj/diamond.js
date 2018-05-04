var diamond;

(function() {
    "use strict";

    var r3 = Math.sqrt(3);
    var r2 = Math.sqrt(2);

    //buffer model for sphere of radius=1, bound=bd, color is gradient from c1 to c2
    function diamond_model(rat, c1,c2) {
        var rat = rat || 1.8;
        var c1 = c1 || [0,1,1];
        var c2 = c2 || [192/255,1,1];
        var c0 = MyGradient(c1,c2,1,2);
        var buf = {poi:[],norm:[],col:[],Texc:[]};
        var l = 1/rat;

        var v = [0,4,1, 1,4,2, 3,2,4, 0,3,4, 0,1,5, 1,2,5, 2,3,5, 3,0,5];
        var point =[[l, 0, 0], [0, 0, l], [-l, 0,  0], [0, 0, -l], [0, 1,  0], [0, -1, 0]];
        var tcord =[[0,0], [0,1], [1, 1], [0,1], [ 1,  0], [1, 0]];

        v.forEach(function (i) {
            add_A(buf.poi,point[i]);
            add_A(buf.Texc,tcord[i]);
            var col = c0;
            if(i == 4) col = c1;
            if(i == 5) col = c2;
            add_A(buf.col,col);
        })
        for(var i=0; i<8;i++){
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
    var shaderProgram = shader["Bump"];
    var buffers = {};
    var collection ={s1:{rat:1.2,c1:[0,1,1],c2:[0,0,1]}, s2:{}};
    var image = [Images["bump3"],Images["ATNS"]];
    var textures = undefined;

    diamond = function diamond(vers, size, rot ,pos_trans) {
        this.vers = vers;
        this.size = size || 1;
        if (pos_trans) {
            if (pos_trans[0] == 1) this.position = pos_trans[1];
            if (pos_trans[0] == 2) this.transform = new Transform(pos_trans[1]);
        }
        this.rot = rot || false;
        this.flag = true;
    };
    diamond.prototype.init = function () {
        var coll = collection[this.vers];

        if (!buffers[this.vers]) {
            var buf = diamond_model(coll.rat,coll.c1,coll.c2);
            var arrays = {
                pos: {numComponents: 3, data: buf.poi},
                norm: {numComponents: 3, data: buf.norm},
                col: {numComponents: 3, data: buf.col},
                Texc: {numComponents: 2, data: buf.Texc}
            };
            buffers[this.vers] = twgl.createBufferInfoFromArrays(gl, arrays);
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
    diamond.prototype.setflag = function(f) {
        this.flag = f;
    }
    diamond.prototype.draw = function (ts) {
        var theta = Number(drawingState.realtime)/200.0;

        var trans = new Transform(ts);
        if(this.flag){
            if (this.position) trans.trans(m4.translation(this.position), true);
            if (this.transform) trans.trans_By_LTrans(this.transform);
        }
        if(this.rot) trans.trans(m4.rotationY(theta));
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            tview: drawingState.view, tproj: drawingState.proj, dlight: drawingState.sunDirection,
            tmodel: trans.get_Trans() ,tnorm: trans.get_Tnorm(),lview: drawingState.lview, lproj: drawingState.lproj
            ,flag: this.flag?0.0:2.0
        });
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers[this.vers]);
        for(var i = 0;i < image.length;i++){
            gl.activeTexture(gl["TEXTURE"+i]);
            gl.bindTexture(gl.TEXTURE_2D, textures[i].s);
            gl.uniform1i(textures[i].ts, i);
        }
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers[this.vers]);
    };
}());


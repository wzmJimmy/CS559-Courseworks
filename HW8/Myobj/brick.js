var brick;

(function() {
    "use strict";

    var r3 = Math.sqrt(3);
    var r2 = Math.sqrt(2);

    //buffer model for sphere of radius=1, bound=bd, color is gradient from c1 to c2
    function brick_model(rat0, c1, c2, rat) {
        var rat = rat || 1.2;
        var c1 = c1 || [1,1,0];
        var c2 = c2 || [1,192/255,0];

        var buf = {poi:[],norm:[],col:[],Texc:[]};

        var h = rat0*rat;
        var xu = 1-rat0;

        var v = [0,2,1, 1,2,3, 2,4,3, 3,4,5, 4,6,5, 5,6,7, 6,0,7, 7,0,1, 1,3,5, 1,5,7, 0,4,2, 0,6,4];
        var point =[[1, 0, 0], [xu, h, 0], [0, 0, -1], [0, h, -xu], [-1, 0,  0], [-xu, h, 0], [0, 0,  1], [0, h, xu]];
        var text = [[0,0],[0,1],[1,0],[1,1]];
        var v2 = [[1,3,0,0,3,2],[0,3,2,0,1,3]];

        v.forEach(function (i) {
            add_A(buf.poi,point[i]);
            var col = c1;
            if(i % 2== 0) col = c2;
            add_A(buf.col,col);
        })
        for(var i=1; i<v.length/6 ;i++){
            v2[0].forEach(function (ind) {add_A(buf.Texc,text[ind]);})
        }
        v2[1].forEach(function (ind) {add_A(buf.Texc,text[ind]);})

        for(var i=0; i<v.length/3;i++){
            var e1 = v3.subtract(point[v[3*i+1]],point[v[3*i]]);
            var e2 = v3.subtract(point[v[3*i+2]],point[v[3*i]]);
            var norm = v3.normalize(v3.cross(e1,e2));
            for(var j=0;j<3;j++){
                add_A(buf.norm,norm);
            }
        }
        return buf;
    }

    var c1 =  [1,1,0];
    var c4 =  [1,108/255,0];
    var c2 =  MyGradient(c1,c4,1,3);
    var c3 =  MyGradient(c1,c4,2,3);

    var shaderProgram = shader["Bump"];
    var buffers = {};
    var collection ={s1:{rat0:6/8,c1:c1,c2:c2}, s2:{rat0:6/14,c1:c2,c2:c3}, s3:{rat0:0.3,c1:c3,c2:c4}};
    var image = [Images["bump1"],Images["ATNS"]];
    var textures = undefined;

    brick = function brick(vers, size ,pos_trans) {
        this.vers = vers;
        this.size = size || 1;
        if (pos_trans) {
            if (pos_trans[0] == 1) this.position = pos_trans[1];
            if (pos_trans[0] == 2) this.transform = new Transform(pos_trans[1]);
        }
        this.flag = true;
    };
    brick.prototype.init = function () {
        var coll = collection[this.vers];

        if (!buffers[this.vers]) {
            var buf = brick_model(coll.rat0,coll.c1,coll.c2);
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
    brick.prototype.setflag = function(f) {
        this.flag = f;
    }
    brick.prototype.draw = function (ts) {
        var trans = new Transform(ts);
        if(this.flag){
            if (this.position) trans.trans(m4.translation(this.position), true);
            if (this.transform) trans.trans_By_LTrans(this.transform);
        }
        trans.trans(m4.scaling([this.size, this.size, this.size]));

        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            tview: drawingState.view, tproj: drawingState.proj, dlight: drawingState.sunDirection,
            tmodel: trans.get_Trans() ,tnorm: trans.get_Tnorm(),lview: drawingState.lview, lproj: drawingState.lproj
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


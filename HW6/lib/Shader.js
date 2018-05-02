function Shader(varlist,conslist, pdict,id) {
    this.varlist = varlist;
    this.conslist = conslist;
    this.vparts =  pdict.Vpart;
    this.cpart =  pdict.Cpart;

    this.id = id;
    this.shaderProgram = gl.createProgram();
    this.sp = {};
    this.buffers = {};
    this.init_Program();
    this.set_VarPointer();
}
Shader.prototype.init_Program = function() {
    var pg = this.shaderProgram;

    var vertexSource = document.getElementById(this.id[0]).text;
    var fragmentSource = document.getElementById(this.id[1]).text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(1);
        alert(gl.getShaderInfoLog(vertexShader)); return null; }

    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(2);
        alert(gl.getShaderInfoLog(fragmentShader)); return null; }

    // Attach the shaders and link
    gl.attachShader(pg, vertexShader);
    gl.attachShader(pg, fragmentShader);
    gl.linkProgram(pg);
    if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) {
        alert(3);
        alert("Could not initialize shaders"); }
}

Shader.prototype.set_VarPointer = function() {
    var sp = this.sp;
    var pg = this.shaderProgram;

    sp.VBuffer ={};
    this.varlist.VBuffer.forEach(function (name) {
        sp.VBuffer[name] = gl.getAttribLocation(pg, name);
        gl.enableVertexAttribArray(sp.VBuffer[name]);
    });

    sp.Vuniform ={};
    for (x in this.varlist.uniform){
        sp.Vuniform[x] = {};
        this.varlist.uniform[x].forEach(function (name) {
            sp.Vuniform[x][name] = gl.getUniformLocation(pg,name);
        })
    }

    sp.Cuniform ={};
    for (x in this.conslist){
        sp.Cuniform[x] = {};
        this.conslist[x].forEach(function (name) {
            sp.Cuniform[x][name] = gl.getUniformLocation(pg,name);
        })
    }
    //console.log(sp);
}
Shader.prototype.use_Program = function() {
    gl.useProgram(this.shaderProgram);
}
Shader.prototype.passData = function() {
    var ibuffer = this.varlist.IBuffer;
    var vbuffer = this.varlist.VBuffer;
    var buffers = this.buffers;

    for(x in this.vparts) {
        var vpart = this.vparts[x];
        var buffer = {};

        buffer[ibuffer] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer[ibuffer]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vpart.buffers[ibuffer]), gl.STATIC_DRAW);


        vbuffer.forEach(function (name) {
            buffer[name] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer[name]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array (vpart.buffers[name]), gl.STATIC_DRAW);
        });

        buffers[x] = buffer;
    }
}

//default as drawing triangle.
Shader.prototype.render = function() {
    var sp = this.sp;
    var uniform = this.varlist.uniform;

    var consts = this.cpart.consts;
    for(x in this.conslist){
        this.conslist[x].forEach(function (y) {
            switch (x){
                case "Matrix": gl.uniformMatrix4fv(sp.Cuniform.Matrix[y],false,new Float32Array (consts[y])); break;
                case "Vec3": gl.uniform3fv(sp.Cuniform.Vec3[y], new Float32Array (consts[y])); break;
                case "Num": gl.uniform1f(sp.Cuniform.Num[y], consts[y]); break;
            }
        });
    }

    for (part_name in this.vparts){
        var buffer = this.buffers[part_name];
        var vpart = this.vparts[part_name];

        this.varlist.VBuffer.forEach(function (name) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer[name]);
            gl.vertexAttribPointer(sp.VBuffer[name], 3, gl.FLOAT, false, 0, 0);
        });

        for(x in uniform){
            uniform[x].forEach(function (y) {
                switch (x){
                    case "Matrix": gl.uniformMatrix4fv(sp.Vuniform.Matrix[y],false,new Float32Array (vpart.uniforms[y])); break;
                    case "Vec3": gl.uniform3fv(sp.Vuniform.Vec3[y], new Float32Array (vpart.uniforms[y])); break;
                }
            });
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer[this.varlist.IBuffer]);
        gl.drawElements(gl.TRIANGLES, vpart.buffers[this.varlist.IBuffer].length, gl.UNSIGNED_SHORT, 0);
    }
}

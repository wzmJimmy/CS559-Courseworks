
function Shader(attribute,unifrom) {
    this.shaderProgram = gl.createProgram();
    this.attribute = attribute;
    this.uniform = unifrom;
}


Shader.prototype.createProgramInfo = function(id0) {
    var id = id0 ||["vs", "fs"];
    var pg = this.shaderProgram;

    var vertexSource = document.getElementById(id[0]).text;
    var fragmentSource = document.getElementById(id[1]).text;

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
    gl.useProgram(pg);
};

Shader.prototype.activate = function() {
    var pg = this.shaderProgram;

    pg.Attribute =[];
    Object.keys(this.attribute).forEach(function (name) {
        var Attribute = gl.getAttribLocation(pg, name);
        gl.enableVertexAttribArray(Attribute);
        pg.Attribute.push(Attribute);
    });
    pg.Matrix =[];
    Object.keys(this.uniform.matrix).forEach(function (name) {
        var matrix = gl.getUniformLocation(pg,name);
        pg.Matrix.push(matrix);
    });
    pg.Vec3 =[];
    Object.keys(this.uniform.vec3).forEach(function (name) {
        var vec3= gl.getUniformLocation(pg,name);
        pg.Vec3.push(vec3);
    });
};

Shader.prototype.draw = function() {
    var pg = this.shaderProgram;
    var size =3;
    var buffer =[];

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(var i=0;i<Object.keys(this.attribute).length;i++){
        buffer[i]= gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, this.attribute[Object.keys(this.attribute)[i]], gl.STATIC_DRAW);
        gl.vertexAttribPointer(pg.Attribute[i], size, gl.FLOAT, false, 0, 0);
    }
    var matrix = this.uniform.matrix;
    for(var i=0;i<pg.Matrix.length;i++){
        gl.uniformMatrix4fv(pg.Matrix[i],false,matrix[Object.keys(matrix)[i]]);
    }
    var vec3 = this.uniform.vec3;
    for(var i=0;i<pg.Vec3.length;i++){
        gl.uniform3fv(pg.Vec3[i], vec3[Object.keys(vec3)[i]]);
    }
    gl.drawArrays(gl.TRIANGLES, 0, this.num);
    buffer.forEach(function (t) { gl.deleteBuffer(t); })
};
Shader.prototype.setA_U = function(attribute, unifrom){
    this.attribute = attribute; //sallow copy
    this.uniform = unifrom; //sallow copy
    this.num  = this.attribute[Object.keys(this.attribute)[0]].length/3;
}

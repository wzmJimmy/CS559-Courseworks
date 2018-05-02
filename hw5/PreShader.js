function PreShader() {
    this.vertexs = [];
    this.colors =[];
    this.norms = [];
    this.tc = [];
    this.tp = [];
    //this.tmcp = [];
    this.tnorm = [];
    this.light = [];
    this.attr = {pos:[], color:[],norm:[]};
    this.unif = {matrix:{tc: [],tp: [],tnorm:[]},vec3:{light:[]}};
    this.shader = new Shader(this.attr,this.unif);
    this.shader.createProgramInfo();
    this.shader.activate();
}
PreShader.prototype.clear = function() {
    this.vertexs = [];
    this.colors =[];
    this.norms = [];
};
PreShader.prototype.setTc = function(tc) {this.tc = tc;};
PreShader.prototype.setTp = function(tp) {this.tp = tp;};
//PreShader.prototype.setTmcp = function(tmcp) {this.tmcp = tmcp;};
PreShader.prototype.setLight = function(light) {this.light = new Float32Array (light);};
PreShader.prototype.setTnorm = function(tnorm) {this.tnorm = tnorm;};
PreShader.prototype.addvertex = function(vtx,col,nom) {
    for(var i=0;i<3;i++){
        this.vertexs.push(vtx[i]);
        this.colors.push(col[i]);
        this.norms.push(nom[i]);
    }
};
PreShader.prototype.render = function() {
    var v = new Float32Array (this.vertexs);
    var c = new Float32Array (this.colors);
    var n = new Float32Array (this.norms);
    var attr = {pos:v, color:c,norm:n};
    var unif = {matrix:{tc: this.tc,tp: this.tp,tnorm:this.tnorm},vec3:{light: this.light}};
    this.shader.setA_U(attr,unif);
    this.shader.draw();
};


function Scene(varlist,constlist,id0) {
    var id = id0 ||["vs","fs"];
    this.varlist = varlist  || {IBuffer:"index", VBuffer:["posit","color","norma"], uniform:{Matrix:["tmc","tn"]}};
    this.conslist = constlist || {Matrix:["tp"],Vec3:["slight","dlight"],Num:["time","flag"]};
    this.pdict = {Cpart:new CPart(),Vpart:{}};
    this.shader = new Shader(this.varlist,this.conslist,this.pdict,id);
    this.currentPart = {};
}
Scene.prototype.set_CurrentPart = function(key){
    this.currentPart = this.pdict.Vpart[key];
};
Scene.prototype.new_Part = function(key){
    this.pdict.Vpart[key] = new VPart(this.varlist);
    this.set_CurrentPart(key);
};
Scene.prototype.append_VBuffer = function(buffers){
    var VBuffer = this.varlist.VBuffer;

    for(var i=0;i<buffers.length;i++){
        this.currentPart.append_Buffer(VBuffer[i],buffers[i]);
    }
};
Scene.prototype.append_IBuffer = function(buffer){
    var IBuffer = this.varlist.IBuffer;

    this.currentPart.append_Buffer(IBuffer,buffer);
};
Scene.prototype.get_Indexbase = function(buffer){
    return this.currentPart.buffers[this.varlist.VBuffer[1]].length/3;
};
Scene.prototype.set_Uniform = function(key, uni){
    this.currentPart.set_Uniform(key, uni);
};
Scene.prototype.set_Consts = function(key, uni){
    this.pdict.Cpart.set_Consts(key, uni);
};
Scene.prototype.draw_Scene = function(key){
    //console.log(this.pdict);
    this.shader.use_Program();
    this.shader.render();
};
Scene.prototype.start_PassData = function(key){
    this.shader.passData();
};

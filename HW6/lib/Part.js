function VPart(varlist) {
    this.buffers = {};
    this.uniforms = {};

    this.buffers[varlist.IBuffer] = [];
    var that = this;
    varlist.VBuffer.forEach(function (name) { that.buffers[name] = []; });
}
VPart.prototype.set_Uniform = function(key, uni){
    this.uniforms[key] = uni;
}
VPart.prototype.append_Buffer = function(key, buf){
    var buffers = this.buffers;
    buf.forEach(function (x) { buffers[key].push(x); });
}

function CPart() {
    this.consts = {};
}
CPart.prototype.set_Consts = function(key, uni){
    this.consts[key] = uni;
}
function Transform() {
    this.ttrans = [m4.identity()];
    this.ttrans_NoT = [m4.identity()];
    this.flag = true;
}
Transform.prototype.trans = function(M, ft){
    var Th = this.ttrans.pop();
    var f = ft || false;

    this.ttrans.push(m4.multiply(M,Th));
    if(!f) {
        var Th2 = this.ttrans_NoT.pop();
        this.ttrans_NoT.push(m4.multiply(M,Th2));
    }
};
Transform.prototype.trans_ByTrans = function(Trans){
    var ts = Trans.get_Trans();
    var tn = Trans.get_Tnorm();
    var Th = this.ttrans.pop();
    var Th2 = this.ttrans_NoT.pop();

    this.ttrans.push(m4.multiply(ts,Th));
    this.ttrans_NoT.push(m4.multiply(tn,Th2));
};
Transform.prototype.save = function(){
    var Th = this.ttrans.pop();
    var Th2 = this.ttrans_NoT.pop();

    this.ttrans.push(Th);
    this.ttrans.push(Th);
    this.ttrans_NoT.push(Th2);
    this.ttrans_NoT.push(Th2);
};
Transform.prototype.restore = function(){
    this.ttrans.pop();
    this.ttrans_NoT.pop();
};
Transform.prototype.clear = function(){
    this.ttrans = [];
    this.ttrans_NoT = [];
};
Transform.prototype.get_Trans = function(){
    var Th = this.ttrans.pop();
    this.ttrans.push(Th);

    return Th;
};
Transform.prototype.get_Tnorm = function(){
    if(this.flag){
        var Th2 = this.ttrans_NoT.pop();
        this.ttrans_NoT.push(Th2);
        return m4.transpose(m4.inverse(Th2));
    }else {
        var Th = this.ttrans.pop();
        this.ttrans.push(Th);
        return m4.transpose(m4.inverse(Th));
    }
};

// This Mypainter part realize painter's algorithm with
// embedded uniform transform and point or vector light
// shading. It has the following functions:
//  MyPainter()  Constructor
//  clear(); polygon(); setTcpv();
//  setLight(); wireframe(); render().
//
// *** To be consistent with webgl implemtent of ortho
// and perspective, we treat smaller z value as nearer
// position to the camera. ***

"use strict";
var m4 = twgl.m4;
var v3 = twgl.v3;

function Rgba(c) {
    return "rgba("+Math.round(c[0])+","+Math.round(c[1])+","+Math.round(c[2])+","+c[3]+")";
}

// Instead of triangles, Mypainter store polygons and sort by the mean of z
// value. It also store a camera to viewport transfer @Tcpv and a lighting
// transfer pair @vp and @fPoi which are supposed to be uniform in the whole
// screen and could be reset by set-function.
function MyPainter(canvas, TCam_Pro_View, vp , Vec_or_Poi, context) {
    this.polygons = [];
    this.canvas = canvas;
    this.Tcpv = TCam_Pro_View || m4.identity();
    this.vp = vp;
    this.fPoi = Vec_or_Poi;
    this.context = context || this.canvas.getContext('2d');
}

//empties the storing of  polygons
MyPainter.prototype.clear = function() {
    this.polygons = [];
};
//set-function for @Tcpv
MyPainter.prototype.setTcpv = function(TCam_Pro_View) {
    this.Tcpv = TCam_Pro_View
};
MyPainter.prototype.getTcpv = function() {
    return this.Tcpv ;
};
//set-function for @vp and @fPoi
MyPainter.prototype.setLight = function(vp , Vec_or_Poi) {
    this.vp = vp;
    this.fPoi = Vec_or_Poi;
};

// Main processing part: try to add lighting effect and
// transform into the function of storing polygons.
// Input are expected to be @vs, the set of vertexs.
// @fill, fillColor in rgba array, default to be [0,0,255,1].
// @stroke, strokeColor in rgba, default as [0,0,0,1].
//
// *** The lignting assume all polygon counter-clockwise to
// outside viewpoint. ***
MyPainter.prototype.polygon = function(vs, fill, stroke){
    var num = vs.length;
    var fill0 = DeepCopy(fill) || [0,0,255,1];

    function avg(vs, dem) {
        var s = 0;
        vs.forEach(function (v) { s = s + v[dem]; });
        return s/num;
    }

    var e1 = v3.subtract(vs[1],vs[0]);
    var e2 = v3.subtract(vs[num-1],vs[0]);
    var norm = v3.normalize(v3.cross(e1,e2));
    var mean = [avg(vs,0),avg(vs,1),avg(vs,2)];


    if(this.vp){
        var dir =this.vp;
        if(this.fPoi){ dir = v3.subtract(mean,dir);}
        dir = v3.normalize(dir);
        //var l = .5 - .4*v3.dot(norm,dir);
        //for(var i=0;i<3;i++) fill0[i]*=l;

        //alert([0,fill]);
        var l = -v3.dot(norm,dir);
        var a=0.75;
        for(var i=0;i<3;i++) fill0[i] = (l<=0? fill0[i]*(l+1) : (255-fill0[i])*l*a+fill0[i]); //(fill0[i]/255)
        //alert(l);
        //alert([1,fill0]);
    }

    var vs0 = [];
    for(var i=0;i<num;i++) {vs0[i]=m4.transformPoint(this.Tcpv,vs[i])}


    this.polygons.push(
        {
            "vs" : vs0, // assume it's counter-clockwise.
            "num" : num,
            "fill" : fill0,
            "stroke" : DeepCopy(stroke) || [0,0,0,1],
            "zavg" : avg(vs0,2),
            "norm" : norm
        }
    )
};

// Alternative choice to draw polygons as wireframe
MyPainter.prototype.wireframe = function()
{
    var that=this;
    this.polygons.forEach(function(t){
        that.context.strokeStyle = t.stroke;
        that.context.beginPath();
        that.context.moveTo(t.vs[0][0], t.vs[0][1]);
        for(var i=1;i<t.num;i++){that.context.lineTo(t.vs[i][0], t.vs[i][1]);}
        that.context.closePath();
        that.context.stroke();
    });
};

// Main part of painter's Algorithm.
//
//*** This sort function sort z values in descending order.***
MyPainter.prototype.render = function(nosort)
{
    var that = this;
    if (!nosort) {
        this.polygons.sort(function (a, b) {
            if (a.zavg > b.zavg) {
                return -1;
            } else {
                return 1;
            }
        });
    } else {
        // console.log("Not Sorting");
    }
    this.polygons.forEach(function (t) {
        that.context.beginPath();
        that.context.fillStyle = Rgba(t.fill);
        //alert(Rgba(t.fill));
        // it is an error to set this to undefined - even though it works
        that.context.strokeStyle = t.stroke;
        that.context.moveTo(t.vs[0][0], t.vs[0][1]);
        for(var i=1;i<t.num;i++){that.context.lineTo(t.vs[i][0], t.vs[i][1]);}
        that.context.closePath();
        that.context.fill();
    });
};

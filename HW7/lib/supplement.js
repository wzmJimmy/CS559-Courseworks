var m4 = twgl.m4;
var v3 = twgl.v3;
var grobjects = {};
var drawingState = {};

function MyGradient(c1,c2,ind,_boundNum) {
    var col=[0,0,0];
    for(var i=0;i<3;i++){col[i]=c1[i]+(c2[i]-c1[i])*ind/(_boundNum)}
    return col;
}

function add_A(arr0,arr1) {
    arr1.forEach(function (v) { arr0.push(v); });
}

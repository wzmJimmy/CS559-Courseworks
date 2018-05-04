var m4 = twgl.m4;
var v3 = twgl.v3;
var grobjects = {};
var reflaction = {};
var drawingState = {};
var shader = {};

var log = console.log;

var canvas = document.createElement("canvas");
canvas.setAttribute("width",1200);
canvas.setAttribute("height",720);
document.body.appendChild(canvas);

// this could be gl = canvas.getContext("webgl");
// but twgl is more robust
var gl = twgl.getWebGLContext(canvas);

var target = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];


function MyGradient(c1,c2,ind,_boundNum) {
    var col=[0,0,0];
    for(var i=0;i<3;i++){col[i]=c1[i]+(c2[i]-c1[i])*ind/(_boundNum)}
    return col;
}
function frac(a,b) {
    var c = Math.floor(a/b);
    return a-c*b;
}

function add_A(arr0,arr1) {
    arr1.forEach(function (v) { arr0.push(v); });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function advance_unif(obj) {
    if ( !obj.basicTime || drawingState.count%150==0) {
        obj.basicTime= drawingState.realtime;
        obj.state = 0;
        return;
    }
    var delta = (drawingState.realtime - obj.basicTime);

    var vx = Math.sin(obj.orientation);
    var vz = Math.cos(obj.orientation);

    obj.position[0] =  obj.position0[0] + delta * vx * obj.speed;
    obj.position[2] =  obj.position0[2] + delta * vz * obj.speed;

}


//creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
//it's mostly going to be a try it once, flip if you need to.
var createGLTexture = function (gl, image, flipY) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if(flipY){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}
/*
image = [posx,negx,posy,negy,posz,negz];
];
*/

var createCubeGLTexture = function (gl, image, flipY) {
    var img = image;
    if(!image.length){
        var images = [];
        for(var i=0; i<6; i++) images.push(image);
        img = images;
    }

    var cubetexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubetexture);
    if(flipY){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    for (var j = 0; j < 6; j++) {
        gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    return cubetexture;
}

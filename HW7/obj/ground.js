/**
 * Created by gleicher on 10/9/2015.
 */


var ground;

// now, I make a function that adds an object to that list
// there's a funky thing here where I have to not only define the function, but also
// run it - so it has to be put in parenthesis
(function() {
    "use strict";
    var groundPlaneSize = groundPlaneSize || 5;

    // putting the arrays of object info here as well
    var vertexPos = [
        -groundPlaneSize, 0, -groundPlaneSize,
         groundPlaneSize, 0, -groundPlaneSize,
         groundPlaneSize, 0,  groundPlaneSize,
        -groundPlaneSize, 0, -groundPlaneSize,
         groundPlaneSize, 0,  groundPlaneSize,
        -groundPlaneSize, 0,  groundPlaneSize
    ];

    // since there will be one of these, just keep info in the closure
    var shaderProgram = undefined;
    var buffers = undefined;

    ground = {
        // first I will give this the required object stuff for it's interface
        // note that the init and draw functions can refer to the fields I define
        // below

        init : function() {
            // an abbreviation...
            var gl = drawingState.gl;
            if (!shaderProgram) {
                shaderProgram = twgl.createProgramInfo(gl,["ground-vs","ground-fs"]);
            }
            var arrays = { vpos : {numComponents:3, data:vertexPos }};
            buffers = twgl.createBufferInfoFromArrays(gl,arrays);
       },
        setflag : function (f) {
            //
        },
        draw : function() {
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
            twgl.setUniforms(shaderProgram,{
                view:drawingState.view, proj:drawingState.proj
            });
            twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
        },
    };

    // now that we've defined the object, add it to the global objects list
})();
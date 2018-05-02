/**
 * Created by gleicher on 10/9/2015.
 */

/*
this is the "main" file - it gets loaded last - after all the objects are loaded
make sure that twgl is loaded first

it sets up the main function to be called on window.onload

 */

 var isValidGraphicsObject = function (object) {
    if(typeof object.draw !== "function" && typeof object.drawAfter !== "function") {
        console.log("warning: GraphicsObject of type " + object.name + " does not contain either a draw or drawAfter method");
        return false;
    }
    if(typeof object.init !== "function") {
        console.log("warning: GraphicsObject of type " + object.name + " does not contain an init method. ");
        return false;
    }

    return true;
 }

window.onload = function() {
    "use strict";

    // set up the canvas and context
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width",600);
    canvas.setAttribute("height",600);
    document.body.appendChild(canvas);

    // make a place to put the drawing controls - a div
    var controls = document.createElement("DIV");
    controls.id = "controls";
    document.body.appendChild(controls);

    // a switch between camera modes
    var uiMode = document.createElement("select");
    uiMode.innerHTML += "<option>ArcBall</option>";
    uiMode.innerHTML += "<option>Drive</option>";
    uiMode.innerHTML += "<option>Fly</option>";
    //uiMode.innerHTML += "</select>";
    controls.appendChild(uiMode);

    var resetButton = document.createElement("button");
    resetButton.innerHTML = "Reset View";
    resetButton.onclick = function() {
        // note - this knows about arcball (defined later) since arcball is lifted
        arcball.reset();

        drivePos = [0,.2,5];
        driveTheta = 0;
        driveXTheta = 0;

    }
    controls.appendChild(resetButton);

    // make some checkboxes - using my cheesy panels code
    var checkboxes = makeCheckBoxes([ ["Run",1], ["Examine",0] ]);

    // a selector for which object should be examined
    var toExamine = document.createElement("select");
    for(var name in grobjects){
        toExamine.innerHTML +=  "<option>" + name + "</option>";
    }
    controls.appendChild(toExamine);

    // make some sliders - using my cheesy panels code
    var sliders = makeSliders([["TimeOfDay",0,24,4]]);

    // this could be gl = canvas.getContext("webgl");
    // but twgl is more robust
    var gl = twgl.getWebGLContext(canvas);

    // information for the cameras
    var lookAt = [0,0,0];
    var lookFrom = [0,4,-10];
    var fov = 1.1;

    var arcball = new ArcBall(canvas);

    // for timing
    var realtime = 0
    var lastTime = Date.now();

    // parameters for driving
    var drivePos = [0,.2,5];
    var driveTheta = 0;
    var driveXTheta = 0;

    // cheesy keyboard handling
    var keysdown = {};

    document.body.onkeydown = function(e) {
        var event = window.event ? window.event : e;
        keysdown[event.keyCode] = true;
        e.stopPropagation();
    };
    document.body.onkeyup = function(e) {
        var event = window.event ? window.event : e;
        delete keysdown[event.keyCode];
        e.stopPropagation();
    };

    var lastS = true;

    // the actual draw function - which is the main "loop"
    function draw() {
        // advance the clock appropriately (unless its stopped)
        var curTime = Date.now();
        if (checkboxes.Run.checked) {
            realtime += (curTime - lastTime);
        }
        lastTime = curTime;

        // first, let's clear the screen
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // figure out the transforms
        var projM = m4.perspective(fov, 1, 0.1, 100);
        var cameraM = m4.lookAt(lookFrom,lookAt,[0,1,0]);
        var viewM = m4.inverse(cameraM);

        // implement the camera UI
        if (uiMode.value == "ArcBall") {
            viewM = arcball.getMatrix();
            //viewM = m4.multiply(viewM,m4.translation([0, 0, -10]));
            m4.setTranslation(viewM, [0, 0, -10], viewM);
        } else if (uiMode.value == "Drive") {/**wsad**/
            if (keysdown[65]) { driveTheta += .02; } /*a?d?*/
            if (keysdown[68]) { driveTheta -= .02; } /*a?d?*/
            if (keysdown[87]) {
                var dz = Math.cos(driveTheta);
                var dx = Math.sin(driveTheta);
                drivePos[0] -= .05*dx;
                drivePos[2] -= .05*dz;
            }
            if (keysdown[83]) {
                var dz = Math.cos(driveTheta);
                var dx = Math.sin(driveTheta);
                drivePos[0] += .05*dx;
                drivePos[2] += .05*dz;
            }

            cameraM = m4.rotationY(driveTheta);  /*???*/
            m4.setTranslation(cameraM, drivePos, cameraM);
            viewM = m4.inverse(cameraM);
        }else if (uiMode.value == "Fly") {

            if (keysdown[65] || keysdown[37]) { 
                driveTheta += .02; 
            }else if (keysdown[68] || keysdown[39]) { 
                driveTheta -= .02; 
            }

            if (keysdown[38]) { driveXTheta += .02; }
            if (keysdown[40]) { driveXTheta -= .02; }

            var dz = Math.cos(driveTheta);
            var dx = Math.sin(driveTheta);
            var dy = Math.sin(driveXTheta);

            if (keysdown[87]) {
                drivePos[0] -= .25*dx;
                drivePos[2] -= .25*dz;
                drivePos[1] += .25 * dy;
            }

            if (keysdown[83]) {
                drivePos[0] += .25*dx;
                drivePos[2] += .25*dz;
                drivePos[1] -= .25 * dy;
            }

            cameraM = m4.rotationX(driveXTheta); /*???*/
            m4.multiply(cameraM, m4.rotationY(driveTheta), cameraM);
            m4.setTranslation(cameraM, drivePos, cameraM);
            viewM = m4.inverse(cameraM);
        }

        // get lighting information         /*fix*/
        var tod = Number(sliders.TimeOfDay.value);
        var sunAngle = Math.PI * (tod-6)/12;
        var sunDirection = [Math.cos(sunAngle),Math.sin(sunAngle),0];

        // make a real drawing state for drawing
        drawingState = {
            gl : gl,
            proj : projM,   // m4.identity(),
            view : viewM,   // m4.identity(),
            timeOfDay : tod,
            sunDirection : sunDirection,
            realtime : realtime
        }

        // initialize all of the objects that haven't yet been initialized (that way objects can be added at any point)
        for(var name in grobjects){
            var obj = grobjects[name];
            if(!obj.__initialized) {
                if(isValidGraphicsObject(obj)){
                    obj.init();
                    obj.__initialized = true;
                }
            }
        }

        //console.log(grobjects);

        // now draw all of the objects - unless we're in examine mode
        if (checkboxes.Examine.checked) {
            var examined = grobjects[toExamine.value];
            examined.setflag(false);
            examined.draw();

            lastS = false;

        } else {
            for(var obj in grobjects){
                grobjects[obj].draw();
                if(!lastS) grobjects[obj].setflag(true);
            }

            if(!lastS) lastS = true;
        }
        window.requestAnimationFrame(draw);
    };
    draw();
};

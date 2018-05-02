var alpha=0.5; //A trick use to mimic texture.
var Ortho=true; //whether orthographic or not.

//Function to change Ortho.
function ViewChange(){
    Ortho=!Ortho;
}

//Function for give the sphere a series
// of color which easy to distinguish.
function MyGradient(c1,c2,ind,_boundNum) {
    var col=[0,0,0,alpha];
    for(var i=0;i<3;i++){col[i]=Math.round(c1[i]+(c2[i]-c1[i])*ind/(_boundNum*_boundNum))};
    return "rgba("+col[0]+","+col[1]+","+col[2]+","+col[3]+")";
}

//In case of overstack.
function mod_2Pi( num) {
    if(num<0) num = -num;
    if(num > Math.PI*2) return num - Math.PI*2;
    return num;
}

//Main function to draw the 3D-terra system.
function Tera3D() { "use strict";
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var m4 = twgl.m4;

    //Sliders for eye position, zoom size, and MoonNum.
    var slider1 = document.getElementById('RotZ');
    slider1.value = -100;
    var slider2 = document.getElementById('Zoom');
    slider2.value = 2;
    var slider3 = document.getElementById('Moon');
    slider3.value = 3;

    //Start angle foe each part.
    var angle2 = 0;
    var anglem_roll = 0;
    var anglem_rota = 0;
    var anglem2_roll = Math.PI/6;
    var anglem2_rota = Math.PI/7;
    var anglem3_roll = Math.PI/8;
    var anglem3_rota = Math.PI/9;
    var angles_roll = Math.PI/2;
    var angles_rota = Math.PI/3;

    //Fuction copy from example with a little adjust.
    function moveToTx(loc,Tx) {
        var locTx = m4.transformPoint(Tx,loc);
        context.moveTo(locTx[0],locTx[1]);
    }
    function lineToTx(loc,Tx) {
        var locTx = m4.transformPoint(Tx,loc);
        context.lineTo(locTx[0],locTx[1]);
    }

    //Function for drawing a colored sphere.//

    //Tried to simulate texture in WebGl but
    //failed due to lack of necessary knowledge.
    function DrawSphere(Tx,radius,c1,c2,_boundNum) {
        var position = []; //Store sample vertices.

        //var back = [];
        //try to decide which is front and which is back but failed.

        for(var lati=0;lati<=_boundNum; lati++){
            var lat = lati*Math.PI/_boundNum-Math.PI/2;
            for(var loni=0;loni<=_boundNum; loni++){
                var lon = loni*2*Math.PI/_boundNum-Math.PI;
                var x = radius*Math.cos(lat)*Math.cos(lon);
                var z = radius*Math.cos(lat)*Math.sin(lon);
                var y = radius*Math.sin(lat);
                var point = [x,y,z];
                position.push(point);
            }
        }
        //color each sample square with a gradient coloration.
        for(var lati=0;lati<_boundNum; lati++){
            //context.fillStyle=MyGradient(c1,c2,lati,_boundNum);
            for(var loni=0;loni<_boundNum; loni++){
                context.fillStyle=MyGradient(c1,c2,lati*_boundNum+loni,_boundNum);
                var first = lati*(_boundNum+1)+loni;
                var second = first+_boundNum+1;
                var rect = [first,first+1,second+1,second];
                moveToTx( position[first],Tx);
                lineToTx( position[first+1],Tx);
                lineToTx( position[second+1],Tx);
                lineToTx( position[second],Tx);
                lineToTx( position[first],Tx);
                //context.stroke();
                context.fill();
            }
        }
    }

    function draw() {
        // hack to clear the canvas fast
        canvas.width = canvas.width;
        var len = canvas.width/2;

        //????--slider.value is string,
        //we need another variable to transfer?
        var angle1 = slider1.value*Math.PI/180;
        var zoom = 5/8+slider2.value/8;
        var num = slider3.value*1;
        var len0 = Math.round(len*zoom);

        //define the rotating speed.
        angle2 = mod_2Pi(angle2+Math.PI/40);
        anglem_roll = mod_2Pi(anglem_roll+Math.PI/60);
        anglem_rota = mod_2Pi(anglem_rota+Math.PI/120);
        anglem2_roll = mod_2Pi(anglem2_roll+Math.PI/55);
        anglem2_rota = mod_2Pi(anglem2_rota+Math.PI/110);
        anglem3_roll = mod_2Pi(anglem3_roll+Math.PI/65);
        anglem3_rota = mod_2Pi(anglem3_rota+Math.PI/130);
        angles_roll = mod_2Pi(angles_roll+Math.PI/20);
        angles_rota = mod_2Pi(angles_rota+Math.PI/40);


        //Basic Cameraview transform.
        var eye = [700*Math.cos(angle1),400,700*Math.sin(angle1)];
        var target = [0,0,0];
        var up = [0,1,0];
        var Tcamera = m4.inverse(m4.lookAt(eye,target,up));

        //Switch Ortho of Persp
        if(Ortho) {var Tprojection = m4.ortho(-350,350,-350,350,-350,350);}
        else {var Tprojection = m4.perspective(Math.PI/3,1,5,400);}

        //Basic Tviewport and Tcpv.
        var Tviewport = m4.multiply(m4.scaling([len0,-len0,len0]),m4.translation([len,len,0]));
        var Tcpv = m4.multiply(m4.multiply(Tcamera,Tprojection),Tviewport);

        //Draw the earth.
        var axis1_1 = [-1,0,1];
        var TEbase = m4.axisRotation(axis1_1,Math.PI/6);
        var axis1_2 = [0,1,0];
        var TE = m4.multiply(m4.axisRotation(axis1_2,angle2),TEbase);
        var Tearth = m4.multiply(TE,Tcpv);
        DrawSphere(Tearth,150,[255,0,0],[0,255,0],20);

        //A function to  draw similar moon.
        function DrawMoon(rad,angle,radius,c1,c2,_boundNum) {
            var axis2_1 = [-1,0,1];
            var Tbase = m4.multiply(m4.translation([rad*Math.cos(anglem_rota),rad*Math.sin (anglem_rota),0]),m4.axisRotation(axis2_1,angle));
            var axis2_2 = [0,1,0];
            var T = m4.multiply(m4.axisRotation(axis2_2,anglem_roll),Tbase);
            var Tmoon = m4.multiply(T,Tcpv);
            DrawSphere(Tmoon,radius,c1,c2,_boundNum);
        }

        DrawMoon(250,-Math.PI/4,50,[255,0,255],[0,255,255],9);

        //control the number of moon.
        if(num>=2){
            var axis3_1 = [1,0,1];
            var rad1 = 200;
            var TSbase = m4.multiply(m4.translation([rad1*Math.cos(angles_rota),rad1*Math.sin (angles_rota),0]),m4.axisRotation(axis3_1,-Math.PI/7));
            var axis3_2 = [0,1,0];
            var TS=m4.multiply(m4.axisRotation(axis3_2,angles_roll),TSbase);
            var Tsate=m4.multiply(TS,Tcpv);
            DrawSphere(Tsate,20,[0,0,255],[0,0,0],8);
            if(num>=3) {
                DrawMoon(230, Math.PI / 4, 45, [255, 255, 0], [0, 0, 255], 9);
                if(num>=4) {
                    DrawMoon(270, -Math.PI / 5 * 4, 60, [255, 0, 0], [0, 0, 255], 9);
                }
            }

        }

        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
}
window.onload = Tera3D;
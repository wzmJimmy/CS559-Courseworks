var lock =1;

//Main function to draw the 3D-terra system.
function Tera3D() { "use strict";
    lock =1;
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var m4 = twgl.m4;

    var painter = new MyPainter(canvas);
    var poi=[400,0,0];
    var dir=[-200,0,0];


    //Sliders for eye position, zoom size, and MoonNum.
    var wf = document.getElementById("wf");
    var ns = document.getElementById("ns");
    var op = document.getElementById("op");
    var pv = document.getElementById("pv");
    pv.checked = true;
    var nl = document.getElementById("nl");
    var slider = document.getElementById('RotX');
    slider.value = -60;
    var slider1 = document.getElementById('RotZ');
    slider1.value = -100;
    var slider2 = document.getElementById('Zoom');
    slider2.value = 2;

    //Start angle for each part.
    var angle2 = 0;
    var anglem_roll = 0;
    var anglem_rota = 0;
    var anglem2_roll = Math.PI/6;
    var anglem2_rota = Math.PI/7;
    var anglem3_roll = Math.PI/8;
    var anglem3_rota = Math.PI/9;
    var angles_roll = Math.PI/2;
    var angles_rota = Math.PI/3;


    //Function for drawing a colored sphere.
    function DrawSphere(Tx,radius,c1,c2,_boundNum) {

        var position = []; //Store sample vertices.
        for(var lati=0;lati<=_boundNum; lati++){
            var lat = lati*Math.PI/_boundNum-Math.PI/2;
            if(lati==0) lat+=0.001;
            if(lati==_boundNum) lat-=0.001;
            for(var loni=0;loni<=_boundNum; loni++){
                var lon = loni*2*Math.PI/_boundNum-Math.PI;
                var x = radius*Math.cos(lat)*Math.cos(lon);
                var z = radius*Math.cos(lat)*Math.sin(lon);
                var y = radius*Math.sin(lat);
                var point = m4.transformPoint(Tx,[x,y,z]);
                position.push(point);
            }
        }
        for(var lati=0;lati<_boundNum; lati++){
            for(var loni=0;loni<_boundNum; loni++){
                var first = lati*(_boundNum+1)+loni;
                var second = first+_boundNum+1;
                var rect = [position[first],position[second],position[second+1],position[first+1]];
                painter.polygon(rect,MyGradient(c1,c2,lati,_boundNum));
            }
        }
    }

    function draw() {
        // hack to clear the canvas fast
        canvas.width = canvas.width;
        var len = canvas.width/2;
        painter.clear();


        var angle = slider.value*Math.PI/180;
        var angle1 = slider1.value*Math.PI/180;
        var zoom = 5/8+slider2.value/8;
        var len0 = Math.round(len*zoom);
        var speed = 3;

        //define the rotating speed.
        angle2 = mod_2Pi(angle2+Math.PI/40/speed);
        anglem_roll = mod_2Pi(anglem_roll+Math.PI/60/speed);
        anglem_rota = mod_2Pi(anglem_rota+Math.PI/120/speed);
        anglem2_roll = mod_2Pi(anglem2_roll+Math.PI/55/speed);
        anglem2_rota = mod_2Pi(anglem2_rota+Math.PI/110/speed);
        anglem3_roll = mod_2Pi(anglem3_roll+Math.PI/65/speed);
        anglem3_rota = mod_2Pi(anglem3_rota+Math.PI/130/speed);
        angles_roll = mod_2Pi(angles_roll+Math.PI/20/speed);
        angles_rota = mod_2Pi(angles_rota+Math.PI/40/speed);


        //Generate Tcpv.
        var eye = [700*Math.cos(angle1),800*Math.cos(angle),700*Math.sin(angle1)];
        var target = [0,0,0];
        var up = [0,1,0];
        var Tcamera = m4.inverse(m4.lookAt(eye,target,up));
        if(op.checked) {var Tprojection = ortho(-350,350,-350,350,5,400);}
        else {var Tprojection = m4.perspective(Math.PI/4,1,5,400);}
        var Tviewport = m4.multiply(m4.scaling([len0,-len0,len0]),m4.translation([len,len,0]));
        var Tcpv = m4.multiply(m4.multiply(Tcamera,Tprojection),Tviewport);
        painter.setTcpv(Tcpv);

        if(nl.checked){painter.setLight();}
        else {
            if(pv.checked) {painter.setLight(poi,true);}
            else {painter.setLight(dir,false);}
        }

        //Draw the earth.
        var axis1_1 = [-1,0,1];
        var TEbase = m4.axisRotation(axis1_1,Math.PI/6);
        var axis1_2 = [0,1,0];
        var TE = m4.multiply(m4.axisRotation(axis1_2,angle2),TEbase);
        DrawSphere(TE,150,[255,0,0],[0,255,0],35);

        //Draw several moon.
        function DrawMoon(rad,angle,radius,c1,c2,_boundNum) {
            var axis2_1 = [-1,0,1];
            var Tbase = m4.multiply(m4.translation([rad*Math.cos(anglem_rota),rad*Math.sin (anglem_rota),0]),m4.axisRotation(axis2_1,angle));
            var axis2_2 = [0,1,0];
            var T = m4.multiply(m4.axisRotation(axis2_2,anglem_roll),Tbase);
            DrawSphere(T,radius,c1,c2,_boundNum);
        }

        DrawMoon(250,-Math.PI/4,50,[255,0,255],[0,255,255],20);
        var axis3_1 = [1,0,1];
        var rad1 = 200;
        var TSbase = m4.multiply(m4.translation([rad1*Math.cos(angles_rota),rad1*Math.sin (angles_rota),0]),m4.axisRotation(axis3_1,-Math.PI/7));
        var axis3_2 = [0,1,0];
        var TS=m4.multiply(m4.axisRotation(axis3_2,angles_roll),TSbase);
        DrawSphere(TS,20,[0,0,255],[0,0,0],12);
        DrawMoon(230, Math.PI / 4, 45, [255, 255, 0], [0, 0, 255], 20);
        DrawMoon(270, -Math.PI / 5 * 4, 60, [255, 0, 0], [0, 0, 255], 20);

        //Decide how to draw.
        if (wf.checked) {
            painter.wireframe();
        } else {
            painter.render(ns.checked);
        }

        if(lock ==1) window.requestAnimationFrame(draw);
    }
    if(lock ==1) window.requestAnimationFrame(draw);
}
//window.onload = Tera3D;
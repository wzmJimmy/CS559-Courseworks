//Main function to draw the 3D-terra system.
function Tera() { "use strict";
    lock = 1;

    var poi=[400,0,0];
    var preshader = new PreShader();

    //Sliders for eye position, zoom size, and MoonNum.
    var op = document.getElementById("op");
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
    function DrawSphere(Tx,radius,c1,c2,_boundNum, Ttr) {

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
                position.push([x,y,z]);
            }
        }

        for(var lati=0;lati<_boundNum; lati++){
            for(var loni=0;loni<_boundNum; loni++){
                var first = lati*(_boundNum+1)+loni;
                var second = first+_boundNum+1;

                var col = [MyGradient(c1,c2,lati,_boundNum+1),MyGradient(c1,c2,lati+1,_boundNum+1)];
                var T = Ttr || m4.transpose(m4.inverse(Tx));
                var point = [[position[first],0], [position[first+1],0], [position[second],1], [position[second+1],1]];
                var list = [0,3,1,0,2,3];

                list.forEach(function (i) {
                    var pos = m4.transformPoint(Tx,point[i][0]);
                    preshader.addvertex(pos,col[point[i][1]],m4.transformPoint(T,point[i][0]));
                });
            }
        }
    }

    function draw() {
        preshader.clear();

        var angle = slider.value*Math.PI/180;
        var angle1 = slider1.value*Math.PI/180;
        var zoom = 5/8+slider2.value/8;
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
        if(op.checked) {var Tprojection = ortho(-350,350,-350,350,5,2000);}
        else {var Tprojection = m4.perspective(Math.PI/4,1,5,2000);}
        preshader.setTc(Tcamera);
        preshader.setTp(m4.multiply(Tprojection,m4.scaling([zoom,zoom,zoom])));
        preshader.setLight(poi);//m4.transformPoint(Tcamera,poi)
        preshader.setTnorm(m4.transpose(m4.inverse(Tcamera)));

        //Draw the earth.
        var axis1_1 = [-1,0,1];
        var TEbase = m4.axisRotation(axis1_1,Math.PI/6);
        var axis1_2 = [0,1,0];
        var TE = m4.multiply(m4.axisRotation(axis1_2,angle2),TEbase);
        DrawSphere(TE,150,[1,0,0],[0,1,0],35);



        //Draw several moon.
        function DrawMoon(rad,angle,roll,radius,c1,c2,_boundNum) {
            var axis2_1 = [-1,0,1];
            var Tbase = m4.multiply(m4.translation([rad*Math.cos(anglem_rota),rad*Math.sin (anglem_rota),0]),m4.axisRotation(axis2_1,angle));
            var axis2_2 = [0,1,0];
            var T = m4.multiply(m4.axisRotation(axis2_2,roll),Tbase);
            var Ttr = m4.multiply(m4.axisRotation(axis2_2,roll),m4.axisRotation(axis2_1,angle)); //???
            DrawSphere(T,radius,c1,c2,_boundNum,Ttr);
        }


        DrawMoon(250,-Math.PI/4,anglem_roll,50,[1,0,1],[0,1,1],20);

       var axis3_1 = [1,0,1];
        var rad1 = 200;
        var TSbase = m4.multiply(m4.translation([rad1*Math.cos(angles_rota),rad1*Math.sin (angles_rota),0]),m4.axisRotation(axis3_1,-Math.PI/7));
        var axis3_2 = [0,1,0];
        var TS=m4.multiply(m4.axisRotation(axis3_2,angles_roll),TSbase);
        DrawSphere(TS,20,[0,0,1],[0,0,0],12);

        DrawMoon(230, Math.PI / 4,anglem2_roll, 45, [1, 1, 0], [0, 0, 1], 20);
        DrawMoon(270, -Math.PI / 5 * 4,anglem3_roll, 60, [1, 0, 0], [0, 0, 1], 20);


        preshader.render();
        if(lock) window.requestAnimationFrame(draw);
    }
    if(lock) window.requestAnimationFrame(draw);
}
//window.onload = Tera3D;
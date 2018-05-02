//Main function to draw the 3D-terra system.
function Tera() { "use strict";
    lock = 1;

    var sl=[0,1,0];
    var dl=[0,1,0];
    var scene = new Scene();
    var transform = new Transform();

    //Sliders for eye position, zoom size, and MoonNum.
    var op = document.getElementById("op");
    var sl = document.getElementById("sl");
    var slider = document.getElementById('RotX');
    slider.value = -60;
    var slider1 = document.getElementById('RotZ');
    slider1.value = 60;
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
    function ModelSphere(name,radius,_boundNum,c1,c2) {
        scene.new_Part(name);

        for(var i=0;i<=_boundNum; i++){
            var lat = i*Math.PI/_boundNum-Math.PI/2;
            if(i==0) lat+=0.001; if(i==_boundNum) lat-=0.001;
            var col = MyGradient(c1,c2,i,_boundNum+1);

            for(var j=0;j<=_boundNum; j++){
                var lon = j*2*Math.PI/_boundNum-Math.PI;
                var x = radius*Math.cos(lat)*Math.cos(lon);
                var z = radius*Math.cos(lat)*Math.sin(lon);
                var y = radius*Math.sin(lat);
                var poi = [x,y,z];
                scene.append_VBuffer([poi, col, poi]);
            }
        }
        for(var i=0;i<_boundNum; i++) {
            for (var j = 0; j < _boundNum; j++) {
                var lu = i * (_boundNum + 1) + j;
                var ld = lu + _boundNum + 1;
                scene.append_IBuffer([lu, ld + 1, lu + 1, lu, ld, ld + 1]);
            }
        }
    }

    ModelSphere("earth",150,35,[1,0,0],[0,1,0]);
    ModelSphere("moon1",50,25,[1,0,1],[0,1,1]);
    ModelSphere("moon2",45,25,[1,1,0],[0,0,1]);
    ModelSphere("moon3",60,25,[1,0,0],[0,0,1]);
    ModelSphere("sate",20,25,[0,0,1],[0,0,0]);
    scene.start_PassData();


    function draw() {

        var angle = slider.value*Math.PI/180;
        var angle1 = slider1.value*Math.PI/180;
        var zoom = 5/8+slider2.value/8;
        var speed = 3;
        var d = new Date();
        var time = d.getTime()%1000/1000;

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

        transform.save();
        transform.trans(Tcamera);

        var axis1 = [-1,0,1];
        var axis2 = [0,1,0];

        scene.set_Consts("slight",sl);
        scene.set_Consts("dlight",dl);
        scene.set_Consts("time",time);
        scene.set_Consts("flag",sl.checked?2:0);
        scene.set_Consts("tp",m4.multiply(Tprojection,m4.scaling([zoom,zoom,zoom])));

        function trans_Cirle(name,angle,roll,rad,rota) {
            transform.save();
            transform.trans(m4.axisRotation(axis1,angle));                               //axis-incline
            if(rad) transform.trans(m4.translation([rad*Math.cos(rota),rad*Math.sin (rota),0]),true); //circle-orbit
            transform.trans(m4.axisRotation(axis2,roll));                                //self-rolling

            scene.set_CurrentPart(name);
            scene.set_Uniform("tmc",transform.get_Trans());
            scene.set_Uniform("tn",transform.get_Tnorm());
            transform.restore();
        }

        //Draw the earth.
        trans_Cirle("earth",Math.PI/6,angle2);

        //Draw moon1.
        trans_Cirle("moon1",-Math.PI/4, anglem_roll, 250, anglem_rota);
        //Draw moon2.
        trans_Cirle("moon2",Math.PI/4, anglem2_roll, 230, anglem_rota);
        //Draw moon3.
        trans_Cirle("moon3",-Math.PI/5*4, anglem3_roll, 270, anglem2_rota);
        //Draw sate.
        axis1 = [1,0,1];
        trans_Cirle("sate",-Math.PI/7, angles_roll, 200, angles_rota);


        transform.restore();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        scene.draw_Scene();


        if(lock) window.requestAnimationFrame(draw);
    }
    if(lock) window.requestAnimationFrame(draw);
}
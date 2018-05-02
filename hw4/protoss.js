//Main function to mimic a basic prototype of star craft.
function Protoss() { "use strict";
    lock = 2;
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var m4 = twgl.m4;
    var v3 = twgl.v3;

    var painter = new MyPainter(canvas);
    var poi=[0,0,450];
    var dir=[0,0,-1];

    //Sliders for eye position, zoom size, and MoonNum.
    var wf = document.getElementById("wf");
    var ns = document.getElementById("ns");
    var op = document.getElementById("op");
    var pv = document.getElementById("pv");
    pv.checked = true;
    var nl = document.getElementById("nl");
    var slider = document.getElementById('RotX');
    slider.value = -80;
    var slider1 = document.getElementById('RotZ');
    slider1.value = -100;
    var slider2 = document.getElementById('Zoom');
    slider2.value = 2;

    var mine = [[-300,260],[-40,360],[40,360],[320,0],[250,-300],[-320,-200]];
    var probe = [];
    var time = 10;
    var count = 0;
    for(var i=0; i<mine.length; i++) {
        var r = Math.sqrt(mine[i][0]*mine[i][0]+mine[i][1]*mine[i][1]);
        probe[i]=[250*mine[i][0]/r, 250*mine[i][1]/r];
    }
    /*function turn(v1,v2) {
        var theta = Math.acos(v3.dot(v3.normalize(v1),v3.normalize(v2)));
        if(v3.dot(m4.rotationZ(Math.PI/12*17+the),v3.normalize(v2))>.999) {
            return theta;
        }else {return - theta;}
    }*/
    var r0 = 250;
    var speed =3;

    var angle1 = Math.PI/3;
    var angle2 = Math.PI/4*3;
    var angle3 = -Math.PI/5*2;


    //Function for drawing a colored sphere.
    function DrawSphere(Tx,radius,_boundNum,c1,c_2) {
        var position = []; //Store sample vertices.
        var c2 = c_2 || c1;

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

    //Function for drawing trapezoid
    function trapezoid(Tx,xu,h,rat,row,col,c1,c_2) {
        var c2 = c_2 || c1;
        var hpr = h/row;

        function point(i,j) {
            var xi = xu + hpr/rat*i;
            var coli = col+i;
            if (i==0 && coli==0) return [0,0,h];
            return[xi*j/coli,xi*(1-j/coli),hpr*(row-i)];
        }

        for(var i=0; i<row; i++){
            var col0 = col+i;
            var c = MyGradient(c1,c2,i,row);

            var corner1 = m4.transformPoint(Tx,point(i,0));
            var corner2 = m4.transformPoint(Tx,point(i+1,0));
            var corner3 = m4.transformPoint(Tx,point(i+1,1));
            painter.polygon([corner1,corner3,corner2],c);

            for(var j=0;j<col0;j++){
                corner1 = m4.transformPoint(Tx,point(i,j));
                corner2 = m4.transformPoint(Tx,point(i+1,j+1));
                corner3 = m4.transformPoint(Tx,point(i+1,j+2));
                var corner4 = m4.transformPoint(Tx,point(i,j+1));
                painter.polygon([corner1,corner3,corner2],c);
                painter.polygon([corner1,corner4,corner3],c);
            }
        }
    }
    //Function for drawing diamond
    function diamond(Tx,h,rat,row,c1,c2) {
        var c0 = MyGradient(c1,c2,1,2);
        for(var i=0; i<4;i++){
            var T = m4.multiply(m4.rotationZ(i*Math.PI/2),Tx);
            trapezoid(T,0,h,rat,row,0,c1,c0);
            T = m4.multiply(m4.scaling([1,1,-1]),T);
            trapezoid(T,0,h,rat,row,0,c2,c0);
        }
    }
    //Function for drawing pyramid
    function pyramid(Tx, l, bd, c) {
        function isol(Tx, l, bd, c) {
            function point(i, j) {
                var a = Math.sin(Math.PI / 3);
                var coli = i;
                if (i == 0 && coli == 0) return [0, a * l, 0];
                return [l * (i / bd) * (j / i - 0.5), a * l * (1- i / bd), 0];
            }
            for (var i = 0; i < bd; i++) {
                var corner1 = m4.transformPoint(Tx, point(i, 0));
                var corner2 = m4.transformPoint(Tx, point(i + 1, 0));
                var corner3 = m4.transformPoint(Tx, point(i + 1, 1));
                painter.polygon([corner1, corner2, corner3], c);

                for (var j = 0; j < i; j++) {
                    corner1 = m4.transformPoint(Tx, point(i, j));
                    corner2 = m4.transformPoint(Tx, point(i + 1, j + 1));
                    corner3 = m4.transformPoint(Tx, point(i + 1, j + 2));
                    var corner4 = m4.transformPoint(Tx, point(i, j + 1));
                    painter.polygon([corner1, corner2, corner3], c);
                    painter.polygon([corner1, corner3, corner4], c);
                }
            }
        }

        var theta = Math.acos(1/3);
        var alp = Math.sqrt(3);
        var T = m4.multiply(m4.axisRotation([1,0,0],theta),m4.translation([0,-l*alp/6,0]));
        isol(m4.multiply(m4.scaling([1,1,-1]),m4.multiply(m4.translation([0,-l*alp/6,0]),Tx)),l,bd,c);
        isol(m4.multiply(T,Tx),l,bd,c);
        isol(m4.multiply(T,m4.multiply(m4.rotationZ(Math.PI/3*2),Tx)),l,bd,c);
        isol(m4.multiply(T,m4.multiply(m4.rotationZ(Math.PI/3*4),Tx)),l,bd,c);
    }

    //Function for drawing bound
    function bound(Tx,th,row,col,h,r,c_1,c_2) {
        var c1 = c_1 || [255,153,153,1];
        var c2 = c_2 || c1;

        function point(i,j) {
            var thi = th*i/row;
            return[r*Math.cos(thi),r*Math.sin(thi),h*(1-j/col)-h/2];
        }

        for(var i=0; i<row; i++){
            var c = MyGradient(c1,c2,i,row);
            for(var j=0;j<col;j++){
                var corner1 = m4.transformPoint(Tx,point(i,j));
                var corner2 = m4.transformPoint(Tx,point(i+1,j));
                var corner3 = m4.transformPoint(Tx,point(i+1,j+1));
                var corner4 = m4.transformPoint(Tx,point(i,j+1));
                painter.polygon([corner1,corner3,corner2],c);
                painter.polygon([corner1,corner4,corner3],c);
            }
        }

    }
    //Function for drawing Plain
    function plain(Tx,l,bd,col1,col2) {
        var col_2 = col2 || col1;
        var col = [col1,col_2];
        var lh = l/2;
        var lpb = l/bd;
        for(var i=0; i<bd; i++) {
            for(var j=0; j<bd; j++) {
                var corner1 = m4.transformPoint(Tx,[lpb*j-lh, lh-lpb*i, 0]);
                var corner2 = m4.transformPoint(Tx,[lpb*j-lh, lh-lpb*(i+1), 0]);
                var corner3 = m4.transformPoint(Tx,[lpb*(j+1)-lh, lh-lpb*(i+1),0]);
                var corner4 = m4.transformPoint(Tx,[lpb*(j+1)-lh, lh-lpb*i, 0 ]);
                painter.polygon([corner1,corner2,corner3],col[(i+j)%2]);
                painter.polygon([corner1,corner3,corner4],col[(i+j)%2]);
            }
        }
    }

    function platform(Tx,xu,h,rat,row,col,c1,c2) {
        for(var i=0; i<4;i++){
            var T = m4.multiply(m4.rotationZ(i*Math.PI/2),Tx);
            trapezoid(T,xu,h,rat,row,col,c1,c2);
        }
        var T = m4.multiply(m4.rotationZ(-Math.PI/4),Tx);
        plain(m4.multiply(m4.translation([0,0,h]),T),xu*Math.sqrt(2),col,c1);
        plain(m4.multiply(m4.scaling([1,1,-1]),T),(xu+h/rat)*Math.sqrt(2),col+row,c2);
    }


    //Function to draw the nexus.
    function DrawNexus(Tx,xu,h,h0,rat,row,col,the,c_1,c_2) {
        var c1 = c_1 || [255,255,0,1];
        var c2 = c_2 || [255,192,0,1];

        for(var i=0; i<3;i++){
            var T = m4.multiply(m4.translation([0,0,i*(h+10)]),Tx);
            platform(T,xu+(h/rat)*(2-i),h,rat,row,col+6*(2-i), MyGradient(c2,c1,(i+1),3),MyGradient(c2,c1,i,3));
        }
        diamond(m4.multiply(m4.rotationZ(the),m4.translation([0,0,3*(h+10)+h0])),h0,rat,6,[0,51,255,1],[0,153.255,1]);
        var xd = xu+(h/rat)*3;
        var l= 0.35*xd;
        var T0 = m4.multiply(m4.rotationZ(-Math.PI/2),m4.translation([0.9*xd + l*Math.sqrt(3)/6,0,0]));
        for(var i=0; i<8;i++){

            var T = m4.multiply(T0,m4.multiply(m4.rotationZ(i*Math.PI/4),Tx));
            pyramid(T,l, 10, [255,153,0,1]);
        }
    }
    //Function to draw the probe.
    function DrawProbe(Tx,l0,c_1,c_2) {
        var c1 = c_1 ||[255,0,0,1];
        var c2 = c_2 ||[0,102,255,1];
        var l = l0 || 40;
        var T0 = m4.translation([0,l*Math.sqrt(3)/6,0]);
        var T = m4.multiply(m4.rotationX(Math.PI/6),T0);
        pyramid(m4.multiply(T,Tx),l,l/5,c1);

        T = m4.multiply(m4.translation([3/8*l,3/8*l,1/8*l]),T0);
        DrawSphere(m4.multiply(T,Tx),1/8*l,8,c2);
        T = m4.multiply(m4.translation([-3/8*l,3/8*l,1/8*l]),T0);
        DrawSphere(m4.multiply(T,Tx),1/8*l,8,c2);
    }
    //Function to draw the mineral.
    function DrawMineral(Tx,h,rat,row,c_1,c_2) {
        var c1 = c_1 || [0,255,255,1];
        var c2 = c_2 || [192,255.255,1];
        var T = m4.translation([0,0,h]);
        diamond(m4.multiply(T,Tx),h,rat,row,c1,c2);
        diamond(m4.multiply(T,m4.multiply(m4.rotationY(Math.PI/4),Tx)),h,rat,row,c1,c2);
        diamond(m4.multiply(T,m4.multiply(m4.rotationX(-Math.PI/4),Tx)),h,rat,row,c1,c2);
        diamond(m4.multiply(T,m4.multiply(m4.rotationY(-Math.PI/4),Tx)),h,rat,row,c1,c2);
        diamond(m4.multiply(T,m4.multiply(m4.rotationX(Math.PI/4),Tx)),h,rat,row,c1,c2);
    }
    //Function to draw the core.
    function DrawCore(Tx,the,r0,c_1,c_2) {
        var r = r0 || 40;
        var c1 = c_1 || [255,0,255,1];
        var c2 = c_2 || c1;
        DrawSphere(Tx,r,r/2,c1,c2);
        var T = m4.translation([0,0,-r/2]);

        bound(m4.multiply(T,m4.multiply(m4.rotationZ(Math.PI/12+the),Tx)),Math.PI/2,5,10,20,r*3/2);
        bound(m4.multiply(T,m4.multiply(m4.rotationZ(Math.PI/4*3+the),Tx)),Math.PI/2,5,10,20,r*3/2);
        bound(m4.multiply(T,m4.multiply(m4.rotationZ(Math.PI/12*17+the),Tx)),Math.PI/2,5,10,20,r*3/2);

    }

    function draw() {
        canvas.width = canvas.width;
        var len = canvas.width/2;
        painter.clear();
        count = count % (time*2);

        var angle = slider.value*Math.PI/180;
        var angle0 = slider1.value*Math.PI/180;
        var zoom = 1/4+slider2.value/4;
        var len0 = Math.round(len*zoom);
        angle1 = mod_2Pi(angle1 + speed * Math.PI/120);
        angle2 = mod_2Pi(angle2 + speed * Math.PI/100);
        angle3 = mod_2Pi(angle3 + speed * Math.PI/180);

        //Generate Tcpv.
        var eye = [700*Math.cos(angle0),700*Math.sin(angle0),800*Math.cos(angle)];
        var target = [0,0,0];
        var up = [0,0,1];
        var Tcamera = m4.inverse(m4.lookAt(eye,target,up));
        if(op.checked) {var Tprojection = ortho(-350,350,-350,350,100,800);}
        else {var Tprojection = m4.perspective(Math.PI/3,1,100,800);}
        var Tviewport = m4.multiply(m4.scaling([len0,-len0,len0]),m4.translation([len,len,0]));
        var Tcpv = m4.multiply(m4.multiply(Tcamera,Tprojection),Tviewport);
        painter.setTcpv(Tcpv);

        if(nl.checked){painter.setLight();}
        else {
            if(pv.checked) {painter.setLight(poi,true);}
            else {painter.setLight(dir,false);}
        }

        plain(m4.identity(),800,40,[48,48,48,1],[144,144,144,1]);
        //trapezoid(m4.identity(),140,120,2,14,20,[255,255,0,1],[255,192,0,1]);
        //platform(m4.translation([0,0,10]),140,120,2,14,20,[255,255,0,1],[255,192,0,1]);
        //DrawNexus(m4.translation([0,0,10]),20,72,24,1.2,8,2);
        //diamond(m4.translation([0,0,30]),24,1.2,5,[0,51,255,1],[0,153.255,1]);
        //pyramid(m4.translation([0,0,10]),70, 10, [255,153,0,1] );
        //DrawMineral(m4.translation([0,0,-10]),20*Math.sqrt(2),1.8,6,[0,255,255,1],[192,255.255,1]);
        //DrawProbe(m4.translation([0,0,10]));
        //bound(m4.translation([0,0,10]),Math.PI/4,5,10,20,60);\





        //DrawProbe(m4.translation([250,250,10]));

        DrawNexus(m4.translation([0,0,10]),20,72,24,1.2,8,2,angle1);
        DrawCore(m4.translation([r0*Math.cos(angle3),-r0*Math.sin(angle3),200]),angle2);
        mine.forEach(function (p) { DrawMineral(m4.translation([p[0],p[1],-10]),20*Math.sqrt(2),1.8,6);})

        for(var i=0;i<6;i++){
            //alert([mine,probe]);
            if(count<time){DrawProbe(m4.translation([(mine[i][0]-probe[i][0])*(count/time)+probe[i][0],(mine[i][1]-probe[i][1])*(count/time)+probe[i][1],10]));}
            else {
                var c = count % time;
                DrawProbe(m4.translation([(probe[i][0]-mine[i][0])*(c/time)+mine[i][0],(probe[i][1]-mine[i][1])*(c/time)+mine[i][1],10]));
            }
        }

        count++;

        //Decide how to draw.
        if (wf.checked) {painter.wireframe();}
        else {painter.render(ns.checked);}

        if(lock ==2) window.requestAnimationFrame(draw);
    }
    if(lock ==2) window.requestAnimationFrame(draw);
}
//window.onload = Protoss;
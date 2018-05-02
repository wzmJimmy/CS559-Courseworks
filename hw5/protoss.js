//Main function to mimic a basic prototype of star craft.
function Prot() { "use strict";
    lock = 2;

    var poi=[0,450,0];
    var preshader = new PreShader();

    //Sliders for eye position, zoom size, and MoonNum.
    var op = document.getElementById("op");
    var slider = document.getElementById('RotX');
    slider.value = 0;
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
                position.push([x,y,z]);
            }
        }

        for(var lati=0;lati<_boundNum; lati++){
            for(var loni=0;loni<_boundNum; loni++){
                var first = lati*(_boundNum+1)+loni;
                var second = first+_boundNum+1;

                var col = [MyGradient(c1,c2,lati,_boundNum+1),MyGradient(c1,c2,lati+1,_boundNum+1)];
                var T = m4.transpose(m4.inverse(Tx));
                var point = [[position[first],0], [position[first+1],0], [position[second],1], [position[second+1],1]];
                var list = [0,3,1,0,2,3];

                list.forEach(function (i) {
                    var pos = m4.transformPoint(Tx,point[i][0]);
                    preshader.addvertex(pos,col[point[i][1]],m4.transformPoint(T,point[i][0]));
                });
            }
        }
    }

    //Function for drawing trapezoid
    function trapezoid(Tx,xu,h,rat,row,col,c1,c_2) {
        var c2 = c_2 || c1;
        var hpr = h/row;

        var vs = [[xu,0,h],[xu+h/rat,0,0],[0,xu+h/rat,0]];
        var e1 = v3.subtract(vs[1],vs[0]);
        var e2 = v3.subtract(vs[2],vs[0]);
        var T = m4.transpose(m4.inverse(Tx));
        var norm = v3.normalize(v3.cross(e1,e2));
        var normT = m4.transformPoint(T,norm);

        function point(i,j) {
            var xi = xu + hpr/rat*i;
            var coli = col+i;
            if (i==0 && coli==0) return [0,0,h];
            return[xi*j/coli,xi*(1-j/coli),hpr*(row-i)];
        }

        for(var i=0; i<row; i++){
            var col0 = col+i;
            var c = MyGradient(c1,c2,i,row+1);
            var c1 = MyGradient(c1,c2,i+1,row+1);

            var corner1 = m4.transformPoint(Tx,point(i,0));
            var corner2 = m4.transformPoint(Tx,point(i+1,0));
            var corner3 = m4.transformPoint(Tx,point(i+1,1));

            preshader.addvertex(corner1,c,normT);
            preshader.addvertex(corner3,c1,normT);
            preshader.addvertex(corner2,c,normT);

            for(var j=0;j<col0;j++){
                corner1 = m4.transformPoint(Tx,point(i,j));
                corner2 = m4.transformPoint(Tx,point(i+1,j+1));
                corner3 = m4.transformPoint(Tx,point(i+1,j+2));
                var corner4 = m4.transformPoint(Tx,point(i,j+1));

                preshader.addvertex(corner1,c,normT);
                preshader.addvertex(corner3,c1,normT);
                preshader.addvertex(corner2,c,normT);
                preshader.addvertex(corner1,c,normT);
                preshader.addvertex(corner4,c1,normT);
                preshader.addvertex(corner3,c1,normT);

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
            var norm = [0,0,1];
            var T = m4.transpose(m4.inverse(Tx));
            var normT = m4.transformPoint(T,norm);

            function point(i, j) {
                var a = Math.sin(Math.PI / 3);
                if (i == 0) return [0, a * l, 0];
                return [l * (i / bd) * (j / i - 0.5), a * l * (1- i / bd), 0];
            }

            for (var i = 0; i < bd; i++) {
                var corner1 = m4.transformPoint(Tx, point(i, 0));
                var corner2 = m4.transformPoint(Tx, point(i + 1, 0));
                var corner3 = m4.transformPoint(Tx, point(i + 1, 1));

                preshader.addvertex(corner1,c,normT);
                preshader.addvertex(corner2,c,normT);
                preshader.addvertex(corner3,c,normT);

                for (var j = 0; j < i; j++) {
                    corner1 = m4.transformPoint(Tx, point(i, j));
                    corner2 = m4.transformPoint(Tx, point(i + 1, j + 1));
                    corner3 = m4.transformPoint(Tx, point(i + 1, j + 2));
                    var corner4 = m4.transformPoint(Tx, point(i, j + 1));
                    preshader.addvertex(corner1,c,normT);
                    preshader.addvertex(corner2,c,normT);
                    preshader.addvertex(corner3,c,normT);
                    preshader.addvertex(corner1,c,normT);
                    preshader.addvertex(corner3,c,normT);
                    preshader.addvertex(corner4,c,normT);
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
        var c1 = c_1 || [1,153/255,153/255];
        var c2 = c_2 || c1;
        var T = m4.transpose(m4.inverse(Tx));

        function point(i,j) {
            var thi = th*i/row;
            return[r*Math.cos(thi),r*Math.sin(thi),h*(1-j/col)-h/2];
        }

        for(var i=0; i<row; i++){
            var cu = MyGradient(c1,c2,i,row+1);
            var cd = MyGradient(c1,c2,i+1,row+1);
            for(var j=0;j<col;j++){

                var corner1 = m4.transformPoint(Tx,point(i,j));
                var corner2 = m4.transformPoint(Tx,point(i+1,j));
                var corner3 = m4.transformPoint(Tx,point(i+1,j+1));
                var corner4 = m4.transformPoint(Tx,point(i,j+1));

                var p = [[point(i,j),cu],[point(i+1,j),cd],
                            [point(i+1,j+1),cd],[point(i,j+1),cu]];
                var list = [0,2,1,0,3,2];
                list.forEach(function (i) {
                    var pos = m4.transformPoint(Tx, p[i][0]);
                    preshader.addvertex(pos, p[i][1], m4.transformPoint(T, p[i][0]));
                });
            }
        }

    }
    //Function for drawing Plain
    function plain(Tx,l,bd,col1,col2) {
        var col_2 = col2 || col1;
        var col = [col1,col_2];
        var lh = l/2;
        var lpb = l/bd;

        var norm = [0,0,1];
        var T = m4.transpose(m4.inverse(Tx));
        var normT = m4.transformPoint(T,norm);

        for(var i=0; i<bd; i++) {
            for(var j=0; j<bd; j++) {
                var c = col[(i+j)%2];
                var corner1 = m4.transformPoint(Tx,[lpb*j-lh, lh-lpb*i, 0]);
                var corner2 = m4.transformPoint(Tx,[lpb*j-lh, lh-lpb*(i+1), 0]);
                var corner3 = m4.transformPoint(Tx,[lpb*(j+1)-lh, lh-lpb*(i+1),0]);
                var corner4 = m4.transformPoint(Tx,[lpb*(j+1)-lh, lh-lpb*i, 0 ]);

                preshader.addvertex(corner1,c,normT);
                preshader.addvertex(corner2,c,normT);
                preshader.addvertex(corner3,c,normT);
                preshader.addvertex(corner1,c,normT);
                preshader.addvertex(corner3,c,normT);
                preshader.addvertex(corner4,c,normT);
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
        var c1 = c_1 || [1,1,0];
        var c2 = c_2 || [1,192/255,0];

        for(var i=0; i<3;i++){
            var T = m4.multiply(m4.translation([0,0,i*(h+10)]),Tx);
            platform(T,xu+(h/rat)*(2-i),h,rat,row,col+6*(2-i), MyGradient(c2,c1,(i+1),3),MyGradient(c2,c1,i,3));
        }
        diamond(m4.multiply(m4.rotationZ(the),m4.translation([0,0,3*(h+10)+h0])),h0,rat,6,[0,51/255,1],[0,153/255,1]);
        var xd = xu+(h/rat)*3;
        var l= 0.35*xd;
        var T0 = m4.multiply(m4.rotationZ(-Math.PI/2),m4.translation([0.9*xd + l*Math.sqrt(3)/6,0,0]));
        for(var i=0; i<8;i++){

            var T = m4.multiply(T0,m4.multiply(m4.rotationZ(i*Math.PI/4),Tx));
            pyramid(T,l, 10, [1,153/255,0,1]);
        }
    }
    //Function to draw the probe.
    function DrawProbe(Tx,l0,c_1,c_2) {
        var c1 = c_1 ||[1,0,0];
        var c2 = c_2 ||[0,102/255,1];
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
        var c1 = c_1 || [0,1,1];
        var c2 = c_2 || [192/255,1,1];
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
        var c1 = c_1 || [1,0,1];
        var c2 = c_2 || c1;
        DrawSphere(Tx,r,r/2,c1,c2);
        var T = m4.translation([0,0,-r/2]);

        bound(m4.multiply(T,m4.multiply(m4.rotationZ(Math.PI/12+the),Tx)),Math.PI/2,5,10,20,r*3/2);
        bound(m4.multiply(T,m4.multiply(m4.rotationZ(Math.PI/4*3+the),Tx)),Math.PI/2,5,10,20,r*3/2);
        bound(m4.multiply(T,m4.multiply(m4.rotationZ(Math.PI/12*17+the),Tx)),Math.PI/2,5,10,20,r*3/2);

    }

    function draw() {
        count = count % (time*2);
        preshader.clear();

        var angle = slider.value*Math.PI/180;
        var angle0 = slider1.value*Math.PI/180;
        var zoom = 1/4+slider2.value/4;
        angle1 = mod_2Pi(angle1 + speed * Math.PI/120);
        angle2 = mod_2Pi(angle2 + speed * Math.PI/100);
        angle3 = mod_2Pi(angle3 + speed * Math.PI/180);

        //Generate Tcpv.
        var eye = [700*Math.cos(angle0),700*Math.sin(angle0),800*Math.cos(angle)];
        var target = [0,0,0];
        var up = [0,0,1];
        var Tcamera = m4.inverse(m4.lookAt(eye,target,up));
        if(op.checked) {var Tprojection = ortho(-350,350,-350,350,5,2000);}
        else {var Tprojection = m4.perspective(Math.PI/3,1,5,2000);}

        preshader.setTc(Tcamera);
        preshader.setTp(m4.multiply(Tprojection,m4.scaling([zoom,zoom,zoom]))); //
        preshader.setLight(poi); //m4.transformPoint(Tcamera,poi)
        preshader.setTnorm(m4.transpose(m4.inverse(Tcamera)));

        plain(m4.identity(),800,40,[48/255,48/255,48/255],[144/255,144/255,144/255]);

        //trapezoid(m4.identity(),140,120,2,14,20,[255,255,0,1],[255,192,0,1]);
        //platform(m4.translation([0,0,10]),140,120,2,14,20,[255,255,0,1],[255,192,0,1]);
        //DrawNexus(m4.translation([0,0,10]),20,72,24,1.2,8,2);
        //diamond(m4.translation([0,0,30]),24,1.2,5,[0,51,255,1],[0,153.255,1]);
        //pyramid(m4.translation([0,0,10]),70, 10, [255,153,0,1] );
        //DrawMineral(m4.translation([0,0,-10]),20*Math.sqrt(2),1.8,6,[0,255,255,1],[192,255.255,1]);
        //DrawProbe(m4.translation([0,0,10]));
        //bound(m4.translation([0,0,10]),Math.PI/4,5,10,20,60);\

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

        preshader.render();
        count++;

        if(lock ==2) window.requestAnimationFrame(draw);
    }
    if(lock ==2) window.requestAnimationFrame(draw);
}
//window.onload = Protoss;
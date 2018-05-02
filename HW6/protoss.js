//Main function to mimic a basic prototype of star craft.
function Prot() { "use strict";
    lock = 2;

    var sl=[0,1,0];
    var dl=[0,1,0];
    var scene = new Scene();
    var transform = new Transform();

    //Sliders for eye position, zoom size, and MoonNum.
    var op = document.getElementById("op");
    var sl = document.getElementById("sl");
    var slider = document.getElementById('RotX');
    slider.value = -70;
    var slider1 = document.getElementById('RotZ');
    slider1.value = -15;
    var slider2 = document.getElementById('Zoom');
    slider2.value = 2;

    var mine = [[-300,260],[-40,360],[40,360],[320,0],[250,-300],[-320,-200]];
    var probe = [];
    var dir = [[],[]];
    var lag = 5;
    var times = 10;
    var count = 0;
    for(var i=0; i<mine.length; i++) {
        var r = Math.sqrt(mine[i][0]*mine[i][0]+mine[i][1]*mine[i][1]);
        probe[i]=[250*mine[i][0]/r, 250*mine[i][1]/r];
        var vec = [probe[i][0],probe[i][1],0];
        var d_angle = Math.acos(v3.normalize(vec)[1]);
        if(probe[i][0]>0) d_angle = -d_angle;
        dir[0][i] = [d_angle];
        dir[1][i] = [d_angle+Math.PI];
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

    //Function for model a colored sphere.
    function sphere(nameOrM,radius,_boundNum,c1,c_2) {
        var c2 = c_2|| c1;

        var transform = new Transform();
        if (nameOrM[0]) scene.new_Part(nameOrM[1]);
        else transform = nameOrM[1];
        var ts = transform.get_Trans();
        var tn = transform.get_Tnorm();
        var index = scene.get_Indexbase();

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
                scene.append_VBuffer([m4.transformPoint(ts,poi), col, m4.transformPoint(tn,poi)]);
            }
        }
        for(var i=0;i<_boundNum; i++) {
            for (var j = 0; j < _boundNum; j++) {
                var lu = index + i * (_boundNum + 1) + j;
                var ld = lu + _boundNum + 1;
                scene.append_IBuffer([lu, ld + 1, lu + 1, lu, ld, ld + 1]);
            }
        }
    }

    //Function for model a bound
    function bound(nameOrM,th,row,col,h,r,c_1,c_2) {
        var c1 = c_1|| [1,153/255,153/255];
        var c2 = c_2|| c1;

        var transform = new Transform();
        if (nameOrM[0]) scene.new_Part(nameOrM[1]);
        else transform = nameOrM[1];
        var ts = transform.get_Trans();
        var tn = transform.get_Tnorm();
        var index = scene.get_Indexbase();

        function point(i,j) {
            var thi = th*i/row;
            return[r*Math.cos(thi),r*Math.sin(thi),h*(1-j/col)-h/2];
        }

        for(var i=0;i<=row; i++){
            var c = MyGradient(c1,c2,i,row+1);
            for(var j=0;j<=col; j++){
                var poi = point(i,j);
                scene.append_VBuffer([m4.transformPoint(ts,poi), c, m4.transformPoint(tn,[poi[0],poi[1],0])]);
            }
        }
        for(var i=0;i<row; i++) {
            for (var j = 0; j <col; j++) {
                var lu = index + i * (col+ 1) + j;
                var ld = lu + col + 1;
                scene.append_IBuffer([lu, ld + 1, lu + 1, lu, ld, ld + 1]);
            }
        }
    }

    //Function for drawing trapezoid
    function trapezoid(nameOrM,xu,h,rat,row,col,c1,c_2) {
        var transform = new Transform();
        if (nameOrM[0]) scene.new_Part(nameOrM[1]);
        else transform = nameOrM[1];
        var index = scene.get_Indexbase();

        var c2 = c_2 || c1;
        var hpr = h/row;
        var ts = transform.get_Trans();
        var tn = transform.get_Tnorm();

        var vs = [[xu,0,h],[xu+h/rat,0,0],[0,xu+h/rat,0]];
        var e1 = v3.subtract(vs[1],vs[0]);
        var e2 = v3.subtract(vs[2],vs[0]);
        var norm = v3.normalize(v3.cross(e1,e2));

        function point(i,j) {
            var xi = xu + hpr/rat*i;
            var coli = col+i;
            if (i==0 && coli==0) return [0,0,h];
            return[xi*j/coli,xi*(1-j/coli),hpr*(row-i)];
        }

        for(var i=0; i<=row; i++){
            var col0 = col+i;
            var c = MyGradient(c1,c2,i,row+1);
            for(var j=0;j<=col0;j++){
                var poi = point(i,j);
                scene.append_VBuffer([m4.transformPoint(ts,poi), c, m4.transformPoint(tn,norm)]);
            }
        }

        for(var i=0; i<row; i++){
            var col0 = col+i;
            var lu0 = index + i * (col+1+ col+i)/2;
            var ld0 = lu0 + (col0+ 1);
            scene.append_IBuffer([lu0, ld0 , ld0 + 1]);

            for(var j=0;j<col0;j++){
                var lu = lu0 + j;
                var ld = ld0 + j+1;
                scene.append_IBuffer([lu, ld + 1, lu + 1, lu, ld, ld + 1]);

            }
        }
    }
    //Function for drawing diamond
    function diamond(nameOrM,h,rat,row,c1,c2) {
        var transform = new Transform();
        if (nameOrM[0]) scene.new_Part(nameOrM[1]);
        else transform = nameOrM[1];
        var c0 = MyGradient(c1,c2,1,2);

        for(var i=0; i<4;i++){
            transform.save();
            transform.trans(m4.rotationZ(i*Math.PI/2));
            trapezoid([false,transform],0,h,rat,row,0,c1,c0);
            transform.trans(m4.scaling([1,1,-1]));
            trapezoid([false,transform],0,h,rat,row,0,c2,c0);
            transform.restore();
        }
    }
    //Function for drawing pyramid
    function pyramid(nameOrM, l, bd, c) {
        var transform = new Transform();
        if (nameOrM[0]) scene.new_Part(nameOrM[1]);
        else transform = nameOrM[1];

        function isol() { // use l , bd ,c
            var norm = [0,0,1];
            var ts = transform.get_Trans();
            var tn = transform.get_Tnorm();
            var index = scene.get_Indexbase();

            function point(i, j) {
                var a = Math.sin(Math.PI / 3);
                if (i == 0) return [0, a * l, 0];
                return [l * (i / bd) * (j / i - 0.5), a * l * (1- i / bd), 0];
            }

            for(var i=0; i<=bd; i++){
                for(var j=0;j<=i;j++){
                    var poi = point(i,j);
                    scene.append_VBuffer([m4.transformPoint(ts,poi), c, m4.transformPoint(tn,norm)]);
                }
            }

            for(var i=0; i<bd; i++){
                var lu0 = index + i * (1+i)/2;
                var ld0 = lu0 + (i+ 1);
                scene.append_IBuffer([lu0, ld0 , ld0 + 1]);

                for(var j=0;j<i;j++){
                    var lu = lu0 + j;
                    var ld = ld0 + j+1;
                    scene.append_IBuffer([lu, ld + 1, lu + 1, lu, ld, ld + 1]);
                }
            }
        }

        var theta = Math.acos(1/3);
        var alp = Math.sqrt(3);

        transform.save();
        transform.trans(m4.translation([0,-l*alp/6,0]),true);
        transform.trans(m4.scaling([1,1,-1]));
        isol();
        transform.restore();

        var Trans = new Transform();
        Trans.trans(m4.translation([0,-l*alp/6,0]),true);
        Trans.trans(m4.axisRotation([1,0,0],theta));

        transform.save();
        transform.trans_ByTrans(Trans);
        isol();
        transform.restore();

        transform.save();
        transform.trans(m4.rotationZ(Math.PI/3*2));
        transform.trans_ByTrans(Trans);
        isol();
        transform.restore();

        transform.save();
        transform.trans(m4.rotationZ(Math.PI/3*4));
        transform.trans_ByTrans(Trans);
        isol();
        transform.restore();
    }



    //Function for drawing Plain
    function plain(nameOrM,l,bd,col1,col2) {
        var col_2 = col2 || col1;
        var col = [col1,col_2];
        var norm = [0,0,1];

        var transform = new Transform();
        if (nameOrM[0]) scene.new_Part(nameOrM[1]);
        else transform = nameOrM[1];
        var ts = transform.get_Trans();
        var tn = transform.get_Tnorm();
        var index = scene.get_Indexbase();

        function point(i,j) {
            var lh = l/2;
            var lpb = l/bd;
            return [lpb*j-lh, lh-lpb*i, 0];
        }

        for(var i=0; i<bd; i++) {
            for(var j=0; j<bd; j++) {
                var c = col[(i+j)%2];
                var poi = [point(i,j),point(i+1,j), point(i+1,j+1), point(i,j+1)];
                for(var id=0;id<4;id++){
                    scene.append_VBuffer([m4.transformPoint(ts,poi[id]), c, m4.transformPoint(tn,norm)]);
                }

                var ind = index + i * bd*4 + j*4;
                scene.append_IBuffer([ind, ind + 2, ind + 3, ind, ind + 1, ind + 2]);
            }
        }
    }

    function platform(nameOrM,xu,h,rat,row,col,c1,c2) {
        var transform = new Transform();
        if (nameOrM[0]) scene.new_Part(nameOrM[1]);
        else transform = nameOrM[1];

        for(var i=0; i<4;i++){
            transform.save();
            transform.trans(m4.rotationZ(i*Math.PI/2));
            trapezoid([false,transform],xu,h,rat,row,col,c1,c2);
            transform.restore();
        }

        transform.save();
        transform.trans(m4.rotationZ(-Math.PI/4));

        transform.save();
        transform.trans(m4.translation([0,0,h]),true);
        plain([false,transform],xu*Math.sqrt(2),col,c1);
        transform.restore();

        transform.trans(m4.scaling([1,1,-1]),true);
        plain([false,transform],(xu+h/rat)*Math.sqrt(2),col+row,c2);
        transform.restore();
    }

    /*****the function below are all highest part******/
    //Function to model the core.
    function modelCore(name,r0,c_1,c_2) {
        var r = r0 || 40;
        var c1 = c_1 || [1, 0, 1];
        var c2 = c_2 || c1;
        var transform = new Transform();

        scene.new_Part(name + "sphere");
        sphere([false,transform], r, r / 2, c1, c2);

        scene.new_Part(name + "bound");
        var the0 = [Math.PI/12,Math.PI/4*3,Math.PI/12*17];
        transform.save();
        transform.trans(m4.translation([0,0,-r/2]));
        for(i=0;i<3;i++){
            transform.save();
            transform.trans(m4.rotationZ(the0[i]));
            bound([false,transform], Math.PI / 2, 5, 10, 30, r * 3 / 2);
            transform.restore();
        }
        transform.restore();
    }

    //Function to draw the probe.
    function modelProbe(name,l0,c_1,c_2) {
        var c1 = c_1 ||[1,0,0];
        var c2 = c_2 ||[0,102/255,1];
        var l = l0 || 40;
        var transform = new Transform();
        scene.new_Part(name);

        transform.save();
        transform.trans(m4.translation([0,l*Math.sqrt(3)/6,0]),true);

        transform.save();
        transform.trans(m4.rotationX(Math.PI/6));
        pyramid([false,transform],l,l/5,c1);
        transform.restore();

        transform.save();
        transform.trans(m4.translation([3/8*l,3/8*l,1/8*l]),true);
        sphere([false,transform],1/8*l,8,c2);
        transform.restore();

        transform.save();
        transform.trans(m4.translation([-3/8*l,3/8*l,1/8*l]),true);
        sphere([false,transform],1/8*l,8,c2);
        transform.restore();
    }

    //Function to draw the mineral.
    function modelMineral(name,h,rat,row,c_1,c_2) {
        var c1 = c_1 || [0,1,1];
        var c2 = c_2 || [192/255,1,1];
        var transform = new Transform();
        scene.new_Part(name);

        var T = m4.translation([0,0,h]);
        var axis = [[1,0,0],[0,1,0]];
        var angle = [Math.PI/4,-Math.PI/4];

        transform.save();
        transform.trans(m4.translation([0,0,h]),true);
        diamond([false,transform],h,rat,row,c1,c2);
        transform.restore();

        for(var i=0; i<2; i++){
            for(var j=0; j<2; j++) {
                transform.save();
                transform.trans(m4.axisRotation(axis[i],angle[j]), true);
                transform.trans(m4.translation([0,0,h]),true);
                diamond([false, transform], h, rat, row, c1, c2);
                transform.restore();
            }
        }
    }




    //Function to draw the nexus.
    function modelNexus(name,xu,h,h0,rat,row,col,c_1,c_2) {
        var c1 = c_1 || [1,1,0];
        var c2 = c_2 || [1,192/255,0];
        var transform = new Transform();

        scene.new_Part(name+"plats");
        for(var i=0; i<3;i++){
            transform.save();
            transform.trans(m4.translation([0,0,i*(h+10)]), true);
            platform([false,transform],xu+(h/rat)*(2-i),h,rat,row,col+6*(2-i), MyGradient(c2,c1,(i+1),3),MyGradient(c2,c1,i,3));
            transform.restore();
        }

        scene.new_Part(name+"diam");   //m4.rotationZ(the)
        transform.save();
        transform.trans(m4.translation([0,0,3*(h+10)+h0]), true);
        diamond([false,transform],h0,rat,6,[0,51/255,1],[0,153/255,1]);
        transform.restore();

        scene.new_Part(name+"pyras");
        var xd = xu+(h/rat)*3;
        var l= 0.35*xd;
        var Trans = new Transform();
        Trans.trans(m4.translation([0.9*xd + l*Math.sqrt(3)/6,0,0]),true);
        Trans.trans(m4.rotationZ(-Math.PI/2));


        for(var i=0; i<8;i++){
            transform.save();
            transform.trans(m4.rotationZ(i*Math.PI/4));
            transform.trans_ByTrans(Trans);
            pyramid([false,transform],l, 10, [1,153/255,0]);
            transform.restore();
        }
    }

    plain([true,"plain"],800,40,[48/255,48/255,48/255],[144/255,144/255,144/255]);
    modelNexus("nexus",20,72,24,1.2,8,2);
    modelCore("core");
    for(var i=0; i<mine.length; i++)
        {modelMineral("mineral"+i,20*Math.sqrt(2),1.8,6);}
    for(var i=0; i<probe.length; i++)
        {modelProbe("probe"+i);}

    scene.start_PassData();


    function draw() {
        function trans(name) {
            scene.set_CurrentPart(name);
            scene.set_Uniform("tmc",transform.get_Trans());
            scene.set_Uniform("tn",transform.get_Tnorm());
        }

        function setCore(name,the) {
            trans(name+"sphere");

            transform.save();
            transform.trans(m4.rotationZ(the));
            trans(name+"bound");
            transform.restore();
        }
        function setNexus(name,the) {

            trans(name+"pyras");

            trans(name+"plats");

            transform.save();
            transform.trans(m4.rotationZ(the));
            trans(name+"diam");
            transform.restore();
        }

        var angle = slider.value*Math.PI/180;
        var angle0 = slider1.value*Math.PI/180;
        var zoom = 1/4+slider2.value/4;
        angle1 = mod_2Pi(angle1 + speed * Math.PI/120);
        angle2 = mod_2Pi(angle2 + speed * Math.PI/100);
        angle3 = mod_2Pi(angle3 + speed * Math.PI/180);
        var d = new Date();
        var time = d.getTime()%1000/1000;

        //Generate Tcpv.
        var eye = [700*Math.cos(angle0),700*Math.sin(angle0),800*Math.cos(angle)];
        var target = [0,0,0];
        var up = [0,0,1];
        var Tcamera = m4.inverse(m4.lookAt(eye,target,up));

        if(op.checked) {var Tprojection = ortho(-350,350,-350,350,5,2000);}
        else {var Tprojection = m4.perspective(Math.PI/3,1,5,2000);}

        scene.set_Consts("slight",sl);
        scene.set_Consts("dlight",dl);
        scene.set_Consts("time",time);
        scene.set_Consts("flag",sl.checked?2:0);
        scene.set_Consts("tp",m4.multiply(Tprojection,m4.scaling([zoom,zoom,zoom])));

        transform.save();
        transform.trans(Tcamera);

        trans("plain");

        transform.save();
        transform.trans(m4.translation([0,0,10]),true);
        setNexus("nexus",angle1);
        transform.restore();

        transform.save();
        transform.trans(m4.translation([r0*Math.cos(angle3),-r0*Math.sin(angle3),200]));
        setCore("core",angle2);
        transform.restore();

        for(var i=0; i<mine.length; i++){
            transform.save();
            transform.trans(m4.translation([mine[i][0],mine[i][1],-10]),true);
            trans("mineral"+i);
            transform.restore();
        }

        count = count % (times*lag*2);
        var c = Math.ceil(count/lag);
        var d = dir[0];
        if(c>=times) {
            c = times*2 - c;
            var d = dir[1];
        }
        for(var i=0;i<6;i++){
            var t = m4.translation([(mine[i][0]-probe[i][0])*(c/times)+probe[i][0],(mine[i][1]-probe[i][1])*(c/times)+probe[i][1],10]);
            transform.save();
            transform.trans(t,true);
            transform.trans(m4.rotationZ(d[i]));
            trans("probe"+i);
            transform.restore();
        }

        transform.restore();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        scene.draw_Scene();
        count++;

       if(lock ==2) window.requestAnimationFrame(draw);
    }
    if(lock ==2) window.requestAnimationFrame(draw);
}
//window.onload = Protoss;
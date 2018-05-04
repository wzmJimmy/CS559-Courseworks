var grobjects = grobjects || {};


(function() {
    "use strict";

    var r = undefined;
    var theta = undefined;
    reflaction =  new reflect_ball();

    grobjects["Mothership"] = new Mothership([0,12, 0]);

    for(var i =1; i <= 6; i++) {
        grobjects["Phoenix"+i] = new Phoenix(true,Math.PI/3*i);
    }

    //grobjects["Probes"] = new Probes([4,3, 0]);
    grobjects["Probes1"] = new Probes([-3.5,0,0],true);
    grobjects["Probes2"] = new Probes([-3,0,0],true);
    grobjects["Probes3"] = new Probes([-2.8,0,-0.8],true);
    grobjects["Probes4"] = new Probes([-2.1,0,-1.5],true);
    grobjects["Probes5"] = new Probes([-1.8,0,-1.2],true);
    grobjects["Probes6"] = new Probes([-1.5,0,-2.1],true);
    grobjects["Probes7"] = new Probes([-0.8,0,-2.8],true);
    grobjects["Probes8"] = new Probes([0,0,-3.5],true);
    grobjects["Probes9"] = new Probes([0,0,-3],true);


    r = 5;
    theta = [-Math.PI/18, Math.PI/18,Math.PI/6,Math.PI*2/6,Math.PI*8/18,Math.PI*10/18];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Immortal"+i] = new Immortal([r*Math.sin(theta[i-1]),0,r*Math.cos(theta[i-1])],theta[i-1],true);
    }

    theta = [0,Math.PI/4,Math.PI/2];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Colossus"+i] = new Colossus([r*Math.sin(theta[i-1]),0,r*Math.cos(theta[i-1])],theta[i-1],true);
    }

    r = 6.1;
    theta = [-Math.PI*3/36,-Math.PI/36,Math.PI/36,Math.PI*3/36,Math.PI*5/36,Math.PI*7/36,
             Math.PI*11/36,Math.PI*13/36,Math.PI*15/36,Math.PI*17/36,Math.PI*19/36,Math.PI*21/36];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Zealot"+i] = new Zealot([r*Math.sin(theta[i-1]),0,r*Math.cos(theta[i-1])],theta[i-1],true);
    }


    r = 5;
    theta = [Math.PI*7/8,Math.PI*9/8,Math.PI*11/8,Math.PI*13/8];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Carrier"+i] = new Carrier([r*Math.sin(theta[i-1]),7,r*Math.cos(theta[i-1])],theta[i-1],true);
    }

    r = 6;
    theta = [Math.PI*19/24,Math.PI*23/24,Math.PI*25/24,Math.PI*29/24, Math.PI*31/24,Math.PI*35/24,Math.PI*37/24,Math.PI*41/24];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Voidray"+i] = new Voidray([r*Math.sin(theta[i-1]),6,r*Math.cos(theta[i-1])],theta[i-1],true);
    }


    grobjects["Hyel1"] = new Hyel([16*Math.sin(Math.PI),8,16*Math.cos(Math.PI)],0,true);

    r = 15;
    theta = [Math.PI*3/4,Math.PI*11/16,Math.PI*13/16,
            Math.PI*5/4,Math.PI*19/16,Math.PI*21/16,
            Math.PI*34/36,Math.PI*35/36,Math.PI*37/36,Math.PI*38/36];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Banshee"+i] = new Banshee([r*Math.sin(theta[i-1]),4,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }
    r = 16;
    theta = [Math.PI*23/32,Math.PI*25/32, Math.PI*39/32, Math.PI*41/32];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Banshee"+(i+10)] = new Banshee([r*Math.sin(theta[i-1]),5,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }

    r = 16;
    theta = [Math.PI*21/12, Math.PI*19/12];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Overseer"+i] = new Overseer([r*Math.sin(theta[i-1]),7,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }
    r = 15;
    var the = Math.PI/16
    theta = [Math.PI*19/12-the*3,Math.PI*19/12-the*2,Math.PI*19/12-the,
            Math.PI*19/12+the*1.5,Math.PI*19/12+the*2.5,Math.PI*19/12+the*0.5,
            Math.PI*21/12+the, Math.PI*21/12+the*2,Math.PI*21/12+the*3];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Mutalisk"+i] = new Mutalisk([r*Math.sin(theta[i-1]),4,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }
    r = 15.5;
    theta = [Math.PI*19/12-the*1.5,Math.PI*19/12-the*2.5,
        Math.PI*19/12+the*1,Math.PI*19/12+the*2,
        Math.PI*21/12+the*1.5, Math.PI*21/12+the*2.5];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Mutalisk"+(i+9)] = new Mutalisk([r*Math.sin(theta[i-1]),4.5,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }

    r = 16;
    theta = [0, Math.PI/6];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Ultralisk"+i] = new Ultralisk([r*Math.sin(theta[i-1]),0,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }
    theta = [  -Math.PI/18,-Math.PI/27, Math.PI/18,Math.PI/27, Math.PI*2/18,Math.PI*7/54,Math.PI*4/18,Math.PI*11/54];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Baneling"+i] = new Baneling([r*Math.sin(theta[i-1]),0,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }
    r = 15;
    theta = [  -Math.PI/36,0,Math.PI*1/36,Math.PI*2/36,Math.PI*3/36,Math.PI*4/36,Math.PI*5/36,Math.PI*6/36,Math.PI*7/36];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Baneling"+(i+8)] = new Baneling([r*Math.sin(theta[i-1]),0,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }

    r = 16;
    theta = [Math.PI*18/36, Math.PI*14/36, Math.PI*10/36];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Thor"+i] = new Thor([r*Math.sin(theta[i-1]),0,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }
    r = 15;
    theta = [Math.PI*18/36-Math.PI/27, Math.PI*18/36+Math.PI/27,
            Math.PI*14/36-Math.PI/27,Math.PI*14/36+Math.PI/27,
            Math.PI*10/36-Math.PI/27,Math.PI*10/36+Math.PI/27];
    for(var i =1; i <= theta.length; i++) {
        grobjects["Firebat"+i] = new Firebat([r*Math.sin(theta[i-1]),0,r*Math.cos(theta[i-1])],Math.PI+theta[i-1],true);
    }



    grobjects["plain"] = new plain(30);

    grobjects["mineral1"] = new mineral(.6,[-4.5,-0.1,0]);
    grobjects["mineral2"] = new mineral(.6,[-4.2,-0.1,-1.17]);
    grobjects["mineral3"] = new mineral(.6,[-3.8,-0.1,-2.45]);
    grobjects["mineral4"] = new mineral(.6,[-3.5,-0.1,-3.5]);
    grobjects["mineral5"] = new mineral(.6,[-2.45,-0.1,-3.8]);
    grobjects["mineral6"] = new mineral(.6,[-1.17,-0.1,-4.2]);
    grobjects["mineral7"] = new mineral(.6,[0,-0.1,-4.5]);

    grobjects["nexus"] = new nexus(2,[0,0.1,0]);

    grobjects["skybox"] = new skybox();



}());
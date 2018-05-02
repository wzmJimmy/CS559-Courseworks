var grobjects = grobjects || {};

/*
var test = new TexturedPlane();

test.position[1] = 4;
test.scale = [2, 2];
grobjects["TexturedPlane"] = test;
*/


/*
grobjects["sphere1"] = new sphere("s1",0.8, [1,[0,4,0]]);
//grobjects["sphere2"] = new sphere("s2",0.5, [1,[4,4,0]]);
//grobjects["sphere3"] = new sphere("s2",0.5, [1,[-4,4,0]]);

grobjects["bound0"] = new bound("s1",0.8, [1,[4,4,0]]);
grobjects["bound1"] = new bound("s2",1, [1,[0,4,4]]);
*/

//grobjects["core"] = new core();
reflaction =  new reflect_ball();

//grobjects["pyramid"] = new pyramid(1, [1,[0,4,0]]);

grobjects["probe"] = new probe(.7,[2,0.1,2]);
grobjects["probe1"] = new probe(.7,[-2,0.1,2]);
grobjects["probe2"] = new probe(.7,[-2,0.1,-2]);
grobjects["probe3"] = new probe(.7,[2,0.1,-2]);

grobjects["plain"] = new plain(20);

//grobjects["diamond"] = new diamond("s2",1,false,[1,[0,4,0]]);

grobjects["mineral1"] = new mineral(.6,[4.5,-0.1,0]);
grobjects["mineral2"] = new mineral(.6,[-4.5,-0.1,0]);
grobjects["mineral3"] = new mineral(.6,[0,-0.1,4.5]);
grobjects["mineral4"] = new mineral(.6,[0,-0.1,-4.5]);
grobjects["mineral5"] = new mineral(.6,[3.5,-0.1,3.5]);
grobjects["mineral6"] = new mineral(.6,[-3.5,-0.1,3.5]);
grobjects["mineral7"] = new mineral(.6,[3.5,-0.1,-3.5]);
grobjects["mineral8"] = new mineral(.6,[-3.5,-0.1,-3.5]);

//grobjects["brick"] = new brick("s1",1,[1,[0,4,0]]);

grobjects["nexus"] = new nexus(2,[0,0.1,0]);

//grobjects["skybox"] = new skybox(2,[0,4,0]);
grobjects["skybox"] = new skybox();


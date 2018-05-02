var grobjects = grobjects || {};

/*
grobjects["cube1"] = new Cube([-1.2,0.5,0],1);
grobjects["cube2"] = new Cube([ 1.2,0.5,0],1, [1,1,0]);
grobjects["cube3"] = new Cube([ 0,0.5,-1.2],1 , [0,1,0]);
grobjects["cube4"] = new Cube([ 0,0.5,1.2],1);

grobjects["scube1"] = new SpinningCube([-1.2,0.5,-1.2],1);
grobjects["scube2"] = new SpinningCube([-1.2,0.5,  1.2],1,  [1,0,0], 'Y');
grobjects["scube3"] = new SpinningCube([ 1.2,0.5, -1.2],1 , [0,0,1], 'Z');
grobjects["scube4"] = new SpinningCube([ 1.2,0.5,  1.2],1);
*/


//grobjects["Ground Plane"] = ground;


grobjects["copter0"] = new Copter();
grobjects["helipad0"] = new Helipad([3,.01,3]);
grobjects["helipad1"] = new Helipad([3,.01,-3]);
grobjects["helipad2"] = new Helipad([-3,.01,-3]);
grobjects["helipad3"] = new Helipad([-3,.01,3]);

// just to show - if there's a cube, we can land on it
/*var acube = grobjects.cube1;
if (acube) {
    acube.helipad = true;
    acube.helipadAltitude = .5;
}*/


grobjects["pyr"] = pyr;


var test = new TexturedPlane();

/*
test.position[1] = 3;
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

grobjects["core"] = new core();

//grobjects["pyramid"] = new pyramid(1, [1,[0,4,0]]);

grobjects["probe"] = new probe(1,[2,0.1,2]);
grobjects["probe1"] = new probe(1,[-2,0.1,2]);
grobjects["probe2"] = new probe(1,[-2,0.1,-2]);
grobjects["probe3"] = new probe(1,[2,0.1,-2]);

grobjects["plain"] = new plain(5);

//grobjects["diamond"] = new diamond("s2",1,false,[1,[0,4,0]]);

grobjects["mineral1"] = new mineral(.3,[4,-0.1,0]);
grobjects["mineral2"] = new mineral(.3,[-4,-0.1,0]);
grobjects["mineral3"] = new mineral(.3,[0,-0.1,4]);
grobjects["mineral4"] = new mineral(.3,[0,-0.1,-4]);



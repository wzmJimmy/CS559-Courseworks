var lock; // mainly used in changing from animation part.
var appendNum=0; //used for making interface clear.
var color=["Black", "Red", "Orange", "Yellow", "Green", "Aqua", "Blue", "Purple"];

//Function to add slider.
function appendSlider(min,max){
    var x = document.createElement("INPUT");
    x.setAttribute("type", "range");
    x.setAttribute("max", max);
    x.setAttribute("min", min);
    document.body.appendChild(x);
    return x;
}

//Function to delete the slider added in.
function clearAppend(){
    function get_lastchild(n) {
        var x=n.lastChild;
        while (x.nodeType!=1) {x=x.previousSibling;}
        return x;
    }
    for(var i=0;i<appendNum;i++){
        var x = get_lastchild(document.body);
        document.body.removeChild(x);
    }
}

//Function of the first button to draw multi-Triangle
//First slider is for num of sub-triangle
//Second slider is for the rolling state
function Tri() {
    lock=1;
    clearAppend(appendNum);
    appendNum=3;
    var canvas = document.getElementById('myCanvas');
    var slider_num = appendSlider("0","8");
    slider_num.value = 0;
    var slider_rol = appendSlider("0","200");
    var dis_one_roll = 80;
    slider_rol.value = dis_one_roll*3/4;

    function draw() {
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;
        // use the sliders to get various parameters
        var num = slider_num.value;
        var dis = (slider_rol.value - dis_one_roll*3/4)/dis_one_roll;
        var dx = - Math.floor(dis) * Math.round(canvas.width/2);
        var angle = (dis - Math.floor(dis)) * Math.PI *2/3;

        function drawDownTri(len,color){
            context.beginPath();
            context.fillStyle = color;
            context.moveTo(Math.round(len),0);
            context.lineTo(Math.round(len/2),Math.round(len/2*Math.sqrt(3)));
            context.lineTo(Math.round(len/2*3),Math.round(len/2*Math.sqrt(3)));
            context.closePath();
            context.fill();
        }
        function drawFirstTri(len,color){
            context.beginPath();
            context.strokeStyle = color;
            context.moveTo(0,0);
            context.lineTo(Math.round(len),0);
            context.lineTo(Math.round(len/2),Math.round(len/2*Math.sqrt(3)));
            context.closePath();
            context.stroke();
        }
        function drawMultTri(len,layer){
            if(layer==0) {
                drawFirstTri(len,color[0]);
                drawMultTri(len/2,layer+1)
            }
            else if(layer<=num){
                drawDownTri(len,color[layer]);
                drawMultTri(len/2,layer+1);

                context.save();
                context.translate(Math.round(len/2),Math.round(len/2*Math.sqrt(3)));
                drawMultTri(len/2,layer+1);
                context.restore();

                context.save();
                context.translate(Math.round(len),0);
                drawMultTri(len/2,layer+1);
                context.restore();
            }
        }
        context.save();
        context.translate(canvas.width/2 ,canvas.width);
        context.rotate(Math.PI);
        context.save();
        context.translate(dx ,0);
        context.rotate(angle);
        drawMultTri(Math.round(canvas.width/2),0);
        context.restore();
        context.restore();
    }
    slider_num.addEventListener("input",draw);
    slider_rol.addEventListener("input",draw);
    draw();
}

//Function of the second button to draw rotat-Square
//First slider is for num of sub-square
//Second slider is for the rotating state
function Squ() {
    lock=2;
    clearAppend(appendNum);
    appendNum=2;
    var canvas = document.getElementById('myCanvas');
    var slider_num = appendSlider("1","8");
    slider_num.value = 1;
    var slider_rot = appendSlider("0","160");
    var dis_per_deg = 2;
    var deg_lb = 5;
    slider_rot.value = dis_per_deg * (45-deg_lb);

    function draw() {
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;
        // use the sliders to get various parameters
        var num = slider_num.value;
        var angle = (slider_rot.value/dis_per_deg + deg_lb) * Math.PI /180;
        var ratio1 =  Math.tan(angle)/(1+Math.tan(angle));
        var ratio2 = ratio1/Math.sin(angle);
        var len = canvas.width;

        function drawOneSqu(len,color){
            context.fillStyle = color;
            context.fillRect(0,0,len,len);
        }
        function drawSqu(layer){
            if(layer<=num){
                context.save();
                context.translate(Math.round(ratio1*len) ,0);
                context.rotate(angle);
                drawOneSqu(len*ratio2,color[layer]);
                len = len*ratio2;
                drawSqu(layer+1);
                context.restore();
            }
        }
        drawSqu(1);
    }
    slider_num.addEventListener("input",draw);
    slider_rot.addEventListener("input",draw);
    draw();
}

//global varible for convey data from Bal_Set to Bal.
var angle;
var radi;
var speed;

//Function of the third button to initialize bounc-Ball
//First slider is for direction
//Second slider is for the size
//Third slider is for the speed

function Bal_Set() {
    lock=3;
    clearAppend(appendNum);
    appendNum=4;
    var canvas = document.getElementById('myCanvas');
    var slider_dir = appendSlider("0","360");
    slider_dir.value = 0;
    var slider_siz = appendSlider("3","100");
    slider_siz.value = 3;
    var slider_spe = appendSlider("10","100");
    slider_spe.value = 10;

    function drawIni() {
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;
        // use the sliders to get various parameters
        angle = slider_dir.value* Math.PI /180;
        radi =  slider_siz.value;
        speed = slider_spe.value;

        function drawArr() {
            context.beginPath();
            context.strokeStyle = "Red";
            context.lineWidth = "5";
            context.moveTo(0,0);

            //Something wrong with this:
            /*context.lineTo(radi+20,0);
            context.lineTo(radi+10,-10);
            context.moveTo(radi+20,0);
            context.lineTo(radi+10,10);*/

            context.lineTo(140,0);
            context.lineTo(130,-10);
            context.moveTo(140,0);
            context.lineTo(130,10);
            context.stroke();
        }

        context.save();
        context.translate(Math.round(canvas.width/2) ,Math.round(canvas.width/2));
        context.save();
        context.rotate(angle);
        drawArr();
        context.restore();
        context.fillStyle="Black";
        context.beginPath();
        context.arc(0,0,radi ,0,2*Math.PI);
        context.fill();
        context.restore();
    }
    slider_dir.addEventListener("input",drawIni);
    slider_siz.addEventListener("input",drawIni);
    slider_spe.addEventListener("input",drawIni);
    drawIni();

    //add a button
    var x = document.createElement("INPUT");
    x.setAttribute("type", "button");
    x.setAttribute("value", "Start");
    x.setAttribute("onclick", "Bal()");
    document.body.appendChild(x);
}

//Exact fuction to draw bouncing ball
//allow changing size and speed during animation
//remove the direction slider
//the lock is used here to prevent animation still drawing when change to another part and overwriting it.

function Bal() {
    lock = 4;
    clearAppend(appendNum);
    appendNum = 2;
    var canvas = document.getElementById('myCanvas');
    var slider_siz = appendSlider("3", "100");
    slider_siz.value = radi;
    var slider_spe = appendSlider("10", "100");
    slider_spe.value = speed;

    var x=Math.round(canvas.width/2);
    var y=Math.round(canvas.width/2);
    var sx = Math.round(Math.cos(angle)*speed);
    var sy = Math.round(Math.sin(angle)*speed);

    function draw() {
        if(lock==4){
            var context = canvas.getContext('2d');
            canvas.width = canvas.width;
            // use the sliders to get various parameters
            radi =  slider_siz.value;
            speed = slider_spe.value;

            var sx = Math.round(Math.cos(angle)*speed);
            var sy = Math.round(Math.sin(angle)*speed);

            var realborderL=radi;
            var realborderH=canvas.width-radi;
            //easy version of bouncing as no
            // multiple bounce in one axis is allowed.

            x=x+sx;
            //angle exists a risk of overwhelming.
            if(x>=realborderH){
                x = realborderH*2-x;
                angle = Math.PI-angle;
            }else if(x<=realborderL){
                x = realborderL*2-x;
                angle = Math.PI-angle;
            }
            y=y+sy;
            if(y>=realborderH){
                y = realborderH*2-y;
                angle = -angle;
            }else if(y<=realborderL){
                y = realborderL*2-y;
                angle = -angle;
            }
            context.fillStyle = "rgb("+x%255+","+y%255+","+(x+y)%255+")";
            context.beginPath();
            context.arc(x,y,radi ,0,2*Math.PI);
            context.fill();

            window.requestAnimationFrame(draw);
        }
    }
    if(lock==4){
        window.requestAnimationFrame(draw);
    }
}


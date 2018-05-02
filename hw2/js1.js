var run=true;

function Control(){
    run=!run;
}

function mod_2Pi( num) {
    if(num > Math.PI*2) return num - Math.PI*2;
    else return num;
}

if (CanvasRenderingContext2D.prototype.ellipse == undefined) {
    CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
        this.save();
        this.translate(x, y);
        this.rotate(rotation);
        this.scale(radiusX, radiusY);
        this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
        this.restore();
    }
}

//Function of the first button to draw multi-Triangle
//First slider is for num of sub-triangle
//Second slider is for the rolling state
function Tera() {
    var canvas = document.getElementById('myCanvas');
    var slider_spe = document.getElementById('S_multi');
    slider_spe.value = 1;
    var counter = 0;
    var lag =5;
    var deg_spin = 0;
    var deg_craft = 0;
    var deg_earth = 0;
    var deg_moon = 0;
    //var text = ["Landon", "Beijing", "Alaska", "Wisconsin"];

    function draw() {
        if(run){
            var context = canvas.getContext('2d');
            canvas.width = canvas.width;
            // use the sliders to get various parameters
            var mult = slider_spe.value;
            deg_spin = mod_2Pi(deg_spin +mult* Math.PI /6);
            if(counter%lag==0){
                deg_craft = mod_2Pi(deg_craft + mult* Math.PI /48);
                deg_earth = mod_2Pi(deg_earth + mult* Math.PI /96);
                deg_moon = mod_2Pi(deg_moon + mult* Math.PI /(96*4));
            }
            var degs =[deg_earth, deg_earth + Math.PI*2/3,
                deg_earth + Math.PI*7/6, deg_earth + Math.PI*3/2];

            function drawClock(deg){
                context.beginPath();
                context.arc(0,0,34 ,0,2*Math.PI);
                context.stroke();
                context.arc(0,0,30 ,0,2*Math.PI);
                context.stroke();
                context.fillRect(30,-2,4,4);
                context.save();
                context.rotate(deg*2);
                context.fillStyle = "Red";
                context.fillRect(0,-1,15,2);
                context.restore();
                context.rotate(deg*120);
                context.fillStyle = "Blue";
                context.fillRect(0,-1,28,2);
                context.restore();
                context.fillStyle = "Black";
            }

            function drawCraft(){
                function drawDiam(len){
                    context.beginPath();
                    context.moveTo(0,0);
                    context.lineTo(len,len/2);
                    context.lineTo(len*2,0)
                    context.lineTo(len,-len/2);
                    context.closePath();
                }
                drawDiam(30);
                context.fillStyle = "Aqua";
                context.fill();
                context.fillStyle = "Black";

                context.save();
                context.translate(30,0);
                for(var i=45; i<360;i=i+90){
                    context.save();
                    context.rotate(Math.PI*i/180);
                    context.fillRect(0,-1,30,2);
                    context.fillStyle = "Green";
                    context.translate(30,0);
                    context.rotate(Math.PI*i/540-Math.PI/2+deg_spin);
                    drawDiam(6);
                    context.stroke();
                    context.fill();
                    context.rotate(Math.PI);
                    drawDiam(6);
                    context.stroke();
                    context.fill();
                    context.restore();
                }
                context.restore();
            }

            function drawMoon(){
                /*context.scale(320,500);
                context.beginPath();
                context.arc(0,0,1 ,0,2*Math.PI);
                context.stroke();*/

                context.beginPath();
                context.moveTo(320,0);
                context.ellipse(0, 0, 320, 500, 0, 0, Math.PI*2, false);
                context.stroke();

                context.translate(Math.round(320*Math.cos(deg_moon)) ,Math.round(500*Math.sin(deg_moon)));
                context.beginPath();
                context.arc(0,0,20 ,0,2*Math.PI);
                context.fillStyle = "Black";
                context.fill();
            }

            context.translate(canvas.width/2 ,canvas.height/2);
            context.rotate(-Math.PI /2);

            //Draw the Earth.
            context.beginPath();
            context.arc(0,0,200 ,0,2*Math.PI);
            context.stroke();
            context.fillStyle = "rgba(255,255,0,0.1)";
            context.fill();
            context.fillStyle = "Black";

            //Draw the night part.
            context.beginPath();
            context.fillStyle = "rgba(80,80,80,0.1)";
            context.fillRect(-canvas.height/2,-canvas.width/2,canvas.height/2,canvas.width);
            context.fillStyle = "Black";

            //Draw 4 clocks corresponding to Landon, Beijing, Alaska, and Wisconsin.
            for(var i=0;i<4;i=i+1){
                context.save();
                context.rotate(degs[i]);
                context.translate(166,0);
                drawClock(degs[i]);

                //Fail to add text, it seems not change along the corodinate.
                //context.font="50px Georgia";
                //context.fillText(text[i],0,0);

                context.restore();
            }

            //Draw a "spacecraft"(QuadCopter) with a Clock showing
            // time in corresponding time zone.
            context.save();
            context.rotate(deg_craft);
            context.translate(240,0);
            context.save();
            context.translate(0,30);
            context.rotate(-Math.PI/2);
            drawCraft();
            context.restore();
            context.beginPath();
            context.moveTo(0,0);
            context.lineTo(40,0);
            context.stroke();
            context.translate(74,0);
            drawClock(deg_craft);
            context.restore();


            //Draw a Rotating Moon
            context.save();
            context.rotate(Math.PI /6);
            drawMoon();
            context.restore();

            counter = counter+1;
        }
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
    //draw();
}

window.onload = Tera;


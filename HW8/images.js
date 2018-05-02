var Images = {};
function newimage(name,source) {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = source;
    Images[name] = image;
}
newimage("bump1","https://farm1.staticflickr.com/911/39749977330_2fdb9d768e_o.jpg");
newimage("bump2","https://farm1.staticflickr.com/937/39737894770_73905f25c0_b.jpg");
newimage("bump3","https://farm1.staticflickr.com/918/40857834284_c3cb3fbb74_z.jpg");
newimage("dog","https://farm1.staticflickr.com/810/40847085134_986a82800b_z.jpg");
newimage("ATNS","https://farm1.staticflickr.com/890/27698836078_043a4612be_o.png");

//image.src = "https://farm1.staticflickr.com/810/40847085134_986a82800b_z.jpg" ;

window.setTimeout(null,100*Object.keys(Images).length);
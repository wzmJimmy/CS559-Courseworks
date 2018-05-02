var Images = {};
function newimage(name,source,mult) {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = source;
    /*source.forEach(function (url) {
            var img = new Image();
            image.crossOrigin = "anonymous";
            image.src = url;
            image.push(img);
            window.setTimeout(null,100);
        })*/

    Images[name] = image;
}

newimage("bump1","https://farm1.staticflickr.com/911/39749977330_2fdb9d768e_o.jpg");
newimage("bump2","https://farm1.staticflickr.com/937/39737894770_73905f25c0_b.jpg");
newimage("bump3","https://farm1.staticflickr.com/918/40857834284_c3cb3fbb74_z.jpg");
//newimage("dog","https://farm1.staticflickr.com/810/40847085134_986a82800b_z.jpg");
newimage("ATNS","https://farm1.staticflickr.com/890/27698836078_043a4612be_o.png");

newimage("Space0","https://farm1.staticflickr.com/957/41728215621_83a53bd7a7_o.png");
newimage("Space1","https://farm1.staticflickr.com/944/41687229892_b7c90219cb_o.png");
newimage("Space2","https://farm1.staticflickr.com/871/39920063400_6f83b72fdb_o.png");
newimage("Space3","https://farm1.staticflickr.com/981/41687229722_b9aaff3317_o.png");
newimage("Space4","https://farm1.staticflickr.com/950/39920063300_92842081c1_o.png");
newimage("Space5","https://farm1.staticflickr.com/958/40828883675_f4ed0723e7_o.png");

/*newimage("Space",["https://farm1.staticflickr.com/980/39920063520_073c7546bc_o.png",
                "https://farm1.staticflickr.com/944/41687229892_b7c90219cb_o.png",
                "https://farm1.staticflickr.com/871/39920063400_6f83b72fdb_o.png",
                "https://farm1.staticflickr.com/981/41687229722_b9aaff3317_o.png",
                "https://farm1.staticflickr.com/950/39920063300_92842081c1_o.png",
                "https://farm1.staticflickr.com/958/40828883675_f4ed0723e7_o.png"],
                true);*/

//image.src = "https://farm1.staticflickr.com/810/40847085134_986a82800b_z.jpg" ;

window.setTimeout(null,120*Object.keys(Images).length);



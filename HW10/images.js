var Images = {};
function newimage(name,source,mult) {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = source;
    Images[name] = image;
}

newimage("bump1","https://farm1.staticflickr.com/911/39749977330_2fdb9d768e_o.jpg");
newimage("bump2","https://farm1.staticflickr.com/937/39737894770_73905f25c0_b.jpg");
newimage("bump3","https://farm1.staticflickr.com/918/40857834284_c3cb3fbb74_z.jpg");
//newimage("dog","https://farm1.staticflickr.com/810/40847085134_986a82800b_z.jpg");
newimage("ATNS","https://farm1.staticflickr.com/890/27698836078_043a4612be_o.png");

newimage("Probe","https://farm1.staticflickr.com/832/41728570932_0cdf5527a9_o.png");
newimage("Zealot","https://farm1.staticflickr.com/912/26902458197_87224ceced_o.png");
newimage("Immortal","https://farm1.staticflickr.com/866/40871882275_efd7096ec9_o.png");
newimage("Colossus","https://farm1.staticflickr.com/977/27902405198_2c5ce7012b_o.png");
newimage("Carrier","https://farm1.staticflickr.com/872/41053742004_47019926b6_o.png");
newimage("Voidray","https://farm1.staticflickr.com/943/26903250057_ebd8cb2f7e_o.png");
newimage("Hyel","https://farm1.staticflickr.com/968/26903692027_5e9ecb0c4f_o.png");
newimage("Overseer","https://farm1.staticflickr.com/832/41731198172_57cb322cd0_o.png");
newimage("Mutalisk","https://farm1.staticflickr.com/867/26904096997_799cbf1648_o.png");
newimage("Banshee","https://farm1.staticflickr.com/968/40873471785_e13a6930e0_o.png");
newimage("Ultralisk","https://farm1.staticflickr.com/979/41773144531_eb7509fdbf_o.png");
newimage("Thor","https://farm1.staticflickr.com/962/41055260524_79dc3fcd9a_o.png");
newimage("Firebat","https://farm1.staticflickr.com/945/26904961567_1b3969e389_o.png");
newimage("Baneling","https://farm1.staticflickr.com/946/41062604654_812f8c11ea_o.png");
newimage("Mothership","https://farm1.staticflickr.com/910/41791214701_803be710d1_o.png");
newimage("Phoenix","https://farm1.staticflickr.com/910/28003896668_f9504f2c47_o.png");


newimage("Space0","https://farm1.staticflickr.com/957/41728215621_83a53bd7a7_o.png");
newimage("Space1","https://farm1.staticflickr.com/944/41687229892_b7c90219cb_o.png");
newimage("Space2","https://farm1.staticflickr.com/871/39920063400_6f83b72fdb_o.png");
newimage("Space3","https://farm1.staticflickr.com/981/41687229722_b9aaff3317_o.png");
newimage("Space4","https://farm1.staticflickr.com/950/39920063300_92842081c1_o.png");
newimage("Space5","https://farm1.staticflickr.com/958/40828883675_f4ed0723e7_o.png");


window.setTimeout(null,120*Object.keys(Images).length);




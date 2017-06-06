var surfaces;
var volume;
var screen;
var shade = "phong";
var refrection = "phong";
var isovalue;
var colorName = "blue2red";

function main()
{
    volume = new KVS.LobsterData();
    screen = new KVS.THREEScreen();

    screen.init( volume, {
        width: window.innerWidth * 0.8,
        height: window.innerHeight,
        enableAutoResize: false
    });

    var bounds = Bounds( volume );
    screen.scene.add( bounds );


    document.addEventListener( 'mousemove', function() {
        screen.light.position.copy( screen.camera.position );
    });

    window.addEventListener( 'resize', function() {
        screen.resize( [ window.innerWidth * 0.8, window.innerHeight ] );
    });

    var isovalue = 50;
    surfaces = Isosurfaces( volume, isovalue, "phong.vert", "phong_phong.frag", "blue2red");
    screen.scene.add( surfaces );

    screen.loop();
}

function update_isovalue(isovalue_, shade_, refrection_, colorName_)
{
    if(shade_ == "") shade_ = shade;
    if(refrection_ == "") refrection_ = refrection;
    if(colorName_ == "") colorName_ = colorName;
    if(isovalue_ < 0) isovalue_ = isovalue;
    screen.scene.remove(surfaces);
    surfaces.geometry.dispose();
    surfaces.material.dispose();

    var vert, frag;
    if(shade_ == "phong"){
        vert = "phong.vert";
        if(refrection_ == "phong") frag = "phong_phong.frag"
        if(refrection_ == "lambert") frag = "phong_lambert.frag"
    }

    if(shade_ == "gourand"){
        frag = "gourand.frag"
        if(refrection_ == "phong") vert = "gourand_phong.vert";
        if(refrection_ == "lambert") vert = "gourand_lambert.vert";
    }

    surfaces = Isosurfaces( volume, isovalue_, vert, frag, colorName_);
    screen.scene.add( surfaces );
}

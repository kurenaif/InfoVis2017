var surfaces;
var volume;
var screen;

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
    surfaces = Isosurfaces( volume, isovalue, screen.light, screen.camera );
    screen.scene.add( surfaces );

    screen.loop();
}

function update_isovalue(isovalue)
{
    screen.scene.remove(surfaces);

    surfaces = Isosurfaces( volume, isovalue );
    screen.scene.add( surfaces );
}

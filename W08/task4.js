function main(num)
{
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );

    var light = new THREE.PointLight();
    light.position.set( 5, 5, 5 );
    scene.add( light );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.TorusKnotGeometry( 1, 0.3, 100, 20 );
    var material;
    if(num == 1){
    material = new THREE.ShaderMaterial({
            vertexColors: THREE.VertexColors,
            vertexShader: document.getElementById('gourand_phong.vert').text,
            fragmentShader: document.getElementById('gourand.frag').text,
            uniforms: {
                light_position: {type: 'v3', value: light.position},
                camera_direction: {type: 'v3', value: camera.position}
            }
        });
    }
    else if(num == 2){
        material = new THREE.ShaderMaterial({
            vertexColors: THREE.VertexColors,
            vertexShader: document.getElementById('gourand_cook-torrance.vert').text,
            fragmentShader: document.getElementById('gourand.frag').text,
            uniforms: {
                light_position: {type: 'v3', value: light.position},
                camera_direction: {type: 'v3', value: camera.position}
            }
        });
    }
    else if(num == 3){
        material = new THREE.ShaderMaterial({
            vertexColors: THREE.VertexColors,
            vertexShader: document.getElementById('gourand_lambert.vert').text,
            fragmentShader: document.getElementById('gourand.frag').text,
            uniforms: {
                light_position: {type: 'v3', value: light.position},
                camera_direction: {type: 'v3', value: camera.position}
            }
        });
    }

    var torus_knot = new THREE.Mesh( geometry, material );
    scene.add( torus_knot );

    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        torus_knot.rotation.x += 0.01;
        torus_knot.rotation.y += 0.01;
        renderer.render( scene, camera );
    }
}

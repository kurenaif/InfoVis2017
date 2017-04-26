function main()
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

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var vertices = [
        [-1, -1, 0],
        [1, -1, 0],
        [-1, 1, 0],
        [1, 1, 0],
        [1, -1, -2],
        [1, 1, -2],
        [-1, 1, -2],
        [-1, -1, -2]
    ];

    var faces = [
        [0,1,2],
        [1,3,2],
        [0,2,7],
        [7,2,6],
        [5,2,3],
        [5,6,2],
        [1,4,3],
        [4,5,3],
        [1,0,7],
        [1,7,4],
        [4,7,6],
        [4,6,5],
    ];

    var vectors = [];
    var face3s = [];

    for (var i = 0;i<vertices.length;i++){
        vectors.push(new THREE.Vector3().fromArray(vertices[i]));
    }
    for (var i=0;i<faces.length;i++){
        face3s.push(new THREE.Face3(faces[i][0], faces[i][1], faces[i][2]));
    }

    var id = faces[0];
    var f0 = new THREE.Face3( id[0], id[1], id[2] );

    var geometry = new THREE.Geometry();
    for (var i = 0;i<vectors.length;i++){
        geometry.vertices.push(vectors[i]);
    }
    for (var i=0;i<face3s.length;i++){
        geometry.faces.push(face3s[i]);
    }

    //var material = new THREE.MeshBasicMaterial();
    var material = new THREE.MeshLambertMaterial();
    // material.vertexColors = THREE.FaceColors;
    // geometry.faces[0].color = new THREE.Color(1,0,0);
    material.vertexColors = THREE.VertexColors;
    geometry.faces[0].vertexColors.push(new THREE.Color(1,0,0));
    geometry.faces[0].vertexColors.push(new THREE.Color(0,1,0));
    geometry.faces[0].vertexColors.push(new THREE.Color(0,0,1));
    geometry.computeFaceNormals();
    var triangle = new THREE.Mesh( geometry, material );
    scene.add( triangle );

    var light = new THREE.PointLight(0xffffff);
    light.position.set(1,1,100);
    scene.add(light);

    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        triangle.rotation.x -= 0.005;
        triangle.rotation.y -= 0.005;
        renderer.render( scene, camera );
    }
}

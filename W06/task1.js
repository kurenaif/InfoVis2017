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
    ];

    var faces = [
        [0,1,2],
        [1,3,2]
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
    geometry.faces.push(face3s[0]);

    var material = new THREE.MeshBasicMaterial();
    // material.vertexColors = THREE.FaceColors;
    // geometry.faces[0].color = new THREE.Color(1,0,0);
    material.vertexColors = THREE.VertexColors;
    geometry.faces[0].vertexColors.push(new THREE.Color(1,0,0));
    geometry.faces[0].vertexColors.push(new THREE.Color(0,1,0));
    geometry.faces[0].vertexColors.push(new THREE.Color(0,0,1));
    var triangle = new THREE.Mesh( geometry, material );
    scene.add( triangle );

    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        triangle.rotation.x += 0.001;
        triangle.rotation.y += 0.001;
        renderer.render( scene, camera );
    }
}

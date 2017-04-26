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
    geometry.computeFaceNormals();

    // var material = new THREE.MeshBasicMaterial();
    var material = new THREE.MeshLambertMaterial();
    material.vertexColors = THREE.VertexColors;
    var triangle = new THREE.Mesh( geometry, material );
    scene.add( triangle );

    var light = new THREE.PointLight(0xffffff);
    light.position.set(1,1,100);
    scene.add(light);

    document.addEventListener('mousedown', mouse_down_event);

    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        triangle.rotation.x -= 0.05;
        triangle.rotation.y -= 0.010;
        renderer.render( scene, camera );
    }

    function mouse_down_event(event){
        var x_win = event.clientX;
        var y_win = event.clientY;
        
        var vx = renderer.domElement.offsetLeft;
        var vy = renderer.domElement.offsetTop;
        var vw = renderer.domElement.width;
        var vh = renderer.domElement.height;

        var x_NDC = 2*(x_win - vx)/ vw - 1;
        var y_NDC = -(2 * (y_win - vy)/vh -1);


        var p_NDC = new THREE.Vector3(x_NDC, y_NDC, 1);
        var p_wld = p_NDC.unproject(camera);

        var raycaster = new THREE.Raycaster(camera.position, p_wld.normalize());
        var intersects = raycaster.intersectObject(triangle);
        if(intersects.length>0){
            intersects[0].face.color.setRGB(1,0,0);
            intersects[0].object.geometry.colorsNeedUpdate = true;
        }
    }
}

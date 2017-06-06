function MakeColormapBlue2Red(S){
    var R = Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
    var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
    var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
    var color = new THREE.Color( R, G, B );
    return color;
}

function MakeColormapRed2Blue(S){
    S = 1-S;
    var R = Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
    var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
    var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
    var color = new THREE.Color( R, G, B );
    return color;
}

function MakeColormapWhite2Red(S){
    var R = 1.0;
    var G = 1.0 - S;
    var B = 1.0 - S;
    var color = new THREE.Color( R, G, B );
    return color;
}


function get_color_map(mapName_){
    var cmap = [];
    for ( var i = 0; i < 256; i++ )
    {
        var S = i/255.0;
        var color;
        if(mapName_ == "blue2red") color = MakeColormapBlue2Red(S);
        if(mapName_ == "red2blue") color = MakeColormapRed2Blue(S);
        if(mapName_ == "white2red") color = MakeColormapWhite2Red(S);
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
    return cmap;
}

function Isosurfaces( volume, isovalue_, vert_, frag_, colorName_)
{
    vert = vert_;
    frag = frag_;
    isovalue = isovalue_;
    colorName = colorName_;
    var camera = screen.camera;
    var light = screen.light;
    var cmap = get_color_map(colorName_);
    var color = new THREE.Color( GetColor(isovalue,0,255,cmap));
    var material = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        vertexShader: document.getElementById(vert).text,
        fragmentShader: document.getElementById(frag).text,
        uniforms: {
            light_position: {type: 'v3', value: light.position},
            camera_direction: {type: 'v3', value: camera.position},
            my_color: {type: 'v3', value: color}
        }
    });
    var geometry = new THREE.Geometry();
    // var material = new THREE.MeshLambertMaterial();

    var smin = volume.min_value;
    var smax = volume.max_value;
    isovalue = KVS.Clamp( isovalue, smin, smax );

    var lut = new KVS.MarchingCubesTable();
    var cell_index = 0;
    var counter = 0;
    for ( var z = 0; z < volume.resolution.z - 1; z++ )
    {
        for ( var y = 0; y < volume.resolution.y - 1; y++ )
        {
            for ( var x = 0; x < volume.resolution.x - 1; x++ )
            {
                var indices = cell_node_indices( cell_index++ );
                var index = table_index( indices );
                var values = cell_node_values( indices );
                if ( index == 0 ) { continue; }
                if ( index == 255 ) { continue; }

                for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                {
                    var eid0 = lut.edgeID[index][j];
                    var eid1 = lut.edgeID[index][j+2];
                    var eid2 = lut.edgeID[index][j+1];

                    var vid0 = lut.vertexID[eid0][0];
                    var vid1 = lut.vertexID[eid0][1];
                    var vid2 = lut.vertexID[eid1][0];
                    var vid3 = lut.vertexID[eid1][1];
                    var vid4 = lut.vertexID[eid2][0];
                    var vid5 = lut.vertexID[eid2][1];

                    var v0 = new THREE.Vector3( x + vid0[0], y + vid0[1], z + vid0[2] );
                    var v1 = new THREE.Vector3( x + vid1[0], y + vid1[1], z + vid1[2] );
                    var v2 = new THREE.Vector3( x + vid2[0], y + vid2[1], z + vid2[2] );
                    var v3 = new THREE.Vector3( x + vid3[0], y + vid3[1], z + vid3[2] );
                    var v4 = new THREE.Vector3( x + vid4[0], y + vid4[1], z + vid4[2] );
                    var v5 = new THREE.Vector3( x + vid5[0], y + vid5[1], z + vid5[2] );

                    var val0 = get_value(v0);
                    var val1 = get_value(v1);
                    var val2 = get_value(v2);
                    var val3 = get_value(v3);
                    var val4 = get_value(v4);
                    var val5 = get_value(v5);

                    var v01 = interpolated_vertex( v0, v1, isovalue, val0, val1 );
                    var v23 = interpolated_vertex( v2, v3, isovalue, val2, val3 );
                    var v45 = interpolated_vertex( v4, v5, isovalue, val4, val5 );

                    geometry.vertices.push( v01 );
                    geometry.vertices.push( v23 );
                    geometry.vertices.push( v45 );

                    geometry.colors.push(new THREE.Color(0xff0000));
                    geometry.colors.push(new THREE.Color(0xff0000));
                    geometry.colors.push(new THREE.Color(0xff0000));

                    var id0 = counter++;
                    var id1 = counter++;
                    var id2 = counter++;
                    geometry.faces.push( new THREE.Face3( id0, id1, id2 ) );
                }
            }
            cell_index++;
        }
        cell_index += volume.resolution.x;
    }

    geometry.computeVertexNormals();

    material.color = new THREE.Color( GetColor(isovalue,0,255,cmap));

    return new THREE.Mesh( geometry, material );


    function cell_node_indices( cell_index )
    {
        var lines = volume.resolution.x;
        var slices = volume.resolution.x * volume.resolution.y;

        var id0 = cell_index;
        var id1 = id0 + 1;
        var id2 = id1 + lines;
        var id3 = id0 + lines;
        var id4 = id0 + slices;
        var id5 = id1 + slices;
        var id6 = id2 + slices;
        var id7 = id3 + slices;

        return [ id0, id1, id2, id3, id4, id5, id6, id7 ];
    }

    function table_index( indices )
    {
        var s0 = volume.values[ indices[0] ][0];
        var s1 = volume.values[ indices[1] ][0];
        var s2 = volume.values[ indices[2] ][0];
        var s3 = volume.values[ indices[3] ][0];
        var s4 = volume.values[ indices[4] ][0];
        var s5 = volume.values[ indices[5] ][0];
        var s6 = volume.values[ indices[6] ][0];
        var s7 = volume.values[ indices[7] ][0];

        var index = 0;
        if ( s0 > isovalue ) { index |=   1; }
        if ( s1 > isovalue ) { index |=   2; }
        if ( s2 > isovalue ) { index |=   4; }
        if ( s3 > isovalue ) { index |=   8; }
        if ( s4 > isovalue ) { index |=  16; }
        if ( s5 > isovalue ) { index |=  32; }
        if ( s6 > isovalue ) { index |=  64; }
        if ( s7 > isovalue ) { index |= 128; }

        return index;
    }

    function cell_node_values( indicies ){
        var s0 = volume.values[ indices[0] ][0];
        var s1 = volume.values[ indices[1] ][0];
        var s2 = volume.values[ indices[2] ][0];
        var s3 = volume.values[ indices[3] ][0];
        var s4 = volume.values[ indices[4] ][0];
        var s5 = volume.values[ indices[5] ][0];
        var s6 = volume.values[ indices[6] ][0];
        var s7 = volume.values[ indices[7] ][0];
        return [s0, s1, s2, s3, s4, s5, s6, s7];
    }

    function get_value(v){
        var lines = volume.resolution.x;
        var slices = volume.resolution.x * volume.resolution.y;

        var index = v.x+v.y*lines+v.z*slices;

        var res = volume.values[index];

        return res;
    }

    function interpolated_vertex( v0, v1, s, val0, val1 )
    {
        var mul = (s-val0)/(val1-val0);
        var res = v1; // => v0
        res.addScaledVector(v0, -1); // => (v0-v1)
        res.multiplyScalar(mul); // => (v0-v1) * (s-vol0)/(val1-val0)
        res.add(v0); // => (v0-v1) * (s-vol0)/(val1-val0) + v0
        // return new THREE.Vector3().addVectors( v0, v1 ).divideScalar( 2 );
        return res;
    }

    function GetColor(S,S_min,S_max,cmap){
        var resolution = cmap.length;
        var index = Normalize(S,S_min,S_max)*(resolution-1);
        var index0 = Math.floor(index);
        var index1 = Math.min(index0+1,resolution-1);
        var t = index - index0; // t = (index-index0)/(index1-index0)
        var C0 = new THREE.Color().setHex( cmap[ index0 ][1] );
        var C1 = new THREE.Color().setHex( cmap[ index1 ][1] );
        var R = Interpolate(C0.r,C1.r,t);
        var G = Interpolate(C0.g,C1.g,t);
        var B = Interpolate(C0.b,C1.b,t);
        return new THREE.Color(R,G,B);
    }
    
    function Normalize(S,S_min,S_max){ // e.g. S:0.1~0.8 -> S:0~1
        return (S-S_min)/(S_max-S_min);
    }

    function Interpolate(S0,S1,t){ 
        return (1-t)*S0+t*S1;
    }
}

	<script type="x-shader/x-vertex" id="phong.vert">
		varying vec3 point_color;
		varying vec4 point_position;
		varying vec3 normal_vector;
		uniform vec3 light_position;
		uniform vec3 camera_direction;
		uniform vec3 my_color;

		void main()
		{
			point_position = modelViewMatrix * vec4( position, 1.0 );
			normal_vector = normalMatrix * normal;
			point_color = my_color;
			gl_Position = projectionMatrix * point_position;
		}
	</script>
	<script type="x-shader/x-fragment" id="phong_phong.frag">
		varying vec3 point_color;
		varying vec4 point_position;
		varying vec3 normal_vector;
		uniform vec3 light_position;
		uniform vec3 camera_direction;

		vec3 PhongReflection(vec3 C, vec3 L, vec3 N)
		{
			float ka = 0.2;
			float kd = 0.6;
			float ks = 1.0;
			float n = 50.0;
			vec3 V = normalize(camera_direction);

			vec3 R = reflect(-L, N);
			float dd = max(dot(N,L), 0.0);
			float ds = pow(max(dot(R,V), 0.0), n);
			if (dd <= 0.0) {ds = 0.0;}

			float Ia = ka;
			float Id = kd * dd;
			float Is = ks * ds;
			return C*(Ia+Id+Is);
		}

		void main()
		{
			vec3 C = point_color;
			vec3 L = normalize(light_position - point_position.xyz);
			vec3 N = normalize(normal_vector);

			vec3 shaded_color = PhongReflection(C,L,N);
			gl_FragColor = vec4( shaded_color, 1.0 );
		}
	</script>

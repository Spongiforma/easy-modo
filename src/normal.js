const colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
}

let HEIGHT = window.innerHeight,
	WIDTH = window.innerWidth,
	aspectRatio = WIDTH/HEIGHT,
	FOV = 60,
	nearPlane = 0.1,
	farPlane = 100000,
	scene,
	container,
	renderer,
	camera,
	clock,
	stats,
	trackballControls,
	transformControls,
	raycaster,
	hoverObject,
	selectedObject,
	pointer = new THREE.Vector2(),
	GUI ;

function createScene() {
	window.addEventListener('resize',handleWindowResize,false);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		FOV,
		aspectRatio,
		nearPlane,
		farPlane
	);
	camera.position.z = 15;
	camera.position.x = 12;
	camera.lookAt(scene.position)

	stats = initStats();

	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0x000000));
	renderer.setSize(WIDTH,HEIGHT);


	scene.add(new THREE.HemisphereLight(0xaaaaaa,0x000000,.9))

	let geom = new THREE.BoxBufferGeometry( 2, 2, 2 );

	// let mat = new THREE.ShaderMaterial({
	// 	uniforms: {
	// 		size: {
	// 			value: new THREE.Vector3(geom.parameters.width, geom.parameters.height, geom.parameters.depth).multiplyScalar(0.5)
	// 		},
	// 		thickness: {
	// 			value: 0.01
	// 		},
	// 		smoothness: {
	// 			value: 0.05
	// 		}
	// 	},
	// 	vertexShader: vertexShader,
	// 	fragmentShader: fragmentShader
	// });

	let box = new THREE.Mesh( geom,  new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
	scene.add( box );


	const gridHelper = new THREE.GridHelper( 100, 100 );
	scene.add( gridHelper );
	const axesHelper = new THREE.AxesHelper( 100 );
	scene.add( axesHelper );

	raycaster = new THREE.Raycaster();
	document.addEventListener( 'mousemove', (event) => {
		pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	} );
	document.addEventListener('click',(event) => {
		if (hoverObject) {
			selectObject(hoverObject)
		}
	})

	document.getElementById('viewport').appendChild(renderer.domElement);

	// must come after appendChild
	trackballControls = initTrackballControls(camera, renderer);
	trackballControls.update();

	transformControls = initTransformControls(camera,renderer);
	scene.add(transformControls)

	GUI = new dat.GUI();

	clock = new THREE.Clock();
}
function selectObject(obj) {
	transformControls.attach(obj);
	selectedObject = hoverObject
	selectedObject.material.emissive.setHex( 0x696969 );
}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	aspectRatio = WIDTH / HEIGHT;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = aspectRatio;
	camera.updateProjectionMatrix();
}

function animate() {
	trackballControls.update(clock.getDelta());
	transformControls.update(clock.getDelta());

	stats.update(clock.getDelta())

	checkRaycastSelect()

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function checkRaycastSelect() {
	raycaster.setFromCamera( pointer, camera );
	const intersects = raycaster.intersectObjects( scene.children ).filter(it => it.object.type === 'Mesh');
	if ( intersects.length > 0 ) {
		if ( hoverObject !== intersects[ 0 ].object && intersects[0].object !== selectedObject) {
			if ( hoverObject ) hoverObject.material.emissive.setHex( hoverObject.currentHex );
			hoverObject = intersects[ 0 ].object;
			hoverObject.currentHex = hoverObject.material.emissive.getHex();
			hoverObject.material.emissive.setHex( 0xff0000 );
		}
	} else {
		if ( hoverObject && hoverObject!== selectedObject ) hoverObject.material.emissive.setHex( hoverObject.currentHex );
		hoverObject = null;
	}
}
function bindKeys() {

}

function init() {
	createScene();
	animate();
}

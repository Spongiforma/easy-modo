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
	trackballControls;

function createScene() {
	window.addEventListener('resize',handleWindowResize,false);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		FOV,
		aspectRatio,
		nearPlane,
		farPlane
	);
	stats = initStats();

	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0x000000));
	renderer.setSize(WIDTH,HEIGHT);


	scene.add(new THREE.HemisphereLight(0xaaaaaa,0x000000,.9))
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;
	camera.position.x = 2;
	camera.lookAt(scene.position);

	document.getElementById('viewport').appendChild(renderer.domElement);

	// must come after appendChild
	trackballControls = initTrackballControls(camera, renderer);
	clock = new THREE.Clock();

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
	stats.update()

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function init() {
	createScene();
	animate();
}

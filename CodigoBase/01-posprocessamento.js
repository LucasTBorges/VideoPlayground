// Convertendo a cor dos pixels de uma imagem via pós-processamento

import * as THREE 				from 'three';
import Webcam from './project/video/webcam.js';
import { GUI } 					from 'gui';
	
import { EffectComposer } 		from 'post_proc/EffectComposer.js';
import { RenderPass } 			from 'post_proc/RenderPass.js';
import { ShaderPass } 			from 'post_proc/ShaderPass.js';
import { LuminosityShader } 	from 'shaders/LuminosityShader.js';

const gui = new GUI();

let 	controls, 
		scene,
		camera,
		renderer,
		composer;

const 	params = { enable : true };

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************
let webcam = new Webcam();
let video;
let sizeW;
webcam.init().subscribe(init);

function init() {

	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	camera.position.z = 0.01;

	scene = new THREE.Scene();

	const tex = webcam.getTexture();
	tex.colorSpace = THREE.SRGBColorSpace;

	const geometry = new THREE.PlaneGeometry( 8, 6 );
	geometry.scale( 0.5, 0.5, 0.5 );
	const material = new THREE.MeshBasicMaterial( { map: tex } );

	const count = 128;
	const radius = 32;

	var plane 			= new THREE.Mesh 	( 	new THREE.PlaneGeometry(), 
													new THREE.MeshBasicMaterial( { map 	: tex }) );
		plane.position.set(0.0, 0.0, -0.5);
		plane.name = "Imagem";
		scene.add( plane );	

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	sizeW = webcam.width;
	renderer.setSize(webcam.width, webcam.height);
	renderer.setAnimationLoop( animate );
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize );

	//


}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	renderer.render( scene, camera );
	if (sizeW != webcam.width){
		sizeW = webcam.width;
		renderer.setSize(webcam.width, webcam.height);
	}
}
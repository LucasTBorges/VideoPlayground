// Convertendo a cor dos pixels de uma imagem via pós-processamento

import * as THREE 				from 'three';
import Webcam from './framework/video/webcam.js';
import VideoFile from './framework/video/videoFile.js';
import Interface from './framework/interface/interface.js';

import ThreeJsCanvas from './project/components/threejsCanvas/threejsCanvas.js';
import VideoInput from './project/components/videoInput/videoInput.js';
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
let ui = new Interface();
let menu = ui.appendChild("menu", new VideoInput()).show();
let canvas = ui.appendChild("canvas", new ThreeJsCanvas("Visualização de Vídeo")).hide();
let video;
menu.onSubmitFile(initFile);
menu.onSelectWebcam(initWebcam);
function initFile(){
	video = new VideoFile();
	video.init().subscribe(main);
}

function initWebcam(){
	video = new Webcam();
	video.init().subscribe(main);
}

function main() {
	menu.destroy();
	video.play();
	canvas.show();
	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	camera.position.z = 0.01;

	scene = new THREE.Scene();

	const tex = video.getTexture();

	const geometry = new THREE.PlaneGeometry( 8, 6 );
	geometry.scale( 0.5, 0.5, 0.5 );

	var plane 			= new THREE.Mesh 	( 	new THREE.PlaneGeometry(), 
													new THREE.MeshBasicMaterial( { map 	: tex }) );
		plane.position.set(0.0, 0.0, -0.5);
		plane.name = "Imagem";
		scene.add( plane );	

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	const dimensions = getDimensions();
	renderer.setSize(dimensions.x, dimensions.y);
	renderer.setAnimationLoop( animate );
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize );

	//


}

function getDimensions(){
	const size = 1;
	const width = video.getFixedWidth()*size;
	const height = video.getFixedHeight()*size;
	return {x:width, y:height};
}

function onWindowResize() {
	const dimensions = getDimensions();
	renderer.setSize(dimensions.x, dimensions.y);
}

function animate() {

	renderer.render( scene, camera );
}
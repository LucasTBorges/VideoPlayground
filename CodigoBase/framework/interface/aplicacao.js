
import { THREE, GUI } from '../util/imports.js';
import GuiManager from './GuiManager.js';
import Webcam from '../video/webcam.js';
import VideoFile from '../video/videoFile.js';
import Interface from '../interface/interface.js';
import ThreeJsCanvas from '../components/threejsCanvas/threejsCanvas.js';
import VideoInput from '../components/videoInput/videoInput.js';
export default class Aplicacao {
    constructor(){
        this.gui = new GUI().hide();
        this.ui = new Interface();
        this.guiManager = new GuiManager(this.gui);
        this.controls = {};
        this.guiManager.addTab("video", this.makeVideoControls());
        this.canvas = this.ui.appendChild("canvas", new ThreeJsCanvas("Visualização de Vídeo")).hide();
        this.init();
    }

    init(){
        this.getVideo();
    }

    getVideo() {
        this.menu = this.ui.appendChild("menu", new VideoInput()).show();
        this.video;
        const that = this;
        this.menu.onSubmitFile(()=>{
            that.video = new VideoFile();
            that.video.init().subscribe(this.makeScene.bind(this));
        });
        this.menu.onSelectWebcam(()=>{
            that.video = new Webcam();
            that.video.init().subscribe(this.makeScene.bind(this));
        });
    }

    makeScene() {
        this.menu.destroy();
        this.canvas.show();
        this.camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
        this.camera.position.z = 0.01;
        this.scene = new THREE.Scene();
        const tex = this.video.getTexture();
        const geometry = new THREE.PlaneGeometry( 8, 6 );
        geometry.scale( 0.5, 0.5, 0.5 );
        var plane = new THREE.Mesh( new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial( { map : tex }) );
        plane.position.set(0.0, 0.0, -0.5);
        plane.name = "video";
        this.scene.add( plane );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.gui.show();
        this.fitScreen();
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.canvas.getElement().appendChild(this.renderer.domElement);
        window.addEventListener( 'resize', this.fitScreen.bind(this));
        this.video.play();
    }

    fitScreen() {
        const dimensions = this.getDimensions();
        this.renderer.setSize(dimensions.x, dimensions.y);
        //Ajusta a posição do GUI: se a tela for grande o suficiente, o GUI fica à direita do vídeo
        //Caso contrário, o GUI fica o mais a direita possível
        //Para funcionar, o GUI deve estar visível
        if(window.innerWidth - dimensions.x >= this.gui.domElement.clientWidth){
            console.log(window.innerWidth - dimensions.x, this.gui.domElement.clientWidth)
            this.gui.domElement.style.left = dimensions.x + "px";
        } else {
            this.gui.domElement.style.left = "";
        }
    }

    getDimensions() {
        const width = this.video.getFitWidth();
        const height = this.video.getFitHeight();
        return {x: width, y: height};
    }

    makeVideoControls(){
        const that = this
        Object.assign(this.controls, {"Play": () =>{
            that.video.play();
            that.playButton.hide()
            that.pauseButton.show()
        }, "Pause": () =>{
            that.video.pause();
            that.pauseButton.hide()
            that.playButton.show()
        }});
        this.playButton = this.gui.add(this.controls, "Play").hide();
        this.pauseButton = this.gui.add(this.controls, "Pause");
        return [this.playButton, this.pauseButton];
    }

    animate() {
        this.renderer.render( this.scene, this.camera );
    }
}
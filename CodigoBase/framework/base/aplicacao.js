
import { THREE, GUI } from '../util/imports.js';
import GuiManager from './GuiManager.js';
import Interface from './interface.js';
import ThreeJsCanvas from '../components/threejsCanvas/threejsCanvas.js';
import Observable from '../util/observable.js';
import ToastService from '../services/toastService.js';
import GuiComponent from '../components/guiComponent/guiComponent.js';
import VideoService from '../services/videoService.js';
import LoadingService from '../services/loadingService.js';
export default class Aplicacao {
    constructor(title){
        this.ui = new Interface();
        this.guiComponent = this.ui.appendChild("gui", new GuiComponent());
        this.gui = new GUI({container:this.guiComponent.element}).hide();
        this.loadingService = new LoadingService(this);
        this.toastService = new ToastService(this);
        this.videoService = new VideoService(this);
        this.guiManager = new GuiManager(this.gui);
        this.controls = {};
        this.guiManager.addTab("video", this.makeVideoControls());
        this.canvas = this.ui.appendChild("canvas", new ThreeJsCanvas(title)).hide();
        this.onInit = new Observable();
    }

    // Por padrão, o método init() pega um vídeo do usuário através 
    // do service videoService e inicia a aplicação
    init(){
        const app = this;
        this.videoService.getVideo()
        .subscribe((video)=>{
            app.video = video;
            app.makeScene();
            app.onInit.emit();
        })
        .onFail((error)=>{
            app.toastService.show("error","Erro ao carregar o vídeo", error, 4000);
        });
    }

    makeScene() {
        this.canvas.show();
        this.camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
        this.camera.position.z = 0.01;
        this.scene = new THREE.Scene();
        const tex = this.video.getTexture();
        const geometry = new THREE.PlaneGeometry( 8, 6 );
        geometry.scale( 0.5, 0.5, 0.5 );
        this.plane = new THREE.Mesh( new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial( { map : tex }) );
        this.plane.position.set(0.0, 0.0, -0.5);
        this.plane.name = "video";
        this.scene.add( this.plane );
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
        console.log(window.innerWidth - dimensions.x, this.gui.domElement.clientWidth);
        if(window.innerWidth - dimensions.x >= this.gui.domElement.clientWidth){
            this.guiComponent.element.style.left = dimensions.x + "px";
            this.guiComponent.element.style.right = "";
        } else {
            this.guiComponent.element.style.left = "";
            this.guiComponent.element.style.right = "0";
        }
    }

    getDimensions() {
        const width = this.video.getFitWidth();
        const height = this.video.getFitHeight();
        return {x: width, y: height};
    }

    makeVideoControls(){
        const app = this
        Object.assign(this.controls, 
        {"Play": () =>{
            app.video.play();
            app.playButton.hide()
            app.pauseButton.show()
        }, "Pause": () =>{
            app.video.pause();
            app.pauseButton.hide()
            app.playButton.show()
        }});
        this.playButton = this.gui.add(this.controls, "Play").hide();
        this.pauseButton = this.gui.add(this.controls, "Pause");
        return [this.playButton, this.pauseButton];
    }

    animate() {
        this.renderer.render( this.scene, this.camera );
    }
}
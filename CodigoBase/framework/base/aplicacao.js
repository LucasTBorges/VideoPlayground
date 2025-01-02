
import { THREE, GUI, EffectComposer, RenderPass } from '../util/imports.js';
import GuiManager from './guiManager.js';
import Interface from './interface.js';
import ThreeJsCanvas from '../components/threejsCanvas/threejsCanvas.js';
import Observable from '../util/observable.js';
import ToastService from '../services/toastService.js';
import GuiComponent from '../components/guiComponent/guiComponent.js';
import VideoService from '../services/videoService.js';
import LoadingService from '../services/loadingService.js';
import ColorSpaceFix from '../util/colorSpaceFix.js';
export default class Aplicacao {
    constructor(title){
        this.ui = new Interface();
        this.guiComponent = this.ui.addComponent("gui", new GuiComponent());
        this.gui = new GUI({container:this.guiComponent.getElement()}).hide();
        // A ordem de inicialização dos serviços é importante.
        // As dependências de um serviço devem ser inicializadas antes dele
        this.loadingService = new LoadingService(this);
        this.toastService = new ToastService(this);
        this.videoService = new VideoService(this);
        this.guiManager = new GuiManager(this.gui);
        this.controls = {};
        this.guiManager.addAlwaysOnItems(this.makeVideoControls());
        this.canvas = this.ui.addComponent("canvas", new ThreeJsCanvas(title)).hide();
        this.onInit = new Observable();
        this.onInit.subscribe(()=>{
            this.video.play();
        });
        this.onResizeEvent = new Observable();
        this.onRender = new Observable(); //Emite timeDelta
        this.clock = new THREE.Clock();
        this.time = 0;
    }

    // Ao iniciar a aplicação, onInit é emitido e o vídeo é reproduzido
    init(){
        this.videoService.getVideo()
        .subscribe((video)=>{
            this.video = video;
            this.makeScene();
            this.onInit.emit();
        })
        .onFail((error)=>{
            this.toastService.show("error","Erro ao carregar o vídeo", error, 4000);
        });
        return this;
    }

    makeScene() {
        this.canvas.show();
        this.camera = new THREE.OrthographicCamera( 0, 1, 1, 0, -1.0, 1.0 );
        this.camera.position.z = 0.01;
        this.scene = new THREE.Scene();
        const tex = this.video.getTexture();
        const geometry = new THREE.PlaneGeometry( 1, 1 );
        geometry.scale( 0.5, 0.5, 0.5 );
        this.plane = new THREE.Mesh( new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial( { map : tex }) );
        this.plane.position.set(0.5, 0.5, -0.5);
        this.plane.name = "video";
        this.scene.add( this.plane );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        const colorCorrection = new ColorSpaceFix(this);
        this.gui.show();
        this.onResize();
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.canvas.getElement().appendChild(this.renderer.domElement);
        window.addEventListener( 'resize', this.onResize.bind(this));
    }

    onResize() {
        const dimensions = this.getDimensions();
        this.dimensions = dimensions;
        this.renderer.setSize(dimensions.x, dimensions.y);
        this.composer.setSize(dimensions.x, dimensions.y);
        this.guiComponent.fixPosition(dimensions);
        this.onResizeEvent.emit(dimensions);
    }

    getDimensions() {
        const width = this.video.getFitWidth();
        const height = this.video.getFitHeight();
        return {x: width, y: height, rawX: this.video.getWidth(), rawY: this.video.getHeight()};
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
        this.composer.render();
        const delta = this.clock.getDelta();
        this.time += delta;
        this.onRender.emit(delta);
    }
}

import { THREE, GUI } from '../util/imports.js';
import GuiManager from './GuiManager.js';
import Webcam from '../video/webcam.js';
import VideoFile from '../video/videoFile.js';
import Interface from './interface.js';
import ThreeJsCanvas from '../components/threejsCanvas/threejsCanvas.js';
import VideoInput from '../components/videoInput/videoInput.js';
import Observable from '../util/observable.js';
import ToastService from '../services/toastService.js';
import GuiComponent from '../components/guiComponent/guiComponent.js';
export default class Aplicacao {
    constructor(title){
        this.ui = new Interface();
        this.guiComponent = this.ui.appendChild("gui", new GuiComponent());
        this.gui = new GUI({container:this.guiComponent.element}).hide();
        this.toastService = new ToastService(this);
        this.guiManager = new GuiManager(this.gui);
        this.controls = {};
        this.guiManager.addTab("video", this.makeVideoControls());
        this.canvas = this.ui.appendChild("canvas", new ThreeJsCanvas(title)).hide();
        this.onInit = new Observable();
    }

    // Por padrão, o método init() pega um vídeo do usuário através 
    // do componente VideoInput e inicia a aplicação
    init(){
        this.getVideo()
        .subscribe(()=>{
            this.makeScene();
            this.onInit.emit();
        })
        .onFail((error)=>{
            this.toastService.show("error","Erro ao carregar o vídeo", error, 5000);
        });
    }

    //Cria o componente com o menu de Input de Vídeo, retorna um Observable que emite o vídeo selecionado
    getVideo() {
        const onGetVideo = new Observable();
        this.menu = this.ui.appendChild("menu", new VideoInput()).show();
        this.video;
        const that = this;
        this.menu.onSubmitFile(()=>{
            that.video = new VideoFile();
            that.video.init()
            .subscribe(()=>{
                onGetVideo.emit(that.video)
                that.menu.destroy();
            })
            .onFail((error)=>{
                onGetVideo.fail(error);
            });
        });
        this.menu.onSelectWebcam(()=>{
            if(that.loadingWebcam) return; //Evita que um duplo clique cause um tentativa de iniciar a webcam duas vezes
            that.loadingWebcam = true;
            that.video = new Webcam();
            that.video.init()
            .subscribe(()=>{
                onGetVideo.emit(that.video)
                that.menu.destroy();
                this.loadingWebcam = false;
            })
            .onFail((error)=>{
                onGetVideo.fail(error);
                this.loadingWebcam = false;
            });
        });
        return onGetVideo;
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
            this.guiComponent.element.style.right = "0px";
        }
    }

    getDimensions() {
        const width = this.video.getFitWidth();
        const height = this.video.getFitHeight();
        return {x: width, y: height};
    }

    makeVideoControls(){
        const that = this
        Object.assign(this.controls, 
        {"Play": () =>{
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
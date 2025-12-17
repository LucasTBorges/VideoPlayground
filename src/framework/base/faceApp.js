import Aplicacao from "./aplicacao.js";
import FaceApiService from "../services/faceapiService.js";
export default class FaceApp extends Aplicacao {
    constructor(title){
        super(title);
        this.faceApiService = new FaceApiService(this);
        this.onInit.subscribe(()=>{
            this.faceApiService.init();
        })
        this.frame = 0;
    }

    init(){
        const app = this;
        this.faceApiService.getModel()
        .subscribe((model)=>{
            this.chosenModel = model;
            this.videoService.getVideo()
            .subscribe((video)=>{
                app.loadingService.show();
                app.video = video;
                app.faceApiService.loadModelEvent.subscribe(()=>{
                    app.makeScene();
                    app.onInit.emit();
                }).onFail((error)=>{
                    app.toastService.show("error","Erro ao carregar o modelo de detecção facial", error, 4000);
                });
            }).onFail((error)=>{
                app.toastService.show("error","Erro ao carregar o vídeo", error, 4000);
            });
        })
        .onFail((error)=>{
            this.toastService.show("error","Erro ao carregar o modelo de detecção de face", error, 4000);
        });
    }

    animate(){
        super.animate();
        if (this.video.isPlaying)
            this.faceApiService.detectFace();
        if(this.frame<7){//Espera 6 frames para desligar o loading (A aplicação fica alguns segundos em tela preta antes de inicializar de fato)
            this.frame++;
            if(this.frame==6){
                this.loadingService.hide();
            }
        }
    }
}
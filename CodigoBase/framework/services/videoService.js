import Service from "../base/service.js";
import VideoInput from "../components/videoInput/videoInput.js";
import Webcam from '../video/webcam.js';
import VideoFile from '../video/videoFile.js';
import Observable from "../util/observable.js";
export default class VideoService extends Service {
    //Depende do ToastService e do LoadingService
    constructor(app) {
        super(app);
        this.toastService = app.toastService;
        this.loadingService = app.loadingService;
        if (!this.toastService) throw new Error("VideoService depende do ToastService. Service não encontrado na aplicação.");
        if (!this.loadingService) throw new Error("VideoService depende do LoadingService. Service não encontrado na aplicação.");
        this.gettingVideo = false;
        this.loadingWebcam = false;
    }

    //Cria o componente com o menu de Input de Vídeo, retorna um Observable que emite o vídeo selecionado
    getVideo() {
        if(this.gettingVideo) return; //Evita que o menu de escolha de vídeo seja inicializado duas vezes
        const service = this;
        this.gettingVideo = true;
        const onGetVideo = new Observable();
        const menu = this.ui.addComponent("videoInput", new VideoInput()).show();

        let video;
        menu.onSubmitFile(()=>{
            video = new VideoFile();
            video.init()
            .subscribe(()=>{
                onGetVideo.emit(video)
                menu.destroy();
                service.gettingVideo = false;
            })
            .onFail((error)=>{
                onGetVideo.fail(error);
            });
        });
        menu.onSelectWebcam(()=>{
            if(service.loadingWebcam) return; //Evita que um duplo clique cause um tentativa de iniciar a webcam duas vezes
            service.loadingService.show();
            service.loadingWebcam = true;
            video = new Webcam();
            video.init()
            .subscribe(()=>{
                onGetVideo.emit(video)
                menu.destroy();
                service.gettingVideo = false;
                service.loadingWebcam = false;
                service.loadingService.hide();
            })
            .onFail((error)=>{
                onGetVideo.fail(error);
                service.loadingWebcam = false;
                service.loadingService.hide();
            });
        });
        return onGetVideo;
    }
}
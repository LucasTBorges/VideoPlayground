import Observable from "../util/observable.js";
import Video from "./video.js";
export default class Webcam extends Video {
    constructor() {
        super();
        this.source = "webcam";
    }

    //Pede permissão para acessar a webcam e retorna um observável que será executado quando a webcam for carregada
    init(){
        const loadEvent = new Observable();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = {
                video: { facingMode: 'user' }
            }; 
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                this.video.srcObject = stream;
                const track = stream.getVideoTracks()[0];
                const settings = track.getSettings();
                this.width = settings.width;
                this.height = settings.height;
                this.video.width = this.width;
                this.video.height = this.height;
                loadEvent.emit();
            }).catch((error) => {
                loadEvent.fail(error);
            });
        } else{
            loadEvent.fail("Não foi possível acessar a webcam");
        }
        return loadEvent;
    }
}
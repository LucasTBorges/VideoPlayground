import Observable from "../util/observable.js";
import Video from "./video.js";
export default class Webcam extends Video {
    constructor() {
        super();
    }

    init(){
        const loadEvent = new Observable();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = {
                video: { facingMode: 'user' }
            }; 
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                this.video.srcObject = stream;
                this.video.play();
                const track = stream.getVideoTracks()[0];
                const settings = track.getSettings();
                this.width = settings.width;
                this.height = settings.height;
                this.video.width = this.width;
                this.video.height = this.height;
                loadEvent.execute();
            }).catch((error) => {
                console.error('Erro no getUserMedia:', error);
            });
        } else{
            loadEvent.fail("navigator.mediaDevices.getUserMedia não encontrado");
        }
        return loadEvent;
    }
}
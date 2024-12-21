import Video from "./video.js"
import Observable from "../util/observable.js";
export default class VideoFile extends Video {
    constructor(){
        super();
        this.fileInput = document.createElement('input');
        this.fileInput.style.display = 'none';
        this.fileInput.type = 'file';
        this.fileInput.isMultiple = false;
        this.fileInput.accept = 'video/*';
        this.fileInput.addEventListener('change', this.loadFile.bind(this));
        this.initEvent = new Observable();
    }

    init(){
        this.fileInput.click();
        return this.initEvent;
    }

    loadFile(){
        try {
            const file = this.fileInput.files[0];
            this.video.src = URL.createObjectURL(file);
            const video = this.video;
            let that = this;
            this.video.onloadedmetadata = function(){
                that.width = video.videoWidth;
                that.height = video.videoHeight;
                video.width = that.width;
                video.height = that.height;
                that.video.play();
                that.initEvent.execute();
            }
        } catch (error) {
            this.initEvent.fail(error);
        }
    }
}
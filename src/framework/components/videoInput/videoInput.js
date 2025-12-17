import Component from '../../base/component.js';

export default class VideoInput extends Component {
    //Componente que contém o menu de escolha de vídeo, e emite eventos para a escolha de arquivo ou webcam
    init(){
        super.init();
        this.fileButton = this.element.querySelector("#file-button");
        this.webcamButton = this.element.querySelector("#webcam-button");
        return this;
    }

    getHTML() {
        return `
            <div class="card">
                <h3>Choose the base video stream</h3>
                <div class="card-body">
                    <button id="file-button" class="button-17" role="button">Submit a File</button>
                    <p>or</p>
                    <button id="webcam-button" class="button-17" role="button">Use Webcam</button>
                </div>
            </div>
        `;
    }

    onSubmitFile(callback){
        this.fileButton.onclick = callback;
    }

    onSelectWebcam(callback){
        this.webcamButton.onclick = callback;
    }

}
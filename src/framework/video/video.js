import { THREE } from "../util/imports.js";
export default class Video {
    constructor() {
        this.video = document.createElement('video');
        this.video.style.display = 'none';
        this.video.playsInline = true;
        this.width = 0;
        this.height = 0;
        this.video.autoplay = false;
        this.video.loop = true;
        this.texture = null;
        this.isPlaying = false;
        this.source = undefined; // ("webcam" | "file") - Indica a origem do vídeo, deve ser definido do construtor das classes filhas
    }

    //Função que resgata o vídeo e retorna um observável que será executado quando o vídeo for carregado
    //Deve configurar a largura e altura do vídeo
    init(){
        throw new Error("Método abstrato init não implementado");
    };

    //Retorna a textura do Three.js com referência ao vídeo
    getTexture(){
        if (this.texture) return this.texture;
        this.texture = new THREE.VideoTexture(this.video,THREE.UVMapping,THREE.MirroredRepeatWrapping,THREE.MirroredRepeatWrapping);
        this.texture.colorSpace = THREE.LinearSRGBColorSpace;
        //this.texture.colorSpace = THREE.SRGBColorSpace; -> Causa problemas de cor no vídeo quando um filtro é aplicado
        return this.texture;
    }

    //Retorna a largura do vídeo
    getWidth(){
        return this.width;
    }

    //Retorna a altura do vídeo
    getHeight(){
        return this.height;
    }

    //Retorna a largura do vídeo ajustada para a largura da janela
    getFitWidth() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const videoAspectRatio = this.getWidth() / this.getHeight();
        const screenAspectRatio = screenWidth / screenHeight;

        if (videoAspectRatio > screenAspectRatio) {
            return screenWidth;
        } else {
            return screenHeight * videoAspectRatio;
        }
    }

    //Retorna a altura do vídeo ajustada para a altura da janela
    getFitHeight() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const videoAspectRatio = this.getWidth() / this.getHeight();
        const screenAspectRatio = screenWidth / screenHeight;

        if (videoAspectRatio > screenAspectRatio) {
            return screenWidth / videoAspectRatio;
        } else {
            return screenHeight;
        }
    }

    //Retorna a razão de aspecto do vídeo
    getRatio() {
        return this.getWidth() / this.getHeight();
    }

    //Retorna a proporção entre a o vídeo original e o vídeo ajustado para a largura da janela
    getFitRatio() {
        return this.getFitWidth() / this.getWidth();
    }

    //Reproduz o vídeo
    play(){
        if (this.isPlaying) return;
        this.video.play();
        this.isPlaying = true;
    }

    //Pausa o vídeo
    pause(){
        if (!this.isPlaying) return;
        this.video.pause();
        this.isPlaying = false;
    }
}
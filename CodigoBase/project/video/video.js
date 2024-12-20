import * as THREE from "/Assets/scripts/three.js/build/three.module.js";
export default class Video {
    constructor() {
        this.video = document.createElement('video');
        this.video.style.display = 'none';
        this.video.playsInline = true;
        this.width = 0;
        this.height = 0;
        this.video.autoplay = true;
        this.video.loop = true;
        this.texture = null;
    }

    init(){
        throw new Error("Método abstrato init não implementado");
    };

    getTexture(){
        if (this.texture) return this.texture;
        this.texture = new THREE.VideoTexture(this.video);
        this.texture.colorSpace = THREE.SRGBColorSpace;
        return this.texture;
    }
}
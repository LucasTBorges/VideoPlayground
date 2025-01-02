import FaceApp from "./framework/base/faceApp.js";
import ImageService from "./framework/services/imageService.js";
import { THREE } from "./framework/util/imports.js";
import MaskFilter from "./project/filters/mask.js";
ImageService
class Mask2DApp extends FaceApp {
    constructor(){
        super("Máscara 2D");
        this.imageService = new ImageService(this);
        this.onInit.subscribe(()=>this.createMaskFilter());
    }

    init(){
        this.imageService.getImageTexture()
        .subscribe((tex)=>{
            this.imageTexture = tex;
            super.init();
        })
        .onFail((error)=>{
            this.toastService.show("error","Erro ao carregar a imagem", error, 4000);
        });
    }

    createMaskFilter(){
        return new MaskFilter(this);
    }
}
const app = new Mask2DApp().init();
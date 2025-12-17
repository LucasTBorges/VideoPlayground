import Service from "../base/service.js";
import ImageInput from "../components/imageInput/imageInput.js";
import Observable from "../util/observable.js";
import { THREE } from "../util/imports.js";
export default class ImageService extends Service {
    //Depende do ToastService e do LoadingService
    constructor(app) {
        super(app);
        this.toastService = app.toastService;
        this.loadingService = app.loadingService;
        if (!this.toastService) throw new Error("ImageService depende do ToastService. Service não encontrado na aplicação.");
        if (!this.loadingService) throw new Error("ImageService depende do LoadingService. Service não encontrado na aplicação.");
        this.gettingImage = false;
        this.image = new Image();
        this.fileInput = document.createElement('input');
        this.fileInput.style.display = 'none';
        this.fileInput.type = 'file';
        this.fileInput.isMultiple = false;
        this.fileInput.accept = 'image/*';
        this.fileInput.addEventListener('change', this.onLoadFile.bind(this));
        this.textureEvent = new Observable();
    }

    onLoadFile(){
        this.loadingService.show();
        const file = this.fileInput.files[0];
        this.image.src = URL.createObjectURL(file);
        let textureLoader = new THREE.TextureLoader();
        textureLoader.load(this.image.src, (tex)=>{
            this.loadingService.hide();
            this.textureEvent.emit(tex);
        },
        (error)=>{
            this.loadingService.hide();
            this.textureEvent.fail(error);
        })
    }

    onChooseDefault(){
        this.loadingService.show();
        let textureLoader = new THREE.TextureLoader();
        textureLoader.load("/src/assets/mascara.png",
        (tex)=>{
            this.loadingService.hide();
            this.textureEvent.emit(tex);
            this.showDefaultImageCredits();
        }),
        (error)=>{
            this.loadingService.hide();
            this.textureEvent.fail(error);
        }
    }

    //Cria o componente com o menu de Input de imagem, retorna um Observable que emite o imagem selecionado
    getImageTexture() {
        if(this.gettingImage) return; //Evita que o menu de escolha de imagem seja inicializado duas vezes
        const observable = new Observable();
        this.gettingImage = true;
        const menu = this.ui.addComponent("imageInput", new ImageInput()).show();
        let image;
        menu.onSubmitFile(()=>{
            this.fileInput.click();
        });
        menu.onSelectDefault(()=>{
            this.onChooseDefault();
        });
        this.textureEvent.subscribe((tex)=>{
            menu.destroy();
            this.gettingImage = false;
            observable.emit(tex);
        }).onFail((error)=>{
            this.gettingImage = false;
            observable.fail(error);
        });
        return observable;
    }

    showDefaultImageCredits(){
        const creditsDiv = document.createElement('div');
        creditsDiv.className = 'credits-overlay';
        creditsDiv.innerHTML = `
            Default mask image:
            <a href="https://www.emojis.com/emoji/venitian-carnival-mask-FZqS2JhUdl" target="_blank" rel="noopener noreferrer">"Venitian Carnival Mask"</a> 
        `;
        document.body.appendChild(creditsDiv);
    }
}
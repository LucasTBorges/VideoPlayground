import Aplicacao from "./framework/base/aplicacao.js";
import Dropup from "./framework/components/dropup/dropup.js";
class postProcApp extends Aplicacao {
    constructor() {
        super("Pós-processamento de vídeos");
        this.filterPicker = new Dropup("Adicionar Filtro", [
            {label: "Nenhum", value: "none"},
            {label: "Sepia", value: "sepia"},
            {label: "Preto e Branco", value: "bw"},
            {label: "Invertido", value: "invert"},
            {label: "Pixelado", value: "pixel"},
            {label: "Desfoque", value: "blur"},
            {label: "Contorno", value: "edge"},
            {label: "Face Only", value: "face"}
        ], (value) => {
            this.toastService.show("info","Teste Filtro", "Adicionado filtro "+value, 2000);
        });
        this.ui.addComponent("filterPicker",this.filterPicker).hide();
    }

    init() {
        this.videoService.getVideo()
        .subscribe((video)=>{
            this.video = video;
            this.makeScene();
            this.onInit.emit();
        })
        .onFail((error)=>{
            this.toastService.show("error","Erro ao carregar o vídeo", error, 4000);
        });
    }

    makeScene() {
        super.makeScene();
        this.filterPicker.show();
        this.onResize();
    }

    onResize() {
        super.onResize();
        this.filterPicker.fixPosition(this.getDimensions());
    }
}

const app = new postProcApp().init();
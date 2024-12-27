import Aplicacao from "./framework/base/aplicacao.js";
import Dropup from "./framework/components/dropup/dropup.js";
import MonochromaticFilter from "./project/filters/monochromatic.js";
class postProcApp extends Aplicacao {
    constructor() {
        super("Pós-processamento de vídeos");
    }

    makeScene() {
        super.makeScene();
        this.filterPicker = new Dropup("Adicionar Filtro", [
            {label: "Monocromático", value: MonochromaticFilter},
        ], (value) => {
            new value(this.guiManager, this.composer);
        });
        this.ui.addComponent("filterPicker",this.filterPicker).hide();
        this.filterPicker.show();
        this.onResize();
    }

    onResize() {
        super.onResize();
        if(this.filterPicker){
            this.filterPicker.fixPosition(this.getDimensions());
        }
    }

    animate() {
        this.composer.render();
    }
}

const app = new postProcApp().init();
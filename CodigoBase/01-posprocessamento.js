import Aplicacao from "./framework/base/aplicacao.js";
import Dropup from "./framework/components/dropup/dropup.js";
import MonochromaticFilter from "./project/filters/monochromatic.js";
import DotScreenFilter from "./project/filters/dotscreen.js";
import RainbowFilter from "./project/filters/rainbow.js";
class postProcApp extends Aplicacao {
    constructor() {
        super("Pós-processamento de vídeos");
    }

    makeScene() {
        super.makeScene();
        this.filterPicker = new Dropup("Adicionar Filtro", [
            {label: "Monocromático", value: MonochromaticFilter},
            {label: "Dot Screen", value: DotScreenFilter},
            {label: "Rainbow", value: RainbowFilter}
        ], (filter) => {
            new filter(this);
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
}

const app = new postProcApp().init();
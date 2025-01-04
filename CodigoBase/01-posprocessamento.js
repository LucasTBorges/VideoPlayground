import Aplicacao from "./framework/base/aplicacao.js";
import Dropup from "./framework/components/dropup/dropup.js";
import MonochromaticFilter from "./project/filters/monochromatic.js";
import DotScreenFilter from "./project/filters/dotscreen.js";
import RainbowFilter from "./project/filters/rainbow.js";
import LogGammaFilter from "./project/filters/log-gamma.js";
import CaleidoscopioFilter from "./project/filters/caleidoscopio.js";
import SobelFilter from "./project/filters/sobel.js";
import NegativoFilter from "./project/filters/negativo.js";
import MultiplyFilter from "./project/filters/multiply.js";
import HexagonFilter from "./project/filters/hexagons.js";
class postProcApp extends Aplicacao {
    constructor() {
        super("Pós-processamento de vídeos");
    }

    makeScene() {
        super.makeScene();
        this.filterPicker = new Dropup("Adicionar Filtro", [
            {label: "Correção Log/Gamma", value: LogGammaFilter},
            {label: "Monocromático", value: MonochromaticFilter},
            {label: "Dot Screen", value: DotScreenFilter},
            {label: "Rainbow", value: RainbowFilter},
            {label: "Caleidoscópio", value: CaleidoscopioFilter},
            {label: "Sobel", value: SobelFilter},
            {label: "Negativo", value: NegativoFilter},
            {label: "Multiplicar", value: MultiplyFilter},
            {label: "Hexágonos", value: HexagonFilter},
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
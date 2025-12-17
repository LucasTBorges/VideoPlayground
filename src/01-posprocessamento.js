import Aplicacao from "./framework/base/aplicacao.js";
import Dropup from "./framework/components/dropup/dropup.js";
import MonochromaticFilter from "./filters/monochromatic.js";
import DotScreenFilter from "./filters/dotscreen.js";
import RainbowFilter from "./filters/rainbow.js";
import LogGammaFilter from "./filters/log-gamma.js";
import CaleidoscopioFilter from "./filters/caleidoscopio.js";
import SobelFilter from "./filters/sobel.js";
import NegativoFilter from "./filters/negativo.js";
import MultiplyFilter from "./filters/multiply.js";
import HexagonFilter from "./filters/hexagons.js";
class postProcApp extends Aplicacao {
    constructor() {
        super("Video Post-processing");
    }

    makeScene() {
        super.makeScene();
        this.filterPicker = new Dropup("Add Filter", [
            {label: "Log/Gamma Correction", value: LogGammaFilter},
            {label: "Monochromatic", value: MonochromaticFilter},
            {label: "Dot Screen", value: DotScreenFilter},
            {label: "Rainbow", value: RainbowFilter},
            {label: "Kaleidoscope", value: CaleidoscopioFilter},
            {label: "Sobel", value: SobelFilter},
            {label: "Negative", value: NegativoFilter},
            {label: "Multiply", value: MultiplyFilter},
            {label: "Hexagons", value: HexagonFilter},
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
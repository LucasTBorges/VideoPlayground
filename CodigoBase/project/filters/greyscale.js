import Filtro from "../../framework/base/filtro.js";
import { LuminosityShader  } from "../../framework/util/imports.js";
class GreyscaleFilter extends Filtro {
    makeControls() {
        return []
    }

    makeShader() {
        return LuminosityShader;
    }
}
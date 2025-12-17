import FaceApp from "./framework/base/faceApp.js";
//import { THREE } from "./framework/util/imports.js";
import AnonimizacaoFilter from "./filters/anonimizacao.js";
class AnonFiltersApp extends FaceApp {
    constructor(){
        super("Anonymization Filters");
        this.onInit.subscribe(()=>new AnonimizacaoFilter(this))
    }

}
const app = new AnonFiltersApp().init();
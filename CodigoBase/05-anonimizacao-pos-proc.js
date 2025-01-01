import FaceApp from "./framework/base/faceApp.js";
import { THREE } from "./framework/util/imports.js";
import AnonimizacaoFilter from "./project/filters/anonimizacao.js";
class AnonFiltersApp extends FaceApp {
    constructor(){
        super("Filtros de Anonimização");
        this.onInit.subscribe(()=>new AnonimizacaoFilter(this))
    }

}
const app = new AnonFiltersApp().init();
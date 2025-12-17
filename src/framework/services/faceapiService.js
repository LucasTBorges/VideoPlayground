import Service from "../base/service.js";
import ModelPicker from "../components/modelPicker/modelPicker.js";
import Observable from "../util/observable.js";
import { THREE } from "../util/imports.js";
const MODELS_URL =  "../lib/face-api/models"
export const MODELS = {
    TINY: "tinyface",
    MOBILENET: "mobilenet"
}

//const faceapi = window.faceapi;

export default class FaceApiService extends Service {
    //Depende do ToastService
    constructor(app) {
        super(app);
        this.toastService = app.toastService;
        this.video = undefined;
        this.gettingModel = false;
        this.detection = {
            faceDetected: false,
            facePos: {x:0,y:0},
            faceDim: {x:1,y:1}
        }
        this.loadModelEvent = new Observable();
        this.detectFaceEvent = new Observable();
        this.loadingModel = false;
        this.modelPicked = undefined;
        this.initiated = false;
        this.options = undefined;
    }

    //Cria o componente com o menu de input de modelo, retorna um Observable que emite o modelo selecionado
    getModel() {
        if(this.gettingModel) return; //Evita que o menu de escolha de modelo seja inicializado duas vezes
        const service = this;
        this.gettingModel = true;
        const onGetModel = new Observable();
        const menu = this.ui.addComponent("modelPicker", new ModelPicker()).show();
        menu.onTinyface(()=>{
            if (service.loadingModel) return; //Evita que múltiplos modelos sejam carregados simultaneamente
            service.loadingModel = true;
            onGetModel.emit(MODELS.TINY);
            menu.destroy();
            service.gettingModel = false;
            service.modelPicked = MODELS.TINY;
            try{
                faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL)
                .then(()=>{
                    service.loadModelEvent.emit(MODELS.TINY);
                });
            }catch(e){
                service.modelPicked = undefined;
                service.toastService.show("error","Erro ao carregar modelo de reconhecimento facial", e, 5000);
            }
        });
        menu.onMobilenet(()=>{
            if (service.loadingModel) return; //Evita que múltiplos modelos sejam carregados simultaneamente
            service.loadingModel = true;
            onGetModel.emit(MODELS.MOBILENET);
            menu.destroy();
            service.gettingModel = false;
            service.modelPicked = MODELS.MOBILENET;
            try{
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URL)
                .then(()=>{
                    service.loadModelEvent.emit(MODELS.MOBILENET);
                });
            }catch(e){
                service.modelPicked = undefined;
                onGetModel.fail(e);
            }
        });
        return onGetModel;
    }

    //Inicializa o reconhecimento facial
    init(){
        if (this.initiated) return;
        if (!this.modelPicked) {
            this.toastService.show("error","Modelo de reconhecimento facial não carregado", "Selecione um modelo de reconhecimento facial", 5000);
            return;
        }
        this.video = this.app.video
        if (this.modelPicked === MODELS.TINY) {
            const options = {
                inputSize: 224,
                scoreThreshold: 0.6
            };
            this.options = new faceapi.TinyFaceDetectorOptions(options);
        } else if (this.modelPicked === MODELS.MOBILENET) {
            const options = {
                minConfidence: 0.6
            };
            this.options = new faceapi.SsdMobilenetv1Options(options);
        } else {
            this.toastService.show("error","Modelo de reconhecimento facial inválido",`${this.modelPicked} não é um modelo válido`, 5000);
            return;
        }
        this.initiated = true;
    }

    //Detecta o rosto na imagem
    async detectFace() {
        if (!this.initiated) return this.detection;
        if (!this.modelPicked) {
            this.toastService.show("error","Modelo de reconhecimento facial não carregado", "Selecione um modelo de reconhecimento facial", 5000);
            return;
        }
        let detection = await faceapi.detectSingleFace(this.video.video, this.options)

        this.detection.faceDetected = detection !== undefined;
        if (this.detection.faceDetected) {
            detection = faceapi.resizeResults(
                detection,
                {width: 1, height: 1}
            );
            //Correção da bounding box, que costuma ficar um pouco deslocada
            const offsetX = this.modelPicked === MODELS.TINY?0.016:0.006
            const offsetY = this.modelPicked === MODELS.TINY?-0.007:0
            this.detection.facePos = {x: detection.box.x+offsetX, y: detection.box.y+offsetY};
            this.detection.faceDim = {x: detection.box.width, y: detection.box.height};
        } else {
            this.detection.facePos = {x:0,y:0};
            this.detection.faceDim = {x:0.0001,y:0.0001};
        }
        this.detectFaceEvent.emit(this.detection);
        return this.detection;
    }

    //Retorna o tamanho e posição para a geometria do plano que representa a bounding box do rosto
    getPlaneInformation(detection){
        const scaleMultiplier = {x:this.modelPicked===MODELS.MOBILENET?2:1.7, y:this.modelPicked===MODELS.MOBILENET?2:1.8};
        const dim ={x:detection.faceDim.x, y:detection.faceDim.y}
        const pos= {x:(detection.facePos.x)+0.5*dim.x,
                    y: 1-(detection.facePos.y)-0.5*dim.y}
        return {
            scale: new THREE.Vector3(scaleMultiplier.x*dim.x,scaleMultiplier.y*dim.y,1),
            pos: new THREE.Vector3(pos.x,pos.y,0)
        }
    }

    //Retorna os limites da bounding box do rosto nas coordenadas UV
    getUVBounds(detection){
        const scaleMultiplier = {x:this.modelPicked===MODELS.MOBILENET?1:0.85, y:this.modelPicked===MODELS.MOBILENET?1:0.9};
        const dim ={x:detection.faceDim.x, y:detection.faceDim.y}
        const pos= {x:(detection.facePos.x),
                    y: 1-(detection.facePos.y)}
        return {
            u: new THREE.Vector2(pos.x+dim.x*0.5*-(scaleMultiplier.x-1),pos.x+dim.x*scaleMultiplier.x),
            v: new THREE.Vector2(pos.y-dim.y*scaleMultiplier.y,pos.y)
        }
    }
}
import FaceApp from "./framework/base/faceApp.js";
import { THREE, GLTFLoader } from "./framework/util/imports.js";
import Observable from "./framework/util/observable.js";
function luminance(rgb){
    return 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2];
}
const copyCanvasResolution = 3; //Resolução do canvas de cópia para análise de cor dos cantos do vídeo
class Mask3DApp extends FaceApp {
    constructor(){
        super("3D Mask");
        this.onMaskLoaded = new Observable();
        this.initiated =false;
        Observable.and(this.onInit, this.onMaskLoaded)
        .subscribe(()=>{this.makeScene();this.initiated = true;})
        .onFail((error)=>{this.toastService.show("error","Erro ao iniciar aplicação", error, 4000)});
        this.makeCopyCanvas();
        this.parameters = {iluminacao:2};
        this.guiManager.addAlwaysOnItems(this.makeLightControls()); 
    }
    
    loadMask(){
        const gltfLoader = new GLTFLoader();
        gltfLoader.load("/src/assets/mask/scene.gltf", 
        (mesh)=>{
            this.mascara = mesh.scene;
            this.onMaskLoaded.emit();
        },
        (loadingProgress)=>{},
        (error)=>{
            this.onMaskLoaded.fail(error);
        });
    }

    init(){
        const app = this;
        this.loadMask();
        this.faceApiService.getModel()
        .subscribe((model)=>{
            this.chosenModel = model;
            this.videoService.getVideo()
            .subscribe((video)=>{
                app.loadingService.show();
                app.video = video;
                app.onInit.emit();
                app.showModelCredits()
            }).onFail((error)=>{
                app.toastService.show("error","Erro ao carregar o vídeo", error, 4000);
            });
        })
        .onFail((error)=>{
            this.toastService.show("error","Erro ao carregar o modelo de detecção de face", error, 4000);
        });
    }

    makeLightControls(){
        this.lightControl = this.gui
        .add(this.parameters, 'iluminacao',{"Normal":0, "Colorida":1, "Dinâmica":2})
        .name("Iluminação")
        .onChange((value)=>{
            if(!this.initiated) return;
            switch(value){
                case 0:
                    this.onSelectLuzNormal();
                    break;
                case 1:
                    this.onSelectLuzColorida();
                    break;
                case 2:
                    this.onSelectLuzDinamica();
                    break;
            }
        });
        return [
            this.lightControl
        ];
    }

    makeScene(){
        super.makeScene();
        if (!this.mascara){
            this.toastService.show("error","Máscara não carregada", "A máscara 3D não foi carregada corretamente", 4000);
            return
        }
        const ratio = this.video.getRatio();
        this.mascara.scale.set(0.03/ratio,0.03*ratio,0.03);
        this.mascara.rotation.y = 0;
        this.mascara.rotation.x = Math.PI/2;
        this.mascara.rotation.z = 0;
        this.mascara.position.set(0,-0.08,0);
        this.mascara.name = "mask";
        const maskGroup = new THREE.Group();
        maskGroup.position.set(0.5,0.5,0);
        maskGroup.add(this.mascara);
        this.scene.add(maskGroup);
        this.lights = [
            new THREE.PointLight(0xFFFFFF),
            new THREE.PointLight(0xFFFFFF),
            new THREE.PointLight(0xFFFFFF),
            new THREE.PointLight(0xFFFFFF)
        ];
        for (let i = 0; i<2; i++) {
            for (let j = 0; j<2; j++) {
                const index = i*2+j;
                this.lights[index].position.set(i,j,1);
                this.lights[index].intensity = 4;
                this.scene.add(this.lights[index]);
                this.scene.add(this.lights[index]);
            }
        }
        this.mascara.visible = false;
        this.faceApiService.detectFaceEvent.subscribe((detection)=>{
            this.mascara.visible = detection.faceDetected;
            const vectors = this.faceApiService.getPlaneInformation(detection);
            maskGroup.position.set(vectors.pos.x,vectors.pos.y,0);
            const scale = Math.max(vectors.scale.x,vectors.scale.y);
            maskGroup.scale.set(scale,scale,1);
        });
    }

    onSelectLuzNormal(){
        for (let i = 0; i<4; i++){
            this.lights[i].intensity = 3;
            this.lights[i].color.set(0xFFFFFF);
        }
    }

    onSelectLuzColorida(){
        const colors = [0xFF0000,0x00FF00,0xFFFFFF,0x0000FF];
        for (let i = 0; i<4; i++){
            this.lights[i].intensity = 4;
            this.lights[i].color.set(colors[i]);
        }
    }

    onSelectLuzDinamica(){
        this.updateDynamicLight();
    }

    //Cria um canvas para copiar a imagem do vídeo, para identificar a cor dos cantos do vídeo para a iluminação dinâmica
    makeCopyCanvas(){
        this.copyCanvas = document.createElement("canvas");
        this.canvasContext = this.copyCanvas.getContext("2d", {willReadFrequently: true});
        this.copyCanvas.width = copyCanvasResolution;
        this.copyCanvas.height = copyCanvasResolution;
    }

    //Atualiza o canvas de cópia com a imagem do vídeo e atualiza as cores das luzes com base nos
    //cantos do vídeo e na média das cores do vídeo
    updateDynamicLight(){
        this.canvasContext.drawImage(this.video.video,0,0,copyCanvasResolution,copyCanvasResolution);
        const data = this.canvasContext.getImageData(0,0,copyCanvasResolution,copyCanvasResolution).data;
        const indexes = [
            4*(copyCanvasResolution*(copyCanvasResolution-1)),
            0,
            4*(copyCanvasResolution*copyCanvasResolution-1),
            4*(copyCanvasResolution-1)
        ]
        const values = indexes.map((index)=>[data[index],data[index+1],data[index+2]]);
        const colors = values.map((value)=>[value[0]/255,value[1]/255,value[2]/255]);
        const totalPixels = copyCanvasResolution * copyCanvasResolution;
        const division = totalPixels*255;
        const average = [0, 0, 0];
        for (let i = 0; i < totalPixels; i++) {
            average[0] += data[i * 4] / division;
            average[1] += data[i * 4 + 1] / division;
            average[2] += data[i * 4 + 2] / division;
        }
        for (let i = 0; i<4; i++){
            const RGB = colors[i].map((color,index)=>(3*color+average[index])/4);
            this.lights[i].color.setRGB(...RGB);
            this.lights[i].intensity = 7-3*luminance(RGB);
        }
    }

    animate(){
        super.animate();
        if (this.parameters.iluminacao === 2 && this.video.isPlaying){
            this.updateDynamicLight();
        }
    }

    showModelCredits(){
        const creditsDiv = document.createElement('div');
        creditsDiv.className = 'credits-overlay';
        creditsDiv.innerHTML = `
			3D Model: 
			<a href="https://sketchfab.com/3d-models/porcelain-mask-596d7fbddfdd4cbab5a81878e1bd7741" target="_blank" rel="noopener noreferrer">Porcelain Mask</a> 
			by 
			<a href="https://sketchfab.com/sleepwalker77" target="_blank" rel="noopener noreferrer">sleepwalker77</a> 
			(CC BY 4.0)
        `;
        document.body.appendChild(creditsDiv);
    }
}
const app = new Mask3DApp().init();
import FaceApp from "./framework/base/faceApp.js";
import { THREE } from "./framework/util/imports.js";
class FaceBoxApp extends FaceApp {
    constructor(){
        super("Bounding Box Face Tracker");
    }

    makeScene(){
        super.makeScene();
        this.boxPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.5), new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
        this.scene.add(this.boxPlane);
        this.boxPlane.visible = false;
        this.faceApiService.detectFaceEvent.subscribe((detection)=>{
            this.boxPlane.visible = detection.faceDetected;
            const vectors = this.faceApiService.getPlaneInformation(detection);
            this.boxPlane.position.set(vectors.pos.x,vectors.pos.y,vectors.pos.z);
            this.boxPlane.scale.set(vectors.scale.x,vectors.scale.y,vectors.pos.z);
        })
    }
}
const app = new FaceBoxApp().init();
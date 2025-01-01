import Shader from "./shader.js";
import { THREE } from "../util/imports.js";
export default class ShaderFaceOnly extends Shader {
    constructor(options){
        super(options);
        this.isFaceOnly = true;
    }
    getUniforms() {
        let uniforms = super.getUniforms();
        uniforms.push({ tipo:"bool", nome:"faceOnly", valor: true });
        uniforms.push({ tipo:"vec2", nome:"boxUBounds", valor: new THREE.Vector2(0,0) });
        uniforms.push({ tipo:"vec2", nome:"boxVBounds", valor: new THREE.Vector2(0,0) });
        uniforms.push({ tipo:"bool", nome:"faceDetected", valor: false });
        return uniforms;
    }

    common(){
        const newCommons = `
            bool isWithinBoundingBox(){
                return vUv.x >= boxUBounds.x && vUv.x <= boxUBounds.y && vUv.y >= boxVBounds.x && vUv.y <= boxVBounds.y;
            }
        `
        return super.common() + newCommons;
    }

    _getTrueMain(){
        return `
            if (filterOn && (!faceOnly || (faceDetected && isWithinBoundingBox()))){
                gl_FragColor = mainOriginal();
                return;
            }
            gl_FragColor = texture2D( tDiffuse, vUv );
            return;
        `;
    }
}
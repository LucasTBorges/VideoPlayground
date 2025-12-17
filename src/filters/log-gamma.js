import Shader from "../framework/base/shader.js";
import { THREE } from "../framework/util/imports.js";
import Filtro from "../framework/base/filtro.js";
//import GuiManager from "../framework/base/guiManager.js";
const LogGammaShaderOptions = {
    name: 'LogGammaShader',
    uniforms: [
        {tipo: "vec3", nome:"channels", valor: new THREE.Vector3(1,1,1)}, //Intensidade da transformação em cada canal
        {tipo: "int", nome:"transformation", valor: 0}, //0 - Log, 1 - Gamma
        {tipo: "float", nome:"factor", valor: 0},
        {tipo: "bool", nome:"graph", valor: false}, //Visualização do gráfico?
    ],
    declarations: `
		const float negativeLogFactorConst = 100.0;
		const float positiveLogFactorConst = 3.0;
		const float maxLogFactor = 30.0;
    `,
    aux: `
		// float factor -> [-10.0, 10.0]
		float negativeLogFactor(float x){
			float newFactor = abs(factor);
			newFactor = log(negativeLogFactorConst*x+1.0)/log(negativeLogFactorConst+1.0);
			return -newFactor;
		}
		float positiveLogFactor(float x){
			float newFactor = pow(x,positiveLogFactorConst);
			if (newFactor>1.0){
				newFactor = 0.0;
			}
			return newFactor;
		}
		float logFactor(){
			float zeroToOne;
			if (factor < 0.0){
				return negativeLogFactor(factor/-10.0);
			}
			zeroToOne = factor/10.0;
			if (zeroToOne == 0.0){
				zeroToOne+=0.01;
			}
			return positiveLogFactor(zeroToOne)*maxLogFactor;
		}
		float logTransform(float value){
			float logfactor = logFactor();
			float logbase = log(1.0+logfactor*value);
			if (logfactor == 0.0){
				return logbase;
			}
			return logbase/log(1.0+logfactor);
		}
		float gammaFactor(){
			float newFactor = -factor/3.0;
			if (newFactor<0.0){
				newFactor=newFactor-1.0;
				return 1.0/abs(newFactor);
			}
			newFactor=newFactor+1.0;
			return newFactor;
		}

		float gammaTransform(float value){
			return pow(value,gammaFactor());
		}
		float redTransform(float value){
			if (transformation == 0){
				return value+channels.r*(logTransform(value)-value);
			}
			else{
				return value+channels.r*(gammaTransform(value)-value);
			}
		}
		float greenTransform(float value){
			if (transformation == 0){
				return value+channels.g*(logTransform(value)-value);
			}
			else{
				return value+channels.g*(gammaTransform(value)-value);
			}
		}
		float blueTransform(float value){
			if (transformation == 0){
				return value+channels.b*(logTransform(value)-value);
			}
			else{
				return value+channels.b*(gammaTransform(value)-value);
			}
		}
    `,
    main: `
        vec4 finalColor = texture2D(tDiffuse, vUv);
        if(graph){
			finalColor.r = vUv.y<redTransform(vUv.x)?1.0:0.0;
			finalColor.g = vUv.y<greenTransform(vUv.x)?1.0:0.0;
			finalColor.b = vUv.y<blueTransform(vUv.x)?1.0:0.0;
            return finalColor;
        } else {
            finalColor.r = redTransform(finalColor.r);
			finalColor.g = greenTransform(finalColor.g);
			finalColor.b = blueTransform(finalColor.b);
            return finalColor;
        }
    `
};

export default class LogGammaFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remove Filter": function(){ filter.destroy() },
            "Intensity per Channel": false
        }
    }

    getTitle() {
        return "Log & Gamma";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Log/Gamma Correction")
        pasta.add(this.parameters, "Remove Filter")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filter On")
        pasta.add(this.shaderPass.uniforms.transformation, "value", {"Log":0, "Gamma":1}).name("Transformation");
        pasta.add(this.shaderPass.uniforms.graph, "value").name("Visualize Curve");
        pasta.add(this.shaderPass.uniforms.factor, "value", -9.95, 10).name("Brightness Factor");
		const subtab = "rgb"+this.title;
        pasta.add(this.parameters, "Intensity per Channel").name("Intensity per Channel").onChange((value)=>{
            if(value){
                this.parentManager.showTab(subtab);
            } else {
                this.parentManager.hideTab(subtab);
                this.channels.forEach((channel)=>{
                    channel.setValue(1);
                });
            }
        });
        this.channels = [
            pasta.add(this.shaderPass.uniforms.channels.value, "x", 0, 1).name("Channel R").hide(),
            pasta.add(this.shaderPass.uniforms.channels.value, "y", 0, 1).name("Channel G").hide(),
            pasta.add(this.shaderPass.uniforms.channels.value, "z", 0, 1).name("Channel B").hide(),
        ]
        this.parentManager.addTab(subtab, this.channels);
        return [pasta]
    }

    makeShader() {
        this.shaderBase = new Shader(LogGammaShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}
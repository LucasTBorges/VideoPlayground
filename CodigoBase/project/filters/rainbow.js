import Filtro from "../../framework/base/filtro.js";
import Shader from "../../framework/base/shader.js";
import { THREE } from "../../framework/util/imports.js";
const RainbowShaderOptions = {
    name: 'RainbowShader',
    uniforms: [
        {tipo: "int", nome:"modo", valor: 0}, //0 - Direcional, 1 - Radial
        {tipo: "int", nome:"distancia", valor: 0}, //0 - Eculidiana, 1 - Manhattan, 2 - Chebyshev
        {tipo: "float", nome:"frequencia", valor: 1.0},
        {tipo: "float", nome:"velocidade", valor: 1.0},
        {tipo: "bool", nome: "reverso", valor: false}
    ],
    declarations: "#include <common>",
    aux: `
        float euclidian(vec2 a, vec2 b){
            return distance(a,b);
        }

        float manhattan(vec2 a, vec2 b){
            return abs(a.x - b.x) + abs(a.y - b.y);
        }

        float chebyshev(vec2 a, vec2 b){
            return max(abs(a.x - b.x), abs(a.y - b.y));
        }
        
        float tempo(){
            if (reverso) {
                return -time;
            }
            return time;
        }

        float dist(){
            vec2 texel = texelSize();
            vec2 center = vec2(.5) * resolution;
            vec2 point = vUv * resolution;
            float dist = 0.0;
            if(distancia == 0){
                dist = euclidian(point, center);
            }else if(distancia == 1){
                dist = manhattan(point, center);
            }else{
                dist = chebyshev(point, center);
            }
            vec2 extremePoint = resolution.x>=resolution.y?vec2(resolution.y):vec2(resolution.x);
            return mod(((frequencia * dist) / length(extremePoint) + tempo()*velocidade)*frequencia,1.0);
        }

        float stripe() {
            return mod(((resolution.x>=resolution.y?vUv.x:vUv.y)+tempo()*velocidade)*frequencia, 1.0);
        }

        vec3 HUEtoRGB(in float hue)
		{
			// Hue [0..1] to RGB [0..1]
			// See http://www.chilliant.com/rgb2hsv.html
			vec3 rgb = abs(hue * 6. - vec3(3, 2, 4)) * vec3(1, -1, -1) + vec3(-1, 2, 2);
			return clamp(rgb, 0., 1.);
		}
    `,
    main:`
            vec4 color = texture2D( tDiffuse, vUv );
            float hue = modo == 0?stripe():dist();
            return vec4(HUEtoRGB(hue)*luminance(color.rgb), color.a);
    `
}

export default class RainbowFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remover Filtro": function(){ filter.destroy() },
            "Pause": false,
        }
    }

    getTitle() {
        return "Rainbow";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Rainbow")
        pasta.add(this.parameters, "Remover Filtro")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filtro Ligado")
        pasta.add(this.parameters, "Pause").name("Pausar")
        pasta.add(this.shaderPass.uniforms.reverso, "value").name("Reverso")
        pasta.add(this.shaderPass.uniforms.modo, "value",{Direcional:0,Radial:1}).name("Modo").onChange((value)=>{
            if(value == 0){
                this.distanciaController.hide()
            } else {
                this.distanciaController.show()
            }
        })
        pasta.add(this.shaderPass.uniforms.frequencia, "value").name("Frequência").min(0.1).max(5).step(0.05)
        pasta.add(this.shaderPass.uniforms.velocidade, "value").name("Velocidade").min(0.25).max(3).step(0.05)
        this.distanciaController = pasta.add(this.shaderPass.uniforms.distancia, "value",{Euclidiana:0,Manhattan:1,Chebyshev:2}).name("Distância").hide()
        return [pasta]
    }

    makeShader() {
        const shader = new Shader(RainbowShaderOptions).getShader();
        return shader;
    }
}
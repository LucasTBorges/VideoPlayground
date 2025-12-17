import Filtro from "../framework/base/filtro.js";
import Shader from "../framework/base/shader.js";
//Shader retirado do KaleidoShader do Three.js
const CaleidoscopioShaderOptions = {
    name: 'CaleidoscopioShader',
    uniforms: [
        {tipo: "float", nome:"sides", valor: 6.0},
        {tipo: "float", nome:"angle", valor: 0.0},
    ],
    main: `
            vec2 p = vUv - 0.5;
			float r = length(p);
			float a = atan(p.y, p.x) + angle;
			float tau = 2. * 3.1416 ;
			a = mod(a, tau/sides);
			a = abs(a - tau/sides/2.) ;
			p = r * vec2(cos(a), sin(a));
			return texture2D(tDiffuse, p + 0.5);
    `
};

export default class CaleidoscopioFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remove Filter": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Kaleidoscope";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Kaleidoscope")
        pasta.add(this.parameters, "Remove Filter")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filter On")
        pasta.add(this.shaderPass.uniforms.sides, "value",1,10,1).name("Sides")
        pasta.add(this.shaderPass.uniforms.angle, "value",0,2*Math.PI).name("Angle")
        return [pasta]
    }

    makeShader() {
        this.shaderBase = new Shader(CaleidoscopioShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}
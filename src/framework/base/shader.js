import { THREE } from "../util/imports.js";
export default class Shader {
    constructor(options={}){
        this.name = options.name;//string
        this.uniforms = options.uniforms;//Lista de objetos {tipo: string, nome: string, valor: any}
        this.vertexShader = options.vertexShader;//string (GLSL)
        this.varyings = options.varyings;//string (GLSL) - Declaração de varyings
        this.aux = options.aux;//string (GLSL)
        this.main = options.main;//string (GLSL) - Apenas o corpo do main, deve retornar um vec4
        this.declarations = options.declarations;//string (GLSL) - Declarações como #include e #define
    }

    getName(){//string
        const padrao = "Identidade";
        return this.name??padrao;
    }

    getUniforms(){//Lista de objetos {tipo: string, nome: string, valor: any}
        //Sempre inclui o uniform tDiffuse e o uniform resolution e tDiffuse
        const padrao = [
            {tipo: "vec2", nome: "resolution", valor: new THREE.Vector2(1,1)},
            {tipo: "sampler2D", nome: "tDiffuse"},
            {tipo : "bool", nome: "filterOn", valor:true},
            {tipo: "float", nome: "time", valor: 0}
        ];
        return padrao.concat(this.uniforms??[]);
    }

    getVertexShader(){//string (GLSL)
        const padrao = `
        varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`;
        return this.vertexShader??padrao;
    }

    getDeclarations(){//string (GLSL)
       return this.declarations??""; //Declarações como #include e #define
    }

    common(){ //Funções comuns a todos os shaders
        return `
        vec2 texelSize() {
            return 1.0 / resolution;
        }
        `
    }
    
    _getTrueFragmentShader(){//string (GLSL)
        return `
            ${this.getDeclarations()}
            ${this._getUniformsGLSL()}
            ${this.getVaryings()}
            ${this.common()}
            ${this.getAuxiliarFunctions()}
            vec4 mainOriginal(){
                ${this.getMainOriginal()}
            }
            void main() {
                ${this._getTrueMain()}
            }
        `
    }

    _getUniformsGLSL(){//string (GLSL)
        const uniforms = this.getUniforms();
        let uniformsGLSL = "";
        for(let uniform of uniforms){
            uniformsGLSL += `uniform ${uniform.tipo} ${uniform.nome};\n`;
        }
        return uniformsGLSL;
    }

    getVaryings(){//string (GLSL) (Sobrescrever se alterar o vertex shader)
        return this.varyings!==undefined?this.varyings:"varying vec2 vUv;";
    }

    getAuxiliarFunctions(){//string (GLSL)
        return this.aux??"";
    }

    getMainOriginal(){//Deve retornar o valor vec4 a ser incluído no gl_FragColor
        const padrao = `
                        return  texture2D( tDiffuse, vUv );
                    `;
        return this.main??padrao;
    }

    _getTrueMain(){
        return `
        if (filterOn){
            gl_FragColor = mainOriginal();
            return;
        }
        gl_FragColor = texture2D( tDiffuse, vUv );
        return;
        `
    }

    getUniformsDict(){
        const uniforms = this.getUniforms();
        let uniformsDict = {};
        for(let uniform of uniforms){
            uniformsDict[uniform.nome] = {value: uniform.valor!==undefined?uniform.valor:null};
        }
        return uniformsDict
    }
    getShader(){
        return {
            uniforms: this.getUniformsDict(),
            vertexShader: this.getVertexShader(),
            fragmentShader: this._getTrueFragmentShader()
        }
    }

}
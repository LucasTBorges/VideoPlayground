import Filtro from "../../framework/base/filtro.js";
import ShaderFaceOnly from "../../framework/base/shaderFaceOnly.js";
import { THREE } from "../../framework/util/imports.js";
//Gaussian Blur no código encontrado em https://stackoverflow.com/questions/64837705/opengl-blurring
//Glitch baseado no GlitchPass do Three.js
function generateHeightmap( dt_size ) {

    const data_arr = new Float32Array( dt_size * dt_size );
    const length = dt_size * dt_size;

    for ( let i = 0; i < length; i ++ ) {

        const val = Math.random();
        data_arr[ i ] = val;

    }

    const texture = new THREE.DataTexture( data_arr, dt_size, dt_size, THREE.RedFormat, THREE.FloatType );
    texture.needsUpdate = true;
    return texture;

}
//Usar esse shader apenas com o ShaderFaceOnly, pois ele utiliza o boxVBounds e faceDetected no glitchMode para incluir o stripe no olho 
const AnonimizacaoShaderOptions = {
    name: 'AnonimizacaoShader',
    uniforms: [
        {tipo: "int", nome:"filtro", valor: 0}, //0 - Desfoque, 1 - Glitch
        /* Gaussian Blur: */
        {tipo: "float", nome:"blurRadius", valor: 30.0},
        /* Glitch */
        {tipo: "sampler2D", nome:"tDisp", valor: generateHeightmap(64)},
        {tipo: "float", nome:"instabilidade", valor: 0.15},
        {tipo: "bool", nome:"eyeBlock", valor: true},
    ],
    aux: `
        //Gaussian Blur:
        vec4 gaussianBlur() {
            vec2 pos = vUv*2.0-vec2(1.0); // screen position <-1,+1>
            float xs=resolution.x,ys=resolution.y;// texture resolution
            float x,y,xx,yy,rr=blurRadius*blurRadius,dx,dy,w,w0;
            w0=0.3780/pow(blurRadius,1.975);
            vec2 p;
            vec4 col=vec4(0.0,0.0,0.0,0.0);
            for (dx=1.0/xs,x=-blurRadius,p.x=0.5+(pos.x*0.5)+(x*dx);x<=blurRadius;x++,p.x+=dx){ xx=x*x;
                for (dy=1.0/ys,y=-blurRadius,p.y=0.5+(pos.y*0.5)+(y*dy);y<=blurRadius;y++,p.y+=dy){
                    yy=y*y;
                    if (xx+yy<=rr){
                        w=w0*exp((-xx-yy)/(2.0*rr));
                        col+=texture2D(tDiffuse,p)*w;
                    }
                }
            }
            return col;
        }
        
        //Glitch Mode:
        float rand(vec2 co){
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
		}
        vec4 glitchMode() {
            float angle = 0.02;
            float distortion_y = mod(time, 1.);
            float distortion_x = boxVBounds.x+0.62*(boxVBounds.y-boxVBounds.x);
            float amount = 0.08;
            float seed = rand(vec2(mod(time, 1.)));
            float col_s = (eyeBlock && faceDetected)?0.05:0.;
            vec2 p = vUv;
            float xs = floor(gl_FragCoord.x / 0.5);
            float ys = floor(gl_FragCoord.y / 0.5);
            //based on staffantans glitch shader for unity https://github.com/staffantan/unityglitch
            float disp = texture2D(tDisp, p*seed*seed).r;
            if(p.y<distortion_x+col_s && p.y>distortion_x-col_s*seed) {
                if(instabilidade>0.){
                    p.y = 1. - (p.y + distortion_y);
                }
                else {
                    p.y = distortion_y;
                }
            }
            if(p.x<distortion_y+col_s && p.x>distortion_y-col_s*seed) {
                if(instabilidade>0.){
                    p.x=distortion_x;
                }
                else {
                    p.x = 1. - (p.x + distortion_x);
                }
            }
            p.x+=disp*instabilidade*(seed/5.);
            p.y+=disp*instabilidade*(seed/5.);
            //base from RGB shift shader
            vec2 offset = amount * vec2( cos(angle), sin(angle));
            vec4 cr = texture2D(tDiffuse, p + offset);
            vec4 cga = texture2D(tDiffuse, p);
            vec4 cb = texture2D(tDiffuse, p - offset);
            vec4 newColor = vec4(cr.r, cga.g, cb.b, cga.a);
            //add noise
            vec4 snow = 200.*amount*vec4(rand(vec2(xs * seed,ys * seed*50.))*0.2);
            return newColor+ snow;
        }
    `,
    main:`
        vec4 color = vec4(1.0);
        switch(filtro){
            case 0:
                color = gaussianBlur();
                break;
            case 1:
                color = glitchMode();
                break;
        }
        return color;
    `
}

export default class AnonimizacaoFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
        }
    }

    getTitle() {
        return "Anonimizacao";
    }

    makeControls() {
        const filtroController = this.gui.add(this.shaderPass.uniforms.filtro, "value",
            {"Gaussian Blur":0,
            "Glitch Mode":1})
            .name("Filtro")
            .onChange((value)=>{
                switch(value){
                    case 0:
                        this.parentManager.switchTo("desfoque");
                        break;
                    case 1:
                        this.parentManager.switchTo("glitch");
                        break;
                }
            });
        const filtroOnController = this.gui.add(this.shaderPass.uniforms.filterOn, "value").name("Filtro Ligado")
        const faceOnlyController = this.gui.add(this.shaderPass.uniforms.faceOnly, "value").name("Apenas Rosto")
        this.parentManager.addAlwaysOnItems([filtroController, filtroOnController, faceOnlyController])
        this.parentManager.addTab("desfoque", [
            this.gui.add(this.shaderPass.uniforms.blurRadius, "value",20,40).name("Raio")
        ])
        this.parentManager.addTab("glitch", [
            this.gui.add(this.shaderPass.uniforms.instabilidade, "value",0,1).name("Instabilidade").hide(),
            this.gui.add(this.shaderPass.uniforms.eyeBlock, "value").name("Stripes").hide()
        ])
        return []
    }

    makeShader() {
        this.shaderBase = new ShaderFaceOnly(AnonimizacaoShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }

}
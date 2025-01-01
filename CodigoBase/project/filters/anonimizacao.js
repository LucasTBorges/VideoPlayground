import Filtro from "../../framework/base/filtro.js";
import ShaderFaceOnly from "../../framework/base/shaderFaceOnly.js";
//Baseado no 
const AnonimizacaoShaderOptions = {
    name: 'AnonimizacaoShader',
    uniforms: [
        {tipo: "int", nome:"filtro", valor: 0}, //0 - Desfoque
        {tipo: "float", nome:"blurRadius", valor: 30.0},
    ],
    aux: `
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
    `,
    main:`
        vec4 color;
        switch(filtro){
            case 0:
                color = gaussianBlur();
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
        const filtroController = this.gui.add(this.shaderPass.uniforms.filtro, "value",{"Gaussian Blur":0}).name("Filtro");
        const filtroOnController = this.gui.add(this.shaderPass.uniforms.filterOn, "value").name("Filtro Ligado")
        const faceOnlyController = this.gui.add(this.shaderPass.uniforms.faceOnly, "value").name("Apenas Rosto")
        this.parentManager.addAlwaysOnItems([filtroController, filtroOnController, faceOnlyController])
        this.parentManager.addTab("desfoque", [
            this.gui.add(this.shaderPass.uniforms.blurRadius, "value",25,60).name("Raio")
        ])
        return []
    }

    makeShader() {
        this.shaderBase = new ShaderFaceOnly(AnonimizacaoShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}
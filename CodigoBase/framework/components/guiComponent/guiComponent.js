import Component from "../../base/component.js";
export default class GuiComponent extends Component {
    init() {
        this.element.classList.add("lil-gui");
        this.element.classList.add("autoPlace");
        this.element.classList.add("root");
    }
}
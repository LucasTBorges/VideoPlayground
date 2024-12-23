import Toast from "../components/toast/toast.js";
import Service from "../base/service.js";
export default class ToastService extends Service {
    show(type, title, message, duration){
        const toast = new Toast(type, title, message);
        this.ui.appendChild(toast.id, toast);
        if (duration){
            setTimeout(() => {
                toast.hideToast(); // Destrói o toast após o tempo determinado
            }, duration);
        }
    }
}
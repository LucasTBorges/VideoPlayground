export default class Observable {
    constructor(){
        this.subscriptions = [];
        this.failCallbacks = [];
    }

    subscribe(callback){
        this.subscriptions.push(callback);
        return this
    }

    execute(response=null){
        this.subscriptions.forEach(callback => callback(response));
        return this
    }

    onFail(callback){
        this.failCallbacks.push(callback);
        return this
    }

    fail(response=null){
        this.failCallbacks.forEach(callback => callback(response));
        return this
    }
}
export default class Observable {
    constructor(){
        this.subscriptions = [];
        this.failCallbacks = [];
    }

    subscribe(callback){
        this.subscriptions.push(callback);
        return this
    }

    unsubscribe(callback){
        this.subscriptions = this.subscriptions.filter(subscription => subscription !== callback);
        return this
    }

    execute(response=null){
        this.subscriptions.forEach(callback => callback(response));
        this.executed = true;
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
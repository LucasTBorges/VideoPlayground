export default class Observable {
    constructor(){
        this.subscriptions = [];
        this.failCallbacks = [];
    }

    // Adiciona um callback a ser chamado quando o evento for executado
    subscribe(callback){
        this.subscriptions.push(callback);
        return this
    }

    // Remove um callback da lista de callbacks
    unsubscribe(callback){
        this.subscriptions = this.subscriptions.filter(subscription => subscription !== callback);
        return this
    }

    // Executa todos os callbacks, passando o response como parâmetro
    execute(response=null){
        this.subscriptions.forEach(callback => callback(response));
        this.executed = true;
        return this
    }

    // Adiciona um callback a ser chamado quando e se o evento falhar
    onFail(callback){
        this.failCallbacks.push(callback);
        return this
    }

    // Executa todos os callbacks de falha, passando o response como parâmetro
    fail(response=null){
        this.failCallbacks.forEach(callback => callback(response));
        return this
    }
}
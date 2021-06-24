import {makeAutoObservable} from 'mobx'
interface Modal{
    open: boolean,
    body: JSX.Element| null
}

export default class ModalStore{
    modal:Modal = {
        open:false,
        body:null
    }
    constructor(){ makeAutoObservable(this) }
    OpenModal = (content:JSX.Element) => {
        this.modal.body = content;
        this.modal.open = true
    }
    CloseModal = () => {
        this.modal.body = null;
        this.modal.open = false
    }
}
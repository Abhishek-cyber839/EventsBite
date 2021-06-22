import { ServerError} from '../../models/serverError';
import { makeAutoObservable } from 'mobx';

export default class CommonStore{
    error:ServerError | null = null;
    public CommonStore(){
        makeAutoObservable(this);
    }

    setServerErrors = (error:ServerError) => this.error = error

}
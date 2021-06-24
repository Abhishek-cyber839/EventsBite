import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import {Activity} from '../models/activity';
import { store } from "./Stores/store";
import { history } from '../../../src/index'
import { UserForm } from '../models/user'

axios.defaults.baseURL = "https://localhost:5001/api";


/** Add delayLoading to axios.intereceptors to delay loading of activities */
const delayLoading = (duration:number) => {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    })
}

// axios.interceptors.response.use(async response => {
//     return await delayLoading(1000).then(() => {return response}).catch((err)=> {
//         console.log(`Erro occured in Line 14 Agent.ts:${err.message}`)
//         return Promise.reject(err)
//     })
// }) ;

axios.interceptors.response.use(async response => {
    await delayLoading(1000);
    return response;
},(error:AxiosError) => {
    const {data,status,config} = error.response!;
    switch(status){
        case 400:
            /** 
             * data.errors object will contain all the validation errors thrown by FluentValidation
             * For example-
             * Fields must not be empty.
             *
             */
            if(config.method === 'get' && data.errors.hasOwnProperty('id'))
                history.push('/not-found')
            if(data.errors){
                const ModalErrors = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        ModalErrors.push(data.errors[key]);
                    }
                }
                throw ModalErrors.flat();
            }
            if(typeof data === 'string')
                toast.error(data);        
            break;
        case 401:
            toast.error("Unauthorized");
            break;
        case 404:
            toast.error("Not Found");
            break;   
        case 500:
            store.commonStore.setServerErrors(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
}) ;

/** We will send token with each request if it is available inside the local storage */
axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token) config.headers.Authorization = `Bearer ${token}`
    return config
})

const responseData = (response:AxiosResponse) => response.data;
const requests = {
    get:(url:string) => axios.get(url).then(responseData),
    post:(url:string,body:{}) => axios.post(url,body).then(responseData),
    put:(url:string,body:{}) => axios.put(url,body).then(responseData),
    del:(url:string) => axios.delete(url).then(responseData),
}


/** url passed to requests.get will get appended to basUrl of axios*/
const CrudOperations = {
    ActivitiesList: () => requests.get('/activities'),
    ActivityDetails:(id:string) => requests.get(`/activities/${id}`),
    Create:(activity:Activity) => requests.post('/activities',activity),
    Update:(id:string,activity:Activity) => requests.put(`/activities/${id}`,activity),
    Delete:(id:string) => requests.del(`/activities/${id}`),
}

const Account = {
    currentUser: () => requests.get('/account'),
    loginUser: (user:UserForm) => requests.post('/account/login',user),
    registerUser: (user:UserForm) => requests.post('/account/register',user)
}

const Agent = {
    CrudOperations,
    Account
}

export default Agent;
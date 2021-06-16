import axios, { AxiosResponse } from "axios";
import {Activity} from '../models/activity';

axios.defaults.baseURL = "https://localhost:5001/api";


/** Add delayLoading to axios.intereceptors to delay loading of activities */
const delayLoading = (duration:number) => {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    })
}
axios.interceptors.response.use(async response => {
    return await delayLoading(1000).then(() => {return response}).catch((err)=> {
        console.log(`Erro occured in Line 14 Agent.ts:${err.message}`)
        return Promise.reject(err)
    })
}) ;

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
    Update:(activity:Activity) => requests.put('/activities',activity),
    Delete:(id:string) => requests.del(`/activities/${id}`),
}

const Agent = {
    CrudOperations
}

export default Agent;
import {  makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../../models/activity";
import Agent from '../agent';
import { v4 as uuid } from 'uuid';

export default class ActivityStore {

    activities:Activity[] = [];
    Loading:boolean = false
    submitting:boolean = false
    openForm:boolean = false
    currentActivity:Activity | undefined
    editing:boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    LoadActivities = async () => {
        this.Loading = true;
        try{
            const result = await Agent.CrudOperations.ActivitiesList()
            runInAction(() => {
                result.forEach((activity:Activity) => {
                    activity.date = activity.date.split('T')[0]
                    this.activities.push(activity);
                });
                this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
                this.Loading = false;
            })
        }catch(error){
            console.log(`Error Line 26 : ActivityStore.tsx \n ${error}`);
            runInAction(() => {
                this.Loading = false;
            })
        }
    }

    updateActivity = async (activity:Activity) => {
        this.Loading = true
        try {
            await Agent.CrudOperations.Update(activity)
            runInAction(() => {
                this.activities =[...this.activities.filter(act => act.id !== activity.id),activity]
                this.Loading = false
                this.openForm = false
            })
        } catch (error) {
            console.log("Error UpdateActivity():ActivityStore.ts\n")
            runInAction(() => {
                this.Loading = false;
            })
        }
    }

    deleteActivity = async (id:string) => {
        this.Loading = true;
        try {
            await Agent.CrudOperations.Delete(id)
            runInAction(() => {
                this.activities = [...this.activities.filter(act => act.id !== id)]
                this.Loading = false
            })
        } catch (error) {
            console.log("Error deleteActivity():ActivityStore.ts\n")
        }
    }

    createActivity = async (activity:Activity) => {
        this.submitting = true
        try {
            activity.id = uuid()
            await Agent.CrudOperations.Create(activity)
            runInAction(() => {
                this.activities = [...this.activities,activity];
                this.submitting = false
                this.openForm = false
            })
        } catch (error) {
            console.log("Error deleteActivity():ActivityStore.ts\n")
        }
    }


    handleView = (id:String) => { this.currentActivity = this.activities.find( activity => activity.id === id ) }
    handleCancel = () => { this.currentActivity = undefined }

    OpenForm = () => { this.openForm = true;}
    CloseForm = () => {this.openForm = false;}
    editActivity = (id:string) => { 
        this.editing = true;
        this.currentActivity = this.activities.find( activity => activity.id === id )
        this.openForm = true;
    }
}
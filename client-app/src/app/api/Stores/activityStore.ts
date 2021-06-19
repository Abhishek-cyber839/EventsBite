import {  makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../../models/activity";
import Agent from '../agent';

export default class ActivityStore {

    activityRegistry = new Map<string,Activity>();
    Loading:boolean = false
    InitialLoading:boolean = true
    currentActivity:Activity | undefined = undefined
    editing:boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    LoadActivities = async () => {
        this.setInitialLoading(true)
        try{
            const result = await Agent.CrudOperations.ActivitiesList()
            result.forEach((activity:Activity) => {
                this.SetActivity(activity)
            });
            this.setInitialLoading(false);
        }catch(error){
            console.log(`Error Line 26 : ActivityStore.tsx \n ${error}`);
            this.setInitialLoading(false)
        }
    }

    setInitialLoading = (state:boolean) => this.InitialLoading = state 

    createActivity = async (activity:Activity) => {
        this.Loading = true
        try {
            await Agent.CrudOperations.Create(activity)
            runInAction(() => {
                this.activityRegistry.set(activity.id,activity);
                this.Loading = false
                this.editing = false
                this.currentActivity = activity
            })
        } catch (error) {
            console.log("Error deleteActivity():ActivityStore.ts\n")
            runInAction(() => {
                this.Loading = false
            })
        }
    }


    updateActivity = async (activity:Activity) => {
        this.Loading = true
        try {
            await Agent.CrudOperations.Update(activity.id,activity)
            runInAction(() => {
                this.activityRegistry.set(activity.id,activity)
                this.currentActivity = activity
                this.editing = false
                this.Loading = false
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
                this.activityRegistry.delete(id)
                this.Loading = false
            })
        } catch (error) {
            console.log("Error deleteActivity():ActivityStore.ts\n")
            runInAction(() => {
                this.Loading = false;
            })
        }
    }

    get ActivitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort( (a,b) => Date.parse(a.date) - Date.parse(b.date) )
    }

    LoadActivity = async (id:string) => {
        let activity = this.GetActivity(id) 
        if(activity){
            this.currentActivity = activity
            return activity
        }
        else{
            this.setInitialLoading(true)
            try {
                activity = await Agent.CrudOperations.ActivityDetails(id)
                this.SetActivity(activity!)
                runInAction(() => {
                    this.currentActivity = activity
                })
                this.setInitialLoading(false)
                return activity
            } catch (error) {
                console.log(error)
                this.setInitialLoading(false)
            }
        }
    }

    private  SetActivity = (activity:Activity) => {
        activity.date = activity.date.split('T')[0]
        this.activityRegistry.set(activity.id,activity)
    }

    private GetActivity = (id:string) => {
       return this.activityRegistry.get(id)
    }

    get GroupedActivities(){
        return Object.entries(
            this.ActivitiesByDate.reduce((activities,activity) => {
                const date = activity.date
                activities[date] = activities[date] ? [...activities[date],activity] : [activity]
                return activities
            },{} as {[key:string] : Activity[]})
        )
    }
}
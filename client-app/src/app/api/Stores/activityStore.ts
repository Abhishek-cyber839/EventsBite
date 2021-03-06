import { format } from "date-fns";
import {  makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from '../../models/paginations';
import { Activity, ActivityForm } from "../../models/activity";
import { Profile } from "../../models/ActivityParticipant";
import Agent from '../agent';
import { store } from "./store";

export default class ActivityStore {

    activityRegistry = new Map<string,Activity>();
    Loading:boolean = false
    InitialLoading:boolean = true
    currentActivity:Activity | undefined = undefined
    editing:boolean = false;
    pagination:Pagination | null = null
    pagingParams = new PagingParams()
    predicate = new Map().set('all',true)

    constructor() {
        makeAutoObservable(this)
        reaction(
            () => this.predicate.keys(), // obeserve the key changes
            () => {
                this.activityRegistry.clear()
                this.pagingParams = new PagingParams()
                this.LoadActivities()
            }
        )
    }

    LoadActivities = async () => {
        this.setInitialLoading(true)
        try{
            const result = await Agent.CrudOperations.ActivitiesList(this.axiosParams)
            result.data.data.forEach((activity:Activity) => {
                this.SetActivity(activity)
            });
            this.setPagination(result.data.pagination)
            this.setInitialLoading(false);
        }catch(error){
            console.log(`Error Loading activities: ActivityStore.tsx \n ${error}`);
            this.setInitialLoading(false)
        }
    }

    setPagingParams = (pagingParams:PagingParams) => this.pagingParams = pagingParams;
    setPagination = (pagination:Pagination) => this.pagination = pagination;
    setPredicate = (key:string,value:string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value,key) => {
                if(key !== 'startDate'){
                    this.predicate.delete(key)
                }
            })
        }
        switch(key){
            case 'all':
                resetPredicate()
                this.predicate.set('all',true)
                break
            case 'isGoing':
                resetPredicate()
                this.predicate.set('isGoing',true)
                break
            case 'isHosting':
                resetPredicate()
                this.predicate.set('isHosting',true)
                break
            case 'startDate':
                this.predicate.delete('startDate')
                this.predicate.set('startDate',value)
        }
    }

    get axiosParams(){
        const params = new URLSearchParams();
        params.append('pageNumber',this.pagingParams.pageNumber.toString());
        params.append('pageSize',this.pagingParams.pageSize.toString());
        this.predicate.forEach((value,key) => {
            if(key === 'startDate'){
                params.append(key,(value as Date).toISOString());
            }else{
                params.append(key,value);
            }
        })
        return params
    }

    setInitialLoading = (state:boolean) => this.InitialLoading = state 

    createActivity = async (activity:ActivityForm) => {
        const user  = store.userStore.user;
        const participant = new Profile(user!);
        try {
            await Agent.CrudOperations.Create(activity)
            const newActivity = new Activity(activity)
            newActivity.hostUserName = user!.userName;
            newActivity.participants = [participant]
            this.SetActivity(newActivity)
            runInAction(() => this.currentActivity = newActivity )
        } catch (error) {
            console.log("Error deleteActivity():ActivityStore.ts\n")
        }
    }


    updateActivity = async (activity:ActivityForm) => {
        try {
            if(activity.id){
                await Agent.CrudOperations.Update(activity.id,activity)
            }
            runInAction(() => {
                if(activity.id){
                    let updatedActivity = {...this.GetActivity(activity.id),...activity}
                    this.activityRegistry.set(activity.id,updatedActivity as Activity)
                    this.currentActivity = updatedActivity as Activity
                }
            })
        } catch (error) {
            console.log("Error UpdateActivity():ActivityStore.ts\n")
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
        return Array.from(this.activityRegistry.values()).sort( (a,b) => a.date!.getTime() - b.date!.getTime() )
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
        const user = store.userStore.user;
        // activity.participants!.some will return boolean if any item inside matches the condition inside it.
        if(user){
            activity.isGoing = activity.participants!.some(
                  participant => participant.userName === user.userName
                );
            activity.isHost = activity.hostUserName === user.userName;
            activity.host = activity.participants?.find(participant => participant.userName === activity.hostUserName)
        }
        activity.date = new Date(activity.date!)
        this.activityRegistry.set(activity.id,activity)
    }

    private GetActivity = (id:string) => {
       return this.activityRegistry.get(id)
    }

    get GroupedActivities(){
        return Object.entries(
            this.ActivitiesByDate.reduce((activities,activity) => {
                const date = format(activity.date!,'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date],activity] : [activity]
                return activities
            },{} as {[key:string] : Activity[]})
        )
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.Loading = true;
        try {
            await Agent.CrudOperations.Attend(this.currentActivity!.id);
            runInAction(() => {
                // User is going and want to cancel
                if(this.currentActivity?.isGoing){
                    // if going remove user from list of participants
                    this.currentActivity.participants = this.currentActivity.participants?.filter(participant => participant.userName !== user?.userName)
                    this.currentActivity.isGoing = false
                } 
                // User is not going and want to participate
                else{
                    const participant = new Profile(user!)
                    this.currentActivity?.participants?.push(participant)
                    this.currentActivity!.isGoing = true
                }
                // add update activity
                this.activityRegistry.set(this.currentActivity!.id,this.currentActivity!)
            })
        } catch (error) {
            console.log("Error Updating Attendance:updateAttendance()\n",error.message)
        }
        finally{
            runInAction(() => this.Loading = false)
        }
    }

    cancelActivity = async () => {
        this.Loading = true
        try {
            await Agent.CrudOperations.Attend(this.currentActivity!.id);
            runInAction(() => { 
                this.currentActivity!.isCancelled = !this.currentActivity?.isCancelled
                this.activityRegistry.set(this.currentActivity!.id,this.currentActivity!)
            })
        }catch (error) {
            console.log("Error Cancelling Activity:cancelAttendance()\n",error.message)
        }
        finally{
            runInAction(() => this.Loading = false)
        }
    }

    /**
     * Clear current activity from memory otherwise it'll give us an error when we go to activtiy details page
     * and then come back and select different activity when making connection with signalR-hub as old activity is still 
     * set as current activity so signalR will try to add that user to the same activity group again as per the logic 
     * defined in ChatHub.cs which in return will throw an error.
     */
    clearCurrentActivity = () => this.currentActivity = undefined

    updateParticipantFollowing = (username:string) => {
        this.activityRegistry.forEach((activity) => {
            activity.participants?.forEach(participant => {
                if(participant.userName === username){
                    participant.following ? participant.followersCount-- : participant.followersCount++;
                    participant.following = !participant.following
                }
            })
        })
    } 
}
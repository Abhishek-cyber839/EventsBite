import { Profile } from "./ActivityParticipant";

export interface Activity{
    id:string,
    title:string,
    date:Date | null,
    description:string,
    category:string,
    city:string,
    venue:string,
    isCancelled?:boolean,
    hostUserName?:string,
    participants?:Profile[],
    isGoing?:boolean,
    isHost?:boolean,
    host?:Profile
}

/**
 * We're using this class to update or create new activity
 */
export class ActivityForm {
    id?:string = undefined
    title:string = ''
    date:Date | null = null
    description:string = ''
    category:string = ''
    city:string = ''
    venue:string = ''
    constructor(activity? : ActivityForm){
        if(activity){
            this.id = activity.id
            this.title = activity.title
            this.date = activity.date
            this.description = activity.description
            this.category = activity.category
            this.city = activity.city
            this.venue = activity.venue
        }
    }
}

export class Activity implements Activity{
    constructor(init?:ActivityForm){
        // initialise all the matching properties from init to activity Object.assign(object we want to assign to,object we want to assign to)
        Object.assign(this,init)
    }
}
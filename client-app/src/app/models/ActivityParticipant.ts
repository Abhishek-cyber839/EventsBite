import { User } from "./user";

export interface Profile{
    userName:string,
    displayName:string,
    image?:string,
    bio?:string,
    photos?:Photo[],
    followersCount:number,
    followingCount:number,
    following:boolean
}

export class Profile implements Profile{
    constructor(user:User){
        this.userName = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface Photo{
    id:string
    url:string
    isMainPhoto:boolean
}

export interface UserActivity{
    id:string
    title:string
    category:string
    date:Date
}
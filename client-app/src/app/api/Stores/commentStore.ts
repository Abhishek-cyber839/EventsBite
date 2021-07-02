import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../../models/comment";
import { store } from "./store";

export default class CommentStore{
    comments:ChatComment[] = [];
    hubConnection:HubConnection | null = null;
    constructor(){ 
        makeAutoObservable(this);
    }
    createConnection = (activityId:string) => {
        if(store.activityStore.currentActivity){
            this.hubConnection = new HubConnectionBuilder().withUrl(`${process.env.REACT_APP_CHAT_URL}?activityId=${activityId}`,{
                accessTokenFactory:() => store.userStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
            this.hubConnection?.start().catch(error => console.log("Error building connection createConnection():CommentStore\n"+error.message))
            this.hubConnection.on('LoadComments',(comments:ChatComment[]) => runInAction(() => {
                comments.forEach(comment => {
                    comment.createdAt = new Date(comment.createdAt+'Z')
                }) 
                this.comments = comments
            }));
            this.hubConnection.on('ReceiveComment',(comment:ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt)
                    // put new comment first
                    this.comments.unshift(comment)
                })
            })
        }
    }

    stopConnection = () => 
        this.hubConnection?.stop().catch(error => console.log("Error stopping connection stopConnection():CommentStore\n"+error.message))
    clearComments = () =>{
        this.comments = [];
        this.stopConnection();
    }

    addComment = async (value:any) => {
        value.activityId = store.activityStore.currentActivity?.id
        try {
            await this.hubConnection?.invoke("sendComment",value)
            
        } catch (error) {
            console.log("Error adding new comment addComment():CommentStore\n"+error.message)
        }
    }
}
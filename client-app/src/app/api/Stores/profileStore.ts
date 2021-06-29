import { Photo, Profile } from "../../models/ActivityParticipant";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import Agent from "../agent";
import { store } from "./store";

export class ProfileStore{
    profile:Profile | null = null;
    LoadingProfile = false
    Uploading = false;
    Loading = false;
    followings:Profile[] = [];
    LoadingFollowings:boolean = false;
    ActiveTab:number = 0

    constructor(){ 
        makeAutoObservable(this) 
        reaction(() => this.ActiveTab,
        ActiveTab => {
            if(this.ActiveTab === 3 || this.ActiveTab === 4){
                const predicate = ActiveTab === 3 ? 'followers' : 'following'
                this.ListFollowings(predicate)
            }
            else{
                this.followings = []
            }
        })
    }

    setActiveTab = (activeTab:any) => this.ActiveTab = activeTab

    LoadProfile = async (username:string) => {
        this.LoadingProfile = true;
        try {
            const profile  = await Agent.Profiles.getProfile(username);
            runInAction(() => {
                this.profile = profile
                this.LoadingProfile = false
            })
        } catch (error) {
            console.log("Error Loading Profile:LoadProfile()\n",error.messgae)
            runInAction(() => this.LoadingProfile = false)
        }
    }

    // Allow only currently logged in users to upload photos.You can't add photos if you're just viewing other user's profile.
    get IsCurrentUser(){
        if(store.userStore.user && this.profile)
           return store.userStore.user.userName === this.profile.userName
        return false
    }

    uploadPhoto = async (file:Blob) => {
        this.Uploading= false;
        try {
            const response  = await Agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if(this.profile){
                    this.profile.photos?.push(photo)
                    if(photo.IsMainPhoto && store.userStore.user){
                        store.userStore.setImage(photo.url)
                        this.profile.image = photo.url
                    }
                }
                this.Uploading = false;
            })
        } catch (error) {
            console.log("Error UpLoading photo:uploadPhoto()\n",error.messgae)
            runInAction(() => this.Uploading = false)
        }
    }

    setMain = async (photo:Photo) => {
        this.Loading = true;
        try {
            await Agent.Profiles.setMainPhoto(photo.id)
            store.userStore.setImage(photo.url)
            runInAction(() => {
                if(this.profile && this.profile.photos){
                    // find current main photo
                    this.profile.photos.find(photo => photo.isMainPhoto)!.isMainPhoto = false
                    // set new photo as main photo
                    this.profile.photos.find(ph => ph.id === photo.id)!.isMainPhoto = true  
                    this.profile.image = photo.url
                    this.Loading = false
                }
            })
        } catch (error) {
            console.log("Error setting main photo:setMain()\n",error.messgae)
            runInAction(() => this.Loading = false)
        }
    }

    deletePhoto = async (photo:Photo) => {
        this.Loading = true;
        try {
            await Agent.Profiles.deletePhoto(photo.id)
            runInAction(() => {
                if(this.profile){
                    this.profile.photos = this.profile.photos?.filter(ph => ph.id !== photo.id)
                    this.Loading = false
                }
            })
        } catch (error) {
            console.log("Error deleting photo:deletePhoto()\n",error.messgae)
            runInAction(() => this.Loading = false)
        }
    }

    updateFollowing = async (username:string,following:boolean) => {
        this.Loading = true;
        try {
            await Agent.Profiles.updateFollowings(username)
            store.activityStore.updateParticipantFollowing(username);
            runInAction(() => {
                if(this.profile && this.profile.userName !== store.userStore.user?.userName && this.profile.userName === username){
                    following ?  this.profile.followersCount++ :  this.profile.followersCount--
                    this.profile.following = !this.profile.following
                }
                if(this.profile && this.profile.userName !== store.userStore.user?.userName){
                    following ?  this.profile.followersCount++ :  this.profile.followersCount--
                }
                this.followings.forEach(profile => {
                    if(profile.userName === username){
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following  = !profile.following 
                    }
                })
                this.Loading = false;
            })
        } catch (error) {
            console.log("Error updating Followers:updateFollowing()\n",error.messgae)
            runInAction(() => this.Loading = false)
        }
    }

    ListFollowings = async (predicate:string) => {
        // this.LoadingFollowings = true;
        try {
            const Followings = await Agent.Profiles.getFollowingsList(this.profile!.userName,predicate);
            runInAction(() => {
                this.followings = Followings
                // this.LoadingFollowings = false;
            })
        } catch (error) {
            console.log("Error Getting list of Followings:ListFollowings()\n",error.messgae)
            runInAction(() => this.LoadingFollowings = false)
        }
    }
}
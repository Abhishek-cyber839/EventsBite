import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../../..";
import { User, UserForm } from "../../models/user";
import Agent from "../agent";
import { store } from "./store";

export default class UserStore{
    user: User | null = null
    fbAccessToken:string | null = null
    fbLoading = false
    refreshTime:any

    constructor(){ makeAutoObservable(this) }
    // !! will cast user to boolean i.e if it is not null it will true.
    get IsLoggedIn(){ return !!this.user }

    LogIn = async (credentials:UserForm) => {
        try {
            const user = await Agent.Account.loginUser(credentials);
            store.commonStore.setToken(user.token)
            this.StartRefreshTokenCountDwon(user)
            runInAction(() => {
                this.user = user
            })
            history.push('/activities')
            store.modalStore.CloseModal()
            console.log(user);
        } catch (error) {
            console.log("Error Log In UserStore:LogIn()\n"+error.message);
            throw error;
        }
    }

    LogOut = () => {
        store.commonStore.setToken(null)
        window.localStorage.removeItem('jwt')
        this.user = null
        history.push('/')
    }

    getUserWithMatchingToken = async () => {
        try {
            const user = await Agent.Account.currentUser();
            runInAction(() => this.user = user)
        } catch (error) {
            console.log("Error UserStore:getUserWithMatchingToken()\n"+error.message);
            throw error;
        }
    }

    Register = async (credentials:UserForm) => {
        try {
            const user = await Agent.Account.registerUser(credentials);
            // store.commonStore.setToken(user.token)
            // this.StartRefreshTokenCountDwon(user)
            // runInAction(() => {
            //     this.user = user
            // })
            history.push(`/account/registration-success?email=${credentials.email}`)
            // history.push('/activities')
            store.modalStore.CloseModal()
            console.log(user);
        } catch (error) {
            console.log("Error Log In UserStore:LogIn()\n"+error.message);
            throw error;
        }
    }

    setImage = (Image:string) => {
        if(this.user) 
            this.user.image = Image;
    }

    setDisplayName = (name: string) => { if (this.user) this.user.displayName = name }

    FacebookLogin = () => {
        this.fbLoading = true
        const APILogin = (accessToken:string) => {
            Agent.Account.fbLogin(accessToken).then((user) => {
                store.commonStore.setToken(user.token)
                this.StartRefreshTokenCountDwon(user)
                runInAction(() => {
                    this.user = user
                    this.fbLoading = false
                })
                history.push("/activities")
            }).catch((error) => {
                console.log("Error Logging User with Facebook FacebookLogin():UserStore.ts\n",error.message);
                runInAction(() => this.fbLoading = false)
            })
        }
        if(this.fbAccessToken){
            APILogin(this.fbAccessToken)
        }
        else
            window.FB.login(resp => APILogin(resp.authResponse.accessToken),{scope:'public_profile,email'})
        // window.FB.login(resp => {
        //     console.log(resp)
        //     Agent.Account.fbLogin(resp.authResponse.accessToken).then((user) => console.log(user))
        // },{scope:'public_profile,email'})
    }

    FacebookLoginStatus = async () => {
        window.FB.getLoginStatus((resp) => {
            if(resp.status === 'connected'){
                this.fbAccessToken = resp.authResponse.accessToken
            }

        })
    }

    RefreshToken = async () => {
        try {
            const user = await Agent.Account.refreshToken();
            runInAction(() => this.user = user)
            this.StartRefreshTokenCountDwon(user)
            store.commonStore.setToken(user.Token)
        } catch (error) {
            console.log("Error refreshing Token UserStore:RefreshToken()\n"+error.message);
        }
    }

    private StartRefreshTokenCountDwon = (user:User) => {
        // atob() will decode the token
        const JwtToken = JSON.parse(atob(user.token.split('.')[1]))
        const expires = new Date(JwtToken.exp * 1000)
        // this will set our timeout value to 30s before our jwt token expires.
        const timeout = expires.getTime() - Date.now() - (30 * 1000);
        this.refreshTime =  setTimeout(this.RefreshToken, timeout);
    }

    private StopRefreshTokenCountDwon = () => clearTimeout(this.refreshTime)
}
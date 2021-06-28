import { createContext,useContext } from "react";
import ActivityStore from "./activityStore"
import CommonStore from './CommonStore'
import ModalStore from "./ModalStore";
import { ProfileStore } from "./profileStore";
import UserStore from "./UserStore";

/**
 * Add all stores below.
 */
interface Store{
    activityStore:ActivityStore,
    commonStore:CommonStore,
    userStore:UserStore,
    modalStore: ModalStore,
    profileStore:ProfileStore
}

export const store:Store = {
    activityStore : new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore()
}

export const StoreContext = createContext(store)

export const useStore = () => {
    return useContext(StoreContext)
}
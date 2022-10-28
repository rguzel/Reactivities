import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
    //activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;
    constructor() {
        makeAutoObservable(this)
    }
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            Date.parse(b.date) - Date.parse(a.date));// b-a= DESC, a-b= ASC
    }
    loadActivities = async () => {
         this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(activity => {
                    // //manipulate the date field
                    // activity.date = activity.date.split('T')[0];
                    // //this.activities.push(activity);
                    // this.activityRegistry.set(activity.id, activity);
                    this.setActivity(activity);
                })
                this.loadingInitial = false;
            })

        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingInitial = false;
            })

        }
    }
    loadActivity = async (id: string)=>{
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(()=>{
                    this.selectedActivity=activity;
                })
                
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }
    private setActivity = (activity: Activity)=>{
        activity.date = activity.date.split('T')[0];
        //this.activities.push(activity);
        this.activityRegistry.set(activity.id, activity);
    }
    private getActivity = (id: string)=>{
        return this.activityRegistry.get(id);
    }
    setLoadingInitial = (isActive: boolean) => {
        this.loadingInitial = isActive;
    }

   
    createActivity = async (activity: Activity) => {
        this.loading = true;
        
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                // this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;

        try {
            await agent.Activities.update(activity)
            runInAction(() => {
                // this.activities = [...this.activities.filter(a=>a.id !== activity.id),activity];
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })


        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;

            })
        }
    }
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                //this.activities=[...this.activities.filter(p=>p.id!== id)];
                this.activityRegistry.delete(id);
                
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

}


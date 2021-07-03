# EventsBite
An Event Management site


## Overview : 
This app is build on **CLEAN** architecture using .Net Core and React Typescript along with Mobx. In this app a user can perform following operations:

##### Events : 
* Create an event.
* Edit those events.
* Cancel that event.
* Join other events,cancel his attendance in those events.
* Filter those events based on their date,the events that user is hosting or he is going to.
* Post comments on any of the events.

##### Profile :
* User can edit their profiles.
* Upload their photos and crop them.
* Follow other users.
* Choose which photo they want to set as their main photo.

##### Access :
* Users can use facebook authentication.
* Once registered they'll be sent an email which they needs to verify and then they will be prompted for login.


#### Use these steps inorder to run this app locally : 

Make sure that you reset **axios.defaults.baseURL**  from ``` axios.defaults.baseURL = process.env.REACT_APP_API_URL ``` to ``` axios.defaults.baseURL = "https://localhost:5001/api" ```
and inside **commentStore** replace ```process.env.REACT_APP_CHAT_URL``` with  ```"https://localhost:5001/chat"``` i.e ``` new HubConnectionBuilder().withUrl(`${process.env.REACT_APP_CHAT_URL}?activityId=${activityId} ```

#### Follow the below commands : 

```
cd API
dotnet run
/* this will listen on https://localhost:5001 */
cd ../client-app
npm start
/* this will listen on http://localhost:3000 */
npm run build
/* when production building */
```

## Production Build:
Production build of react is located inside  ``` API/wwwroot/ ``` .I've also added a script inside package.json for build process ``` "build":" "rimraf ../API/wwwroot && mv build ../API/wwwroot " ``` , so whenever you'll make changes and try to 
build newer version it will automatically remove the older verson of build from  ``` API/wwwroot/ ``` using the util **rimraf** and put newer version inside that folder.


## A detailed description of files & folders :
File & Folders      | Description
------------ | -------------
API | This is a starter project which contains all the **controllers,DTO(Document To Object),Middleware,signalR,wwwroot(production build for react)** related logic.
Domain | It contains all the entities used.
Persistent | It conatins  migrations and DataContext.cs
Infrastructure | It handles all outside logic for the app i.e sending emails to users,uploading their photos to cloudinary etc.
Application | It is responsible for all the crud operations for each entity as well as related to mapping profiles from one to another using **AutoMapper**
Client-App | This is where frontend logic of app is defined.
.env.developement | Contains development variables of app.
.env.production | Contains production variables of app.
Client/src | It handles **profiles,activities,errors,users** for the client-side.
Client/api | It has **api** for sending requests,**models**,**layout**,**stores** where all the stores are stored.

## Modules :
1. mobx-react - For store.
2. react-toastify - Displaying error toasts.
3. react-calendar - Filtering events based on their dates.
4. Sendgrid - Sending emails to user.
5. Facebook SDK - Facebook authentication.
6. Cloudinary - Storing images.
7. react-cropper - Cropping Images

## Caveat with Production version :
This app is hosted on heroku at https://eventsbite.herokuapp.com/ but there is one missing functionality that you'll not find in the published version i.e whenever you'll go to any user's profile and click on 
"Photos" or "Followers" or "Followings" tab to see their photos,followers and their followings, it will show you a blank page.These two feautures works
fine in development mode but whenever it causes an issue whenever create minified verssion of react project.

**Photo Upload**

![Follower](https://github.com/Abhishek-cyber839/EventsBite/blob/master/PhotoUpload.png)


**Crop Image**

![Follower](https://github.com/Abhishek-cyber839/EventsBite/blob/master/CropImage.png)


**Followers/Following**

![Follower](https://github.com/Abhishek-cyber839/EventsBite/blob/master/Follower.png)

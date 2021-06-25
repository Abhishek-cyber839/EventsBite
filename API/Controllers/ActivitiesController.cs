using Persistent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Domain;
using System.Collections.Generic;
using System;
using Microsoft.EntityFrameworkCore;
using Application.Features;


/** 
IActionReult allows us to send http responses whereas ActionReult allows us to send actual objets for ex-activity.
APIController attribute helps in generating 400 responses automatically.
*/
namespace API.Controllers
{
    public class ActivitiesController: BaseApiController
    {
        
        [HttpGet]
        public async Task<IActionResult> GetActivities(){
            return HandleResult(await mediator.Send(new ListActivities.Query()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id){
            /** 
            Without Result objects we could have simply returned the activity object like this 
            return await mediator.Send(new GetActivity.Query{activity_id = id});
            whereas Now - await mediator.Send(new GetActivity.Query{activity_id = id}); // returns a result object
            */
            return HandleResult(await mediator.Send(new GetActivity.Query{activity_id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity){
            return HandleResult(await mediator.Send(new CreateActivity.Command{new_activity = activity}));
        }

        [HttpPut("{id}")]
        [Authorize(Policy="IsActivityHost")]
        /** 
         Authorize("IsActivityHost") will allow only authorized users to edit this activity.Authorization is implemented inside 
         Infrastructure > Security > IHostRequirement.
         Steps Followed:
         1.Implement a policy that we want to use
         2.Add that inside start class using services.
         3.Give your policy a custom name.In this case I've choosen IsActivityHost so that we can reference that policy on the routes 
         using Authorize attribute from Microsoft.AspNetCore.Authorization.
         Same steps are followed for any other policy whether it's an Authentication or any other user defined policy that we want to 
         use.
        */
        public async Task<IActionResult> EditActivity(Guid id,Activity activity){
            activity.Id = id;
            return HandleResult(await mediator.Send(new EditActivity.Command{new_activity = activity}));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy="IsActivityHost")]
        public async Task<IActionResult> DeleteActivity(Guid id){
            return HandleResult(await mediator.Send(new DeleteActivity.Command{activity_id = id}));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> AttendActivity(Guid id){
            return HandleResult(await mediator.Send(new UpdateAttendance.Command{Id = id}));
        }


    }
}
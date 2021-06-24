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
    [AllowAnonymous]
    public class ActivitiesController: BaseApiController
    {
        
        [HttpGet]
        public async Task<IActionResult> GetActivities(){
            return HandleResult(await mediator.Send(new ListActivities.Query()));
        }

        [Authorize]
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
        public async Task<IActionResult> EditActivity(Guid id,Activity activity){
            activity.Id = id;
            return HandleResult(await mediator.Send(new EditActivity.Command{new_activity = activity}));
        }

         [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id){
            return HandleResult(await mediator.Send(new DeleteActivity.Command{activity_id = id}));
        }
    }
}
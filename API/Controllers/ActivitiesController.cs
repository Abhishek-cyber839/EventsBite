using Persistent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Domain;
using System.Collections.Generic;
using System;
using Microsoft.EntityFrameworkCore;
using Application.Features;

namespace API.Controllers
{
    public class ActivitiesController: BaseApiController
    {
        
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities(){
            return await mediator.Send(new ListActivities.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id){
            return await mediator.Send(new GetActivity.Query{activity_id = id});;
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity){
            return Ok(await mediator.Send(new CreateActivity.Command{new_activity = activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id,Activity activity){
            activity.Id = id;
            return Ok(await mediator.Send(new EditActivity.Command{new_activity = activity}));
        }

         [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id){
            return Ok(await mediator.Send(new DeleteActivity.Command{activity_id = id}));
        }
    }
}
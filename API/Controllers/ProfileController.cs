using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Photos;
using MediatR;
using Application.Profiles;

namespace API.Controllers
{
    public class ProfileController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username){
            return HandleResult(await mediator.Send(new UserDetails.Query{Username = username}));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetProfileActivities(string username,string predicate){
            return HandleResult(await mediator.Send(new ListActivites.Query{Username = username,Predicate = predicate}));
        }


        [HttpPut]
        public async Task<IActionResult> Edit(EditUser.Command command)
         {
            return HandleResult(await mediator.Send(command));
        }
    }
}
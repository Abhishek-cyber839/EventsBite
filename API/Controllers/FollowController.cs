using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Photos;
using MediatR;
using Application.Followers;

namespace API.Controllers
{
    public class FollowController:BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username){
            return HandleResult(await mediator.Send(new Follow.Command{TargetUserName = username}));
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> Get(string username,string predicate){
            return HandleResult(await mediator.Send(new List.Query{UserName = username,predicate = predicate}));
        }
    }
}
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

    }
}
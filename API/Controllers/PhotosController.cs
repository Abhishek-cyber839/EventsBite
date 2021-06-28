using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Photos;
using MediatR;
using Application;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> UploadPhoto([FromForm] Add.Command command){
            return HandleResult(await mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(string id){
            return HandleResult(await mediator.Send(new Delete.Command{Id = id}));
        }

        
        [HttpPost("{id}/setmain")]
        public async Task<IActionResult> SetMainPhoto(string id){
            return HandleResult(await mediator.Send(new  SetMainPhoto.Command{Id = id}));
        }
    }
}
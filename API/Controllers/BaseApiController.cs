using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Application.Core;
using API.Extensions;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase{
           private IMediator _mediator;
           protected IMediator mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
           protected ActionResult HandleResult<T>(Result<T> result){
                if(result.IsSuccess && result.Value != null)
                    return Ok(result.Value);
                /** We're checking if result == null,as we are returning null from DeleteActivity Handler if we don't find an activity
                    that user wants to delete.
                */
                if((result.IsSuccess && result.Value == null) || result == null) // returns Empty activity
                    return NotFound();
                return BadRequest(result.Error);  // invalid params
           }

           
           protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result){
                if(result.IsSuccess && result.Value != null){
                    Response.AddPaginationHeader(
                        result.Value.currentPage,
                        result.Value.PageSize,
                        result.Value.TotalCount,
                        result.Value.TotalPages
                        );
                    return Ok(result.Value);
                }
                    
                /** We're checking if result == null,as we are returning null from DeleteActivity Handler if we don't find an activity
                    that user wants to delete.
                */
                if((result.IsSuccess && result.Value == null) || result == null) // returns Empty activity
                    return NotFound();
                return BadRequest(result.Error);  // invalid params
           }

    }
}
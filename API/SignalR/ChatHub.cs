using Microsoft.AspNetCore.SignalR;
using MediatR;
using Application.Comments;
using System;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        } 
        public async Task sendComment(Create.Command command){
            // create new comment
            var comment = await _mediator.Send(command);
            // send this to all the users of same group, here we're using group with name as activity Id.
            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment",comment.Value);

        }

        /** 
        Whenever a new user will make a connection below method will get executed.
        1.Get activity Id from request params using http context.
        2.Add that new user to a group with method AddToGroupAsync(ConnectionString,GroupName);
        we're naming our group same as activity Id.
        3.Once user is added to the group fetch list of comments associated with that activity using mediator query.
        then send the result back to that new user only using Clients.Caller ,where Caller is a user "LoadComments" method on the client side.
        */
        public override async Task OnConnectedAsync(){
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId,activityId);
            var result = await _mediator.Send(new ListC.Query{ActivityId = Guid.Parse(activityId)});
            await Clients.Caller.SendAsync("LoadComments",result.Value);
        }
    }
}
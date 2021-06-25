using MediatR;
using Application.Core;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using Domain;
using Persistent;
using System.Threading.Tasks;
using System;

namespace Application.Features
{
    public class UpdateAttendance
    {
        public class Command:IRequest<Result<Unit>>{
            public Guid Id{get; set;}
        }
        public class Handler: IRequestHandler<Command,Result<Unit>>{
             private readonly DataContext _context;
             private readonly IUserAccessor _userAccessor;
             public Handler(DataContext dataContext,IUserAccessor userAccessor){
                 _context = dataContext;
                 _userAccessor = userAccessor;
             }
             public async Task<Result<Unit>> Handle(Command request,CancellationToken cancellationToken){
                 var activity = await _context.Activities
                 .Include(activity => activity.Participants) // this will return List<ActivityParticipant>
                 .ThenInclude(activityParticipant => activityParticipant.User) // then get users related to that activity.
                 .FirstOrDefaultAsync(user => user.Id == request.Id); 
                 if(activity == null) return null;
                 var user = await _context.Users.FirstOrDefaultAsync(user => user.UserName == _userAccessor.GetUsername());
                 if(user == null) return null;
                 // check if there's any host for that activity and get his UserName.
                 var hostName  = activity.Participants.FirstOrDefault(user => user.IsHost)?.User?.UserName;
                 // From the activity that we get above we'll check it's Particants List if its has any username as current user's username
                 var attendance = activity.Participants.FirstOrDefault(activityParticipant => activityParticipant.User.UserName == user.UserName); // returns ActivityParticipants
                 if(attendance != null && hostName == user.UserName){
                     /** Above is true then the user making this request is the host of this activity.*/
                     activity.IsCancelled = !activity.IsCancelled; // toggle IsCancelled
                 }
                 if(attendance != null && hostName != user.UserName){
                     /** Above is true then the user making this request is just a participant of this activity.*/
                     activity.Participants.Remove(attendance);
                 }
                 if(attendance == null){
                    /** Above is true then the user making this request is just a participant of this activity.*/
                     attendance = new ActivityPaticipants{
                         User = user,
                         Activity = activity,
                         IsHost = false
                     };
                     activity.Participants.Add(attendance);
                 }
                 var result = await _context.SaveChangesAsync() > 0;
                 return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Unable to Change Attendance - UpdateAttendance");
             }
         }
    }
}
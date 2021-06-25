using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using System;
using FluentValidation;
using Application.Core;
using Application.Interfaces;

namespace Application.Features
{
    public class CreateActivity
    {
        public class Command: IRequest<Result<Unit>>{
            public Activity new_activity{ get; set;}
        }

        public class CommandValidator:AbstractValidator<Command>{
            public CommandValidator(){
                RuleFor(x => x.new_activity).SetValidator(new ActivityValidator());
            }
        }
         public class Handler: IRequestHandler<Command,Result<Unit>>{
             private readonly DataContext _context;
             private readonly IUserAccessor _userAccessor;
             public Handler(DataContext dataContext,IUserAccessor userAccessor){
                 _context = dataContext;
                 _userAccessor = userAccessor;
             }
             public async Task<Result<Unit>> Handle(Command request,CancellationToken cancellationToken){
                 /* we can use _context or usermanager to get users from Users table. */ 
                 var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                 var participant = new ActivityPaticipants{
                     User = user,
                     Activity = request.new_activity,
                     IsHost = true
                 };
                 request.new_activity.Participants.Add(participant);
                 _context.Activities.Add(request.new_activity);
                 /** When Database performs Change Operation and Saves Changes successfully it returns an integer greater than 0. **/
                 var result = await _context.SaveChangesAsync() > 0;
                 if(!result) return Result<Unit>.Failure("Unable To Create Activity");
                 return Result<Unit>.Success(Unit.Value);
             }
         }
    }
}
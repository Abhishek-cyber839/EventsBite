using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent;

namespace Application.Profiles
{
    public class EditUser
    {
        public class Command : IRequest<Result<Unit>>
        {
         public string DisplayName { get; set; }         
        public string Bio { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
           public CommandValidator(){ RuleFor(user => user.DisplayName).NotEmpty();}
        }     
        
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {  
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                 _context = context;
                  _userAccessor = userAccessor;               
            }          
            public async Task<Result<Unit>> Handle(Command request,CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(user => user.UserName == _userAccessor.GetUsername());
                user.Bio = request.Bio ?? user.Bio;
                user.DisplayName = request.DisplayName ?? user.DisplayName;
                /** 
                If you always want to get a 200 back even if no changes were saved then we can mark the entity 
                as modified regardless of whether there were any changes by updating the Edit handler with the following code:
                _context.Entry(user).State = EntityState.Modified;
                */
                _context.Entry(user).State = EntityState.Modified;
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem updating profile");
            }
        }       
    }
}
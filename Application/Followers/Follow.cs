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
using Application.Features;
using AutoMapper;

namespace Application.Followers
{
    public class Follow
    {
        public class Command:IRequest<Result<Unit>>{
            public string TargetUserName{get ;set;}
        }
        public class Handler:IRequestHandler<Command,Result<Unit>>{
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context,IUserAccessor userAccessor){
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request,CancellationToken cancellationToken){
                var observer = await _context.Users.FirstOrDefaultAsync(user => user.UserName == _userAccessor.GetUsername());
                var target = await _context.Users.FirstOrDefaultAsync(user => user.UserName == request.TargetUserName);
                if(target == null) return null;
                var following = await _context.UserFollowings.FindAsync(observer.Id,target.Id);
                if(following == null){
                    following = new UserFollowing{
                        Observer = observer,
                        Target = target
                    };
                    _context.UserFollowings.Add(following);
                }
                else{
                    _context.UserFollowings.Remove(following);
                }
               var result = await _context.SaveChangesAsync() > 0;
               if(!result) return Result<Unit>.Failure("Unable To Toggle(Add or remove) Followers");
               return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
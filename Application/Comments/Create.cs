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

namespace Application.Comments
{
    public class Create
    {
        public class Command: IRequest<Result<CommentDto>>{
            public String Body{ get; set;}
            public Guid ActivityId { get; set;}
        }

        public class CommandValidator:AbstractValidator<Command>{
            public CommandValidator(){
                RuleFor(x => x.Body).NotEmpty();
            }
        }
         public class Handler: IRequestHandler<Command,Result<CommentDto>>{
             private readonly DataContext _context;
             private readonly IUserAccessor _userAccessor;
             private readonly IMapper _mapper;
             public Handler(DataContext dataContext,IUserAccessor userAccessor,IMapper mapper){
                 _context = dataContext;
                 _userAccessor = userAccessor;
                 _mapper = mapper;
             }
             public async Task<Result<CommentDto>> Handle(Command request,CancellationToken cancellationToken){
                 var activity = await _context.Activities.FindAsync(request.ActivityId);
                 if(activity == null) return null;
                 var _user = await _context.Users.Include(user => user.Photos).FirstOrDefaultAsync(user => user.UserName == _userAccessor.GetUsername());
                 var comment = new Comment{
                     Author = _user,
                     Body = request.Body,
                     Activity = activity
                 };
                 activity.Comments.Add(comment);
                 var result = await _context.SaveChangesAsync() > 0;
                 if(!result) return Result<CommentDto>.Failure("Unable To Create comment");
                 return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));
             }
         }
    }
}
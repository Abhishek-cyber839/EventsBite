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
             public Handler(DataContext dataContext){
                 _context = dataContext;
             }
             public async Task<Result<Unit>> Handle(Command request,CancellationToken cancellationToken){
                 _context.Activities.Add(request.new_activity);
                 /** When Database performs Change Operation and Saves Changes successfully it returns an integer greater than 0. **/
                 var result = await _context.SaveChangesAsync() > 0;
                 if(!result) return Result<Unit>.Failure("Unable To Create Activity");
                 return Result<Unit>.Success(Unit.Value);
             }
         }
    }
}
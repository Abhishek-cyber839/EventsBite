using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using System;
using Application.Core;

namespace Application.Features
{
    public class DeleteActivity
    {
        public class Command: IRequest<Result<Unit>>{
            public Guid activity_id{ get; set;}
        }

         public class Handler: IRequestHandler<Command,Result<Unit>>{
             private readonly DataContext _context;
             public Handler(DataContext dataContext){
                 _context = dataContext;
             }
             public async Task<Result<Unit>> Handle(Command request,CancellationToken cancellationToken){
                 var activity = await _context.Activities.FindAsync(request.activity_id);
                 if(activity == null) return null;
                 _context.Remove(activity);
                 var result = await _context.SaveChangesAsync() > 0;
                 if(!result) return Result<Unit>.Failure("Unable to delete Activity");
                 return Result<Unit>.Success(Unit.Value);
             }
         }
    }
}
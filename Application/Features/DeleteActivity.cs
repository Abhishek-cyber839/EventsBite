using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using System;

namespace Application.Features
{
    public class DeleteActivity
    {
        public class Command: IRequest{
            public Guid activity_id{ get; set;}
        }

         public class Handler: IRequestHandler<Command>{
             private readonly DataContext _context;
             public Handler(DataContext dataContext){
                 _context = dataContext;
             }
             public async Task<Unit> Handle(Command request,CancellationToken cancellationToken){
                 var activity = await _context.Activities.FindAsync(request.activity_id);
                 _context.Remove(activity);
                 await _context.SaveChangesAsync();
                 return Unit.Value;
             }
         }
    }
}
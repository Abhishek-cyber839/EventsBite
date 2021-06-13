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
    public class CreateActivity
    {
        public class Command: IRequest{
            public Activity new_activity{ get; set;}
        }

         public class Handler: IRequestHandler<Command>{
             private readonly DataContext _context;
             public Handler(DataContext dataContext){
                 _context = dataContext;
             }
             public async Task<Unit> Handle(Command request,CancellationToken cancellationToken){
                 _context.Activities.Add(request.new_activity);
                 await _context.SaveChangesAsync();
                 return Unit.Value;
             }
         }
    }
}
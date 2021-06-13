using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using System;
using AutoMapper;

namespace Application.Features
{
    public class EditActivity
    {
        public class Command: IRequest{
            public Activity new_activity{ get; set;}
        }

         public class Handler: IRequestHandler<Command>{
             private readonly DataContext _context;
             private readonly IMapper _mapper;
             public Handler(DataContext dataContext,IMapper mapper){
                 _context = dataContext;
                 _mapper = mapper;
             }
             public async Task<Unit> Handle(Command request,CancellationToken cancellationToken){
                 var old_activity = await _context.Activities.FindAsync(request.new_activity.Id);
                 /** 
                 With _mapper.Map(request.old_activity,activity) we are using CreateMap<param 1,param 2>(); from Mappingprofiles
                 which will help us assigning each new value to an old one rather than updating each one manually for ex.
                 old_activity.Title = request.new_activity.Title
                 old_activity.city = request.new_activity.city etc....
                 **/
                 _mapper.Map(request.new_activity,old_activity);
                 await _context.SaveChangesAsync();
                 return Unit.Value;
             }
         }
    }
}
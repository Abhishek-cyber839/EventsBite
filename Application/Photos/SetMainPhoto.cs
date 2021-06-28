using MediatR;
using Domain;
using Application.Core;
using Persistent;
using Application.Interfaces;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Collections.Generic;
using System.Linq;


namespace Application.Photos
{
    public class SetMainPhoto
    {
         public class Command: IRequest<Result<Unit>>{
            public string Id { get; set; }
        }
        public class Handler:IRequestHandler<Command,Result<Unit>>{
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context,IPhotoAccessor photoAccessor,IUserAccessor userAccessor){
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request,CancellationToken cancellationToken){
                var user  = await _context.Users
                .Include(user => user.Photos)
                .FirstOrDefaultAsync(Photo => Photo.UserName == _userAccessor.GetUsername());
                if(user == null) return null;
                var photo = user.Photos.FirstOrDefault(photo => photo.Id == request.Id);
                if(photo == null) return null;
                var currentMainPhoto = user.Photos.FirstOrDefault(photo => photo.IsMainPhoto);
                if(currentMainPhoto == null) return null;
                currentMainPhoto.IsMainPhoto = false; // unset IsMainPhoto
                photo.IsMainPhoto = true; // set IsMainPhoto

                var result = await _context.SaveChangesAsync() > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem Setting Main Photo : SetMainPhoto.cs");
            }
        }
    }
}
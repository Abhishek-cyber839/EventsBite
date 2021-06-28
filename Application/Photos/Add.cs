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
    public class Add
    {
        public class Command: IRequest<Result<Photo>>{
            public IFormFile File { get; set; }
        }
        public class Handler:IRequestHandler<Command,Result<Photo>>{
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context,IPhotoAccessor photoAccessor,IUserAccessor userAccessor){
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Photo>> Handle(Command request,CancellationToken cancellationToken){
                var user  = await _context.Users
                .Include(user => user.Photos)
                .FirstOrDefaultAsync(Photo => Photo.UserName == _userAccessor.GetUsername());
                if(user == null) return null;
                var photoUpoadResult = await _photoAccessor.AddPhoto(request.File);
                var photo = new Photo{
                    Url = photoUpoadResult.Url,
                    Id = photoUpoadResult.PublicId
                };
                // There's no other photo that is user's main profile photo so set this one as main by setting IsMainPhoto = true.
                if(!user.Photos.Any(p => p.IsMainPhoto)) photo.IsMainPhoto = true;
                user.Photos.Add(photo);
                var result = await _context.SaveChangesAsync() > 0;
                return result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Error Uploading Photo(): Add.cs") ;
            }
        }
    }
}
using Application.Photos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http; // IFormFile

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        Task<PhotoUpload> AddPhoto(IFormFile file);
        Task<string> DeletePhoto(string PublicId);
    }
}
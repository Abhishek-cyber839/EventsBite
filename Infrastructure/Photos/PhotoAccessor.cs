using Application.Interfaces;
using Application.Photos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http; // IFormFile
using Microsoft.Extensions.Options;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System;


namespace Infrastructure.Photos
{
    public class PhotoAccessor: IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinaryServices> options){
            // create new Cloudinary with options params
            var account = new Account(options.Value.CloudName,options.Value.ApiKey,options.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }
        public async Task<PhotoUpload> AddPhoto(IFormFile file){
            if(file.Length > 0){
                // use using keyword as stream will consume memory so we want to dispose it.
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams{
                    File = new FileDescription(file.FileName,stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };
                var uploadResults = await _cloudinary.UploadAsync(uploadParams);
                if(uploadResults.Error != null) throw new Exception(uploadResults.Error.Message);
                return new PhotoUpload{
                    PublicId = uploadResults.PublicId,
                    Url = uploadResults.SecureUrl.ToString()
                };
            }
            return null;
        }
        public async Task<string> DeletePhoto(string PublicId){
            var deleteParams = new DeletionParams(PublicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}
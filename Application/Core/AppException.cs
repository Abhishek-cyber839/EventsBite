namespace Application.Core
{
    public class AppException
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }

        public AppException(int statusCode,string message,string details = null){
            Status = statusCode;
            Message = message;
            Details = details;
        }
    }
}
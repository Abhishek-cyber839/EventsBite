using System;
using System.Text.Json.Serialization;

namespace Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id {get; set;}
        public string Title {get; set;}
        public string Category {get; set;}
        public DateTime Date {get; set;}
        [JsonIgnore] // We're not going to send this to the user.
        public String HostUserName {get; set;}

    }
}
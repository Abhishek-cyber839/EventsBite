using System;
using System.Collections.Generic;
using Application.Profiles;

namespace Application.Features
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public DateTime Date { get; set; }
        public ICollection<Profile> Participants { get; set; }
        public string HostUserName { get; set; }
        public bool IsCancelled {get; set;}
    }
}
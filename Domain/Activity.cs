using System;
using Domain;
using System.Collections.Generic;

namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public DateTime Date { get; set; }
        /* Add new List<ActivityPaticipants>(); so that we won't get null reference in response.*/
        public ICollection<ActivityPaticipants> Participants { get; set; } = new List<ActivityPaticipants>();
        public bool IsCancelled {get; set;}
        public ICollection<Comment> Comments{ get; set; } = new List<Comment>();
    }
}
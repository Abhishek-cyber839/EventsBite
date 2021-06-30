using Application.Core;
using System;

namespace Application.Features
{
    public class ActivityParams : PagingParams
    {
        public bool IsGoing { get; set; }
        public bool IsHosting { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}
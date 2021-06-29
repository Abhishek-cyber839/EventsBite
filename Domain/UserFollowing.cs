namespace Domain
{
    public class UserFollowing
    {
        public string ObserverId { get; set; }
        public User Observer { get; set; } // user who is following
        public string TargetId { get; set; }
        public User Target { get; set; } // user who is followed by follower in this case observer
    }
}
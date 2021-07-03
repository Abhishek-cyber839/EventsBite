using System;

namespace Domain
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public User User { get; set; }
        public string Token { get; set; }
        public DateTime Expiry { get; set; } = DateTime.UtcNow.AddDays(7);
        public DateTime? Revoked { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expiry;
        public bool IsActive => Revoked == null && !IsExpired;
    }
}
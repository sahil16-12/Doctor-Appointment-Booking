using backend.Models;

namespace backend.Services
{
    public interface ITokenService
    {
        string GenerateToken(int userId, UserType userType);
    }
}

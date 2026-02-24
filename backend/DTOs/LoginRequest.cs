using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs
{
    /// <summary>
    /// Represents login request payload.
    /// </summary>
    public class LoginRequest
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets user email address.
        /// </summary>
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets user password text.
        /// </summary>
        [Required]
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets user role used for role-specific login.
        /// </summary>
        [Required]
        [EnumDataType(typeof(UserType))]
        public UserType UserType { get; set; }

        #endregion
    }
}

using backend.Mapping;

namespace backend.DTOs
{
    /// <summary>
    /// Represents clinic information for doctor's practice location.
    /// </summary>
    public class DoctorClinicResponse
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets clinic identifier.
        /// </summary>
        [MapProperty("L05F01")]
        public int ClinicId { get; set; }

        /// <summary>
        /// Gets or sets clinic name.
        /// </summary>
        [MapProperty("L05F02")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets clinic city.
        /// </summary>
        [MapProperty("L05F04")]
        public string City { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets clinic address.
        /// </summary>
        [MapProperty("L05F03")]
        public string Address { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets clinic state.
        /// </summary>
        [MapProperty("L05F05")]
        public string State { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets clinic postal code.
        /// </summary>
        [MapProperty("L05F06")]
        public string? Pincode { get; set; }

        /// <summary>
        /// Gets or sets clinic phone number.
        /// </summary>
        [MapProperty("L05F09")]
        public string? Phone { get; set; }

        /// <summary>
        /// Gets or sets clinic latitude coordinate.
        /// </summary>
        [MapProperty("L05F07")]
        public decimal? Latitude { get; set; }

        /// <summary>
        /// Gets or sets clinic longitude coordinate.
        /// </summary>
        [MapProperty("L05F08")]
        public decimal? Longitude { get; set; }

        /// <summary>
        /// Gets or sets doctor's consultation fee at this clinic.
        /// </summary>
        public decimal? ConsultationFee { get; set; }

        #endregion
    }
}

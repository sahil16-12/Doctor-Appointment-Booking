using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    /// <summary>
    /// Represents the Entity Framework database context.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationDbContext"/> class.
        /// </summary>
        /// <param name="options">The database context options.</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        #endregion

        #region Public Properties

        /// <summary>
        /// Gets or sets the user table mapping.
        /// </summary>
        public DbSet<TBL01> Users { get; set; }

        /// <summary>
        /// Gets or sets the patient table mapping.
        /// </summary>
        public DbSet<TBL02> Patients { get; set; }

        /// <summary>
        /// Gets or sets the doctor table mapping.
        /// </summary>
        public DbSet<TBL03> Doctors { get; set; }

        /// <summary>
        /// Gets or sets the appointment table mapping.
        /// </summary>
        public DbSet<TBL04> Appointments { get; set; }

        #endregion

        #region Protected Methods

        /// <summary>
        /// Configures entity relationships and mapping behavior.
        /// </summary>
        /// <param name="modelBuilder">The model builder instance.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TBL01>(entity =>
            {
                entity.ToTable("users");
                entity.HasIndex(e => e.L01F04).IsUnique();
                entity.Property(e => e.L01F08).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.L01F02)
                    .HasConversion<string>();
            });

            modelBuilder.Entity<TBL02>(entity =>
            {
                entity.ToTable("patients");
                entity.Property(e => e.L02F05).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(p => p.L02F06)
                    .WithOne(u => u.L01F09)
                    .HasForeignKey<TBL02>(p => p.L02F02)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TBL03>(entity =>
            {
                entity.ToTable("doctors");
                entity.Property(e => e.L03F06).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.L03F07)
                    .WithOne(u => u.L01F10)
                    .HasForeignKey<TBL03>(d => d.L03F02)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TBL04>(entity =>
            {
                entity.ToTable("appointments");
                entity.Property(e => e.L04F06)
                    .HasConversion<string>();
                entity.Property(e => e.L04F08)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.L04F09)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasIndex(e => new { e.L04F03, e.L04F04 });
                entity.HasIndex(e => new { e.L04F02, e.L04F04 });

                entity.HasOne<TBL01>()
                    .WithMany()
                    .HasForeignKey(e => e.L04F02)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<TBL01>()
                    .WithMany()
                    .HasForeignKey(e => e.L04F03)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        #endregion
    }
}

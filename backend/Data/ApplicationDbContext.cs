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

        /// <summary>
        /// Gets or sets the clinic table mapping.
        /// </summary>
        public DbSet<TBL05> Clinics { get; set; }

        /// <summary>
        /// Gets or sets the doctor-clinic mapping table.
        /// </summary>
        public DbSet<TBL06> DoctorClinics { get; set; }

        /// <summary>
        /// Gets or sets the appointment slot table mapping.
        /// </summary>
        public DbSet<TBL07> AppointmentSlots { get; set; }

        /// <summary>
        /// Gets or sets the prescription table mapping.
        /// </summary>
        public DbSet<TBL08> Prescriptions { get; set; }

        /// <summary>
        /// Gets or sets the medical documents table mapping.
        /// </summary>
        public DbSet<TBL09> MedicalDocuments { get; set; }

        /// <summary>
        /// Gets or sets the payments table mapping.
        /// </summary>
        public DbSet<TBL10> Payments { get; set; }

        /// <summary>
        /// Gets or sets the refunds table mapping.
        /// </summary>
        public DbSet<TBL11> Refunds { get; set; }

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
                entity.Property(e => e.L01F08).HasColumnType("datetime");
                entity.Property(e => e.L01F02)
                    .HasConversion<string>();
            });

            modelBuilder.Entity<TBL02>(entity =>
            {
                entity.ToTable("patients");
                entity.Property(e => e.L02F05).HasColumnType("datetime");

                entity.HasOne(p => p.L02F06)
                    .WithOne(u => u.L01F09)
                    .HasForeignKey<TBL02>(p => p.L02F02)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TBL03>(entity =>
            {
                entity.ToTable("doctors");
                entity.Property(e => e.L03F06).HasColumnType("datetime");

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
                entity.Property(e => e.L04F08).HasColumnType("datetime");
                entity.Property(e => e.L04F09).HasColumnType("datetime");

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

            modelBuilder.Entity<TBL05>(entity =>
            {
                entity.ToTable("clinics");
                entity.Property(e => e.L05F10).HasColumnType("datetime");
            });

            modelBuilder.Entity<TBL06>(entity =>
            {
                entity.ToTable("doctor_clinics");
                entity.Property(e => e.L06F05).HasColumnType("datetime");
                entity.HasIndex(e => new { e.L06F02, e.L06F03 }).IsUnique();

                entity.HasOne(dc => dc.L06F06)
                    .WithMany()
                    .HasForeignKey(dc => dc.L06F02)
                    .HasPrincipalKey(d => d.L03F02)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(dc => dc.L06F07)
                    .WithMany()
                    .HasForeignKey(dc => dc.L06F03)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TBL07>(entity =>
            {
                entity.ToTable("appointment_slots");
                entity.Property(e => e.L07F07).HasColumnType("datetime");
                entity.HasIndex(e => new { e.L07F02, e.L07F03, e.L07F04 }).IsUnique();

                entity.HasOne(slot => slot.L07F08)
                    .WithMany()
                    .HasForeignKey(slot => slot.L07F02)
                    .HasPrincipalKey(d => d.L03F02)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(slot => slot.L07F09)
                    .WithMany()
                    .HasForeignKey(slot => slot.L07F03)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TBL09>(entity =>
            {
                entity.ToTable("medical_documents");
                entity.Property(e => e.L09F09).HasColumnType("datetime");
                entity.HasIndex(e => e.L09F02);

                entity.HasOne<TBL01>()
                    .WithMany()
                    .HasForeignKey(e => e.L09F02)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TBL10>(entity =>
            {
                entity.ToTable("payments");
                entity.HasKey(e => e.L10F01);
                entity.Property(e => e.L10F01).HasColumnName("payment_id").ValueGeneratedOnAdd();
                entity.Property(e => e.L10F12).HasColumnType("datetime");
                entity.Property(e => e.L10F13).HasColumnType("datetime");
                
                entity.HasIndex(e => e.L10F02);
                entity.HasIndex(e => e.L10F07).IsUnique();

                entity.HasOne(e => e.Appointment)
                    .WithMany()
                    .HasForeignKey(e => e.L10F02)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.L10F03)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Doctor)
                    .WithMany()
                    .HasForeignKey(e => e.L10F04)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TBL11>(entity =>
            {
                entity.ToTable("refunds");
                entity.HasKey(e => e.L11F01);
                entity.Property(e => e.L11F01).HasColumnName("refund_id").ValueGeneratedOnAdd();
                entity.Property(e => e.L11F09).HasColumnType("datetime");
                entity.Property(e => e.L11F10).HasColumnType("datetime");
                
                entity.HasIndex(e => e.L11F02);
                entity.HasIndex(e => e.L11F05).IsUnique();

                entity.HasOne(e => e.Payment)
                    .WithMany()
                    .HasForeignKey(e => e.L11F02)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Appointment)
                    .WithMany()
                    .HasForeignKey(e => e.L11F03)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        #endregion
    }
}

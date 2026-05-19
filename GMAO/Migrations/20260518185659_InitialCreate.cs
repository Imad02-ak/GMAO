using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GMAO.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Departements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DivisionId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Divisions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UniteId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Divisions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Entreprises",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Wilaya = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Daira = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Commune = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateCreation = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entreprises", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Equipements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tag = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Criticite = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ServiceId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Organes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SousEnsembleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DepartementId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SousEnsembles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EquipementId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousEnsembles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Unites",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Unites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserAccounts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAccounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserAccounts_Entreprises_EntrepriseId",
                        column: x => x.EntrepriseId,
                        principalTable: "Entreprises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Departements_DivisionId",
                table: "Departements",
                column: "DivisionId");

            migrationBuilder.CreateIndex(
                name: "IX_Divisions_UniteId",
                table: "Divisions",
                column: "UniteId");

            migrationBuilder.CreateIndex(
                name: "IX_Entreprises_Code",
                table: "Entreprises",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Equipements_ServiceId",
                table: "Equipements",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Organes_SousEnsembleId",
                table: "Organes",
                column: "SousEnsembleId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_DepartementId",
                table: "Services",
                column: "DepartementId");

            migrationBuilder.CreateIndex(
                name: "IX_SousEnsembles_EquipementId",
                table: "SousEnsembles",
                column: "EquipementId");

            migrationBuilder.CreateIndex(
                name: "IX_Unites_EntrepriseId",
                table: "Unites",
                column: "EntrepriseId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAccounts_Email",
                table: "UserAccounts",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserAccounts_EntrepriseId",
                table: "UserAccounts",
                column: "EntrepriseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Departements");

            migrationBuilder.DropTable(
                name: "Divisions");

            migrationBuilder.DropTable(
                name: "Equipements");

            migrationBuilder.DropTable(
                name: "Organes");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "SousEnsembles");

            migrationBuilder.DropTable(
                name: "Unites");

            migrationBuilder.DropTable(
                name: "UserAccounts");

            migrationBuilder.DropTable(
                name: "Entreprises");
        }
    }
}

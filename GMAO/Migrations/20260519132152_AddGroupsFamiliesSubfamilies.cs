using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GMAO.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupsFamiliesSubfamilies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FamillesArticles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupeId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamillesArticles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FamillesEquipements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupeId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamillesEquipements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FamillesOrganes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupeId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamillesOrganes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupesArticles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupesArticles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupesEquipements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupesEquipements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupesOrganes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupesOrganes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SousFamillesArticles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilleId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    GroupeId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousFamillesArticles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SousFamillesEquipements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilleId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    GroupeId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousFamillesEquipements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SousFamillesOrganes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilleId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    GroupeId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousFamillesOrganes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FamillesArticles_GroupeId",
                table: "FamillesArticles",
                column: "GroupeId");

            migrationBuilder.CreateIndex(
                name: "IX_FamillesEquipements_GroupeId",
                table: "FamillesEquipements",
                column: "GroupeId");

            migrationBuilder.CreateIndex(
                name: "IX_FamillesOrganes_GroupeId",
                table: "FamillesOrganes",
                column: "GroupeId");

            migrationBuilder.CreateIndex(
                name: "IX_SousFamillesArticles_FamilleId",
                table: "SousFamillesArticles",
                column: "FamilleId");

            migrationBuilder.CreateIndex(
                name: "IX_SousFamillesEquipements_FamilleId",
                table: "SousFamillesEquipements",
                column: "FamilleId");

            migrationBuilder.CreateIndex(
                name: "IX_SousFamillesOrganes_FamilleId",
                table: "SousFamillesOrganes",
                column: "FamilleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FamillesArticles");

            migrationBuilder.DropTable(
                name: "FamillesEquipements");

            migrationBuilder.DropTable(
                name: "FamillesOrganes");

            migrationBuilder.DropTable(
                name: "GroupesArticles");

            migrationBuilder.DropTable(
                name: "GroupesEquipements");

            migrationBuilder.DropTable(
                name: "GroupesOrganes");

            migrationBuilder.DropTable(
                name: "SousFamillesArticles");

            migrationBuilder.DropTable(
                name: "SousFamillesEquipements");

            migrationBuilder.DropTable(
                name: "SousFamillesOrganes");
        }
    }
}

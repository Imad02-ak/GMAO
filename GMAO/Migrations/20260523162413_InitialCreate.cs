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

            migrationBuilder.CreateTable(
                name: "Unites",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Wilaya = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Daira = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Commune = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Directeur = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EntrepriseId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Unites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Unites_Entreprises_EntrepriseId",
                        column: x => x.EntrepriseId,
                        principalTable: "Entreprises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.CreateTable(
                name: "Divisions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Responsable = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UniteId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Divisions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Divisions_Unites_UniteId",
                        column: x => x.UniteId,
                        principalTable: "Unites",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Departements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Chef = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DivisionId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Departements_Divisions_DivisionId",
                        column: x => x.DivisionId,
                        principalTable: "Divisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Chef = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartementId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Services_Departements_DepartementId",
                        column: x => x.DepartementId,
                        principalTable: "Departements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Equipements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Marque = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fournisseur = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumeroSerie = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateAchat = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PrixAchat = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    DateMiseEnService = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PeriodeGarantie = table.Column<int>(type: "int", nullable: true),
                    PeriodeGarantieUnite = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Criticite = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Photo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupeNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilleNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SousFamilleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SousFamilleNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tag = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ServiceId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Equipements_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SousEnsembles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReferenceInterne = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReferenceFabricant = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Marque = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fournisseur = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UniteMesure = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StockActuel = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    EmplacementStock = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StockMinimum = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    StockCritique = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    QteReapprovisionnement = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    PrixUnitaire = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    ValeurTotale = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    DateInventaire = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateDernierMouvement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Photo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupeNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilleNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SousFamilleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SousFamilleNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrganeLinksJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EquipementId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EntrepriseId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousEnsembles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SousEnsembles_Equipements_EquipementId",
                        column: x => x.EquipementId,
                        principalTable: "Equipements",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Organes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GroupeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupeNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilleNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SousFamilleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SousFamilleNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EquipementId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EquipementNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EquipementCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Marque = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Reference = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fournisseur = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateInstallation = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateRemplacement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DureeVie = table.Column<int>(type: "int", nullable: true),
                    DureeVieUnite = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrixUnitaire = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    PeriodeGarantie = table.Column<int>(type: "int", nullable: true),
                    PeriodeGarantieUnite = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PositionSurEquipement = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DescriptionTechnique = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Photo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SousEnsembleId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Organes_Equipements_EquipementId",
                        column: x => x.EquipementId,
                        principalTable: "Equipements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Organes_SousEnsembles_SousEnsembleId",
                        column: x => x.SousEnsembleId,
                        principalTable: "SousEnsembles",
                        principalColumn: "Id");
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
                name: "IX_Organes_EquipementId",
                table: "Organes",
                column: "EquipementId");

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
                name: "Organes");

            migrationBuilder.DropTable(
                name: "SousFamillesArticles");

            migrationBuilder.DropTable(
                name: "SousFamillesEquipements");

            migrationBuilder.DropTable(
                name: "SousFamillesOrganes");

            migrationBuilder.DropTable(
                name: "UserAccounts");

            migrationBuilder.DropTable(
                name: "SousEnsembles");

            migrationBuilder.DropTable(
                name: "Equipements");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Departements");

            migrationBuilder.DropTable(
                name: "Divisions");

            migrationBuilder.DropTable(
                name: "Unites");

            migrationBuilder.DropTable(
                name: "Entreprises");
        }
    }
}

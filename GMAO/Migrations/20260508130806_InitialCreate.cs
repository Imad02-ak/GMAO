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
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Wilaya = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Daira = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Commune = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateCreation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entreprises", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fournisseurs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Contact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DelaiMoyen = table.Column<int>(type: "int", nullable: false),
                    Actif = table.Column<bool>(type: "bit", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fournisseurs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupesArticle",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupesArticle", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupesEquipement",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupesEquipement", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupesOrgane",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupesOrgane", x => x.Id);
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
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Directeur = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                name: "Utilisateurs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MotDePasseHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateNaissance = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilisateurs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Utilisateurs_Entreprises_EntrepriseId",
                        column: x => x.EntrepriseId,
                        principalTable: "Entreprises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CommandesAchat",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Numero = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FournisseurId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateCommande = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateLivraisonPrevue = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateLivraisonReelle = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MontantTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Observations = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommandesAchat", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommandesAchat_Fournisseurs_FournisseurId",
                        column: x => x.FournisseurId,
                        principalTable: "Fournisseurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FamillesArticle",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GroupeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamillesArticle", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamillesArticle_GroupesArticle_GroupeId",
                        column: x => x.GroupeId,
                        principalTable: "GroupesArticle",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FamillesEquipement",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GroupeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamillesEquipement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamillesEquipement_GroupesEquipement_GroupeId",
                        column: x => x.GroupeId,
                        principalTable: "GroupesEquipement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FamillesOrgane",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GroupeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamillesOrgane", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamillesOrgane_GroupesOrgane_GroupeId",
                        column: x => x.GroupeId,
                        principalTable: "GroupesOrgane",
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
                    Wilaya = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Daira = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Commune = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Responsable = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UniteId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                name: "SousFamillesArticle",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousFamillesArticle", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SousFamillesArticle_FamillesArticle_FamilleId",
                        column: x => x.FamilleId,
                        principalTable: "FamillesArticle",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SousFamillesEquipement",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousFamillesEquipement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SousFamillesEquipement_FamillesEquipement_FamilleId",
                        column: x => x.FamilleId,
                        principalTable: "FamillesEquipement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SousFamillesOrgane",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousFamillesOrgane", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SousFamillesOrgane_FamillesOrgane_FamilleId",
                        column: x => x.FamilleId,
                        principalTable: "FamillesOrgane",
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
                    Wilaya = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Daira = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Commune = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Chef = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DivisionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                    Wilaya = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Daira = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Commune = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Batiment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Chef = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DepartementId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                    Tag = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Marque = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Modele = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumeroSerie = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fournisseur = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateAchat = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateMiseEnService = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateFinGarantie = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PrixAchat = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ValeurActuelle = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DureeVie = table.Column<int>(type: "int", nullable: true),
                    DureeVieUnite = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Criticite = table.Column<int>(type: "int", nullable: false),
                    Localisation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Batiment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ligne = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompteurHeures = table.Column<double>(type: "float", nullable: false),
                    CompteurCycles = table.Column<double>(type: "float", nullable: false),
                    CompteurDistance = table.Column<double>(type: "float", nullable: false),
                    SeuilAlerte = table.Column<double>(type: "float", nullable: true),
                    ServiceId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    SousFamilleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Equipements_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Equipements_SousFamillesEquipement_SousFamilleId",
                        column: x => x.SousFamilleId,
                        principalTable: "SousFamillesEquipement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Interventions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EquipementId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Motif = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateArret = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateReprise = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DureeReelleHeures = table.Column<double>(type: "float", nullable: true),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SaisiPar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Observation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interventions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Interventions_Equipements_EquipementId",
                        column: x => x.EquipementId,
                        principalTable: "Equipements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SousEnsembles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FonctionPrincipale = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Remplacable = table.Column<bool>(type: "bit", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EquipementId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousEnsembles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SousEnsembles_Equipements_EquipementId",
                        column: x => x.EquipementId,
                        principalTable: "Equipements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Organes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Marque = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Reference = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fournisseur = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParametresNominaux = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SeuilsAlarme = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateInstallation = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateRemplacement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DureeVie = table.Column<int>(type: "int", nullable: true),
                    DureeVieUnite = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrixUnitaire = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PositionSurEquipement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DescriptionTechnique = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SousEnsembleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SousFamilleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Organes_SousEnsembles_SousEnsembleId",
                        column: x => x.SousEnsembleId,
                        principalTable: "SousEnsembles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Organes_SousFamillesOrgane_SousFamilleId",
                        column: x => x.SousFamilleId,
                        principalTable: "SousFamillesOrgane",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Composants",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Matiere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dimensions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrganeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Composants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Composants_Organes_OrganeId",
                        column: x => x.OrganeId,
                        principalTable: "Organes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Articles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UniteMesure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReferenceInterne = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ReferenceFabricant = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Marque = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FournisseurId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StockActuel = table.Column<double>(type: "float", nullable: false),
                    StockMinimum = table.Column<double>(type: "float", nullable: false),
                    StockCritique = table.Column<double>(type: "float", nullable: false),
                    QteReapprovisionnement = table.Column<double>(type: "float", nullable: false),
                    PrixUnitaire = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    EmplacementStock = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SousFamilleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ComposantId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Articles_Composants_ComposantId",
                        column: x => x.ComposantId,
                        principalTable: "Composants",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Articles_Fournisseurs_FournisseurId",
                        column: x => x.FournisseurId,
                        principalTable: "Fournisseurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Articles_SousFamillesArticle_SousFamilleId",
                        column: x => x.SousFamilleId,
                        principalTable: "SousFamillesArticle",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ArticleOrganes",
                columns: table => new
                {
                    ArticleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OrganeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    QteUtilisee = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticleOrganes", x => new { x.ArticleId, x.OrganeId });
                    table.ForeignKey(
                        name: "FK_ArticleOrganes_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "Articles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ArticleOrganes_Organes_OrganeId",
                        column: x => x.OrganeId,
                        principalTable: "Organes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CommandeLignes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CommandeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ArticleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    QtCommandee = table.Column<double>(type: "float", nullable: false),
                    QtLivree = table.Column<double>(type: "float", nullable: false),
                    PrixUnitaire = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalLigne = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommandeLignes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommandeLignes_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "Articles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CommandeLignes_CommandesAchat_CommandeId",
                        column: x => x.CommandeId,
                        principalTable: "CommandesAchat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MouvementsStock",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ArticleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Motif = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantite = table.Column<double>(type: "float", nullable: false),
                    QuantiteAvant = table.Column<double>(type: "float", nullable: false),
                    QuantiteApres = table.Column<double>(type: "float", nullable: false),
                    PrixUnitaire = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ValeurMouvement = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    OtId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OtNumero = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BtId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BtNumero = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FournisseurId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumeroBC = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumeroBL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateMouvement = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SaisiPar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Observation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrepriseId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MouvementsStock", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MouvementsStock_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "Articles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArticleOrganes_OrganeId",
                table: "ArticleOrganes",
                column: "OrganeId");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_ComposantId",
                table: "Articles",
                column: "ComposantId");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_FournisseurId",
                table: "Articles",
                column: "FournisseurId");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_ReferenceInterne",
                table: "Articles",
                column: "ReferenceInterne");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_SousFamilleId",
                table: "Articles",
                column: "SousFamilleId");

            migrationBuilder.CreateIndex(
                name: "IX_CommandeLignes_ArticleId",
                table: "CommandeLignes",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_CommandeLignes_CommandeId",
                table: "CommandeLignes",
                column: "CommandeId");

            migrationBuilder.CreateIndex(
                name: "IX_CommandesAchat_FournisseurId",
                table: "CommandesAchat",
                column: "FournisseurId");

            migrationBuilder.CreateIndex(
                name: "IX_Composants_OrganeId",
                table: "Composants",
                column: "OrganeId");

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
                name: "IX_Equipements_SousFamilleId",
                table: "Equipements",
                column: "SousFamilleId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipements_Tag",
                table: "Equipements",
                column: "Tag",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FamillesArticle_GroupeId",
                table: "FamillesArticle",
                column: "GroupeId");

            migrationBuilder.CreateIndex(
                name: "IX_FamillesEquipement_GroupeId",
                table: "FamillesEquipement",
                column: "GroupeId");

            migrationBuilder.CreateIndex(
                name: "IX_FamillesOrgane_GroupeId",
                table: "FamillesOrgane",
                column: "GroupeId");

            migrationBuilder.CreateIndex(
                name: "IX_Interventions_EquipementId",
                table: "Interventions",
                column: "EquipementId");

            migrationBuilder.CreateIndex(
                name: "IX_MouvementsStock_ArticleId",
                table: "MouvementsStock",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_Organes_SousEnsembleId",
                table: "Organes",
                column: "SousEnsembleId");

            migrationBuilder.CreateIndex(
                name: "IX_Organes_SousFamilleId",
                table: "Organes",
                column: "SousFamilleId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_DepartementId",
                table: "Services",
                column: "DepartementId");

            migrationBuilder.CreateIndex(
                name: "IX_SousEnsembles_EquipementId",
                table: "SousEnsembles",
                column: "EquipementId");

            migrationBuilder.CreateIndex(
                name: "IX_SousFamillesArticle_FamilleId",
                table: "SousFamillesArticle",
                column: "FamilleId");

            migrationBuilder.CreateIndex(
                name: "IX_SousFamillesEquipement_FamilleId",
                table: "SousFamillesEquipement",
                column: "FamilleId");

            migrationBuilder.CreateIndex(
                name: "IX_SousFamillesOrgane_FamilleId",
                table: "SousFamillesOrgane",
                column: "FamilleId");

            migrationBuilder.CreateIndex(
                name: "IX_Unites_EntrepriseId",
                table: "Unites",
                column: "EntrepriseId");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Email",
                table: "Utilisateurs",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_EntrepriseId",
                table: "Utilisateurs",
                column: "EntrepriseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArticleOrganes");

            migrationBuilder.DropTable(
                name: "CommandeLignes");

            migrationBuilder.DropTable(
                name: "Interventions");

            migrationBuilder.DropTable(
                name: "MouvementsStock");

            migrationBuilder.DropTable(
                name: "Utilisateurs");

            migrationBuilder.DropTable(
                name: "CommandesAchat");

            migrationBuilder.DropTable(
                name: "Articles");

            migrationBuilder.DropTable(
                name: "Composants");

            migrationBuilder.DropTable(
                name: "Fournisseurs");

            migrationBuilder.DropTable(
                name: "SousFamillesArticle");

            migrationBuilder.DropTable(
                name: "Organes");

            migrationBuilder.DropTable(
                name: "FamillesArticle");

            migrationBuilder.DropTable(
                name: "SousEnsembles");

            migrationBuilder.DropTable(
                name: "SousFamillesOrgane");

            migrationBuilder.DropTable(
                name: "GroupesArticle");

            migrationBuilder.DropTable(
                name: "Equipements");

            migrationBuilder.DropTable(
                name: "FamillesOrgane");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "SousFamillesEquipement");

            migrationBuilder.DropTable(
                name: "GroupesOrgane");

            migrationBuilder.DropTable(
                name: "Departements");

            migrationBuilder.DropTable(
                name: "FamillesEquipement");

            migrationBuilder.DropTable(
                name: "Divisions");

            migrationBuilder.DropTable(
                name: "GroupesEquipement");

            migrationBuilder.DropTable(
                name: "Unites");

            migrationBuilder.DropTable(
                name: "Entreprises");
        }
    }
}

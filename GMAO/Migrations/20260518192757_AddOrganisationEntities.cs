using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GMAO.Migrations
{
    /// <inheritdoc />
    public partial class AddOrganisationEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Adresse",
                table: "Unites",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Commune",
                table: "Unites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Daira",
                table: "Unites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Unites",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Directeur",
                table: "Unites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Unites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telephone",
                table: "Unites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Wilaya",
                table: "Unites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Chef",
                table: "Services",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Services",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Services",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telephone",
                table: "Services",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Tag",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Statut",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Criticite",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Marque",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Divisions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Divisions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Responsable",
                table: "Divisions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telephone",
                table: "Divisions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Chef",
                table: "Departements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Departements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Departements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telephone",
                table: "Departements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Departements_Divisions_DivisionId",
                table: "Departements",
                column: "DivisionId",
                principalTable: "Divisions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Divisions_Unites_UniteId",
                table: "Divisions",
                column: "UniteId",
                principalTable: "Unites",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipements_Services_ServiceId",
                table: "Equipements",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Organes_SousEnsembles_SousEnsembleId",
                table: "Organes",
                column: "SousEnsembleId",
                principalTable: "SousEnsembles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Services_Departements_DepartementId",
                table: "Services",
                column: "DepartementId",
                principalTable: "Departements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SousEnsembles_Equipements_EquipementId",
                table: "SousEnsembles",
                column: "EquipementId",
                principalTable: "Equipements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Unites_Entreprises_EntrepriseId",
                table: "Unites",
                column: "EntrepriseId",
                principalTable: "Entreprises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departements_Divisions_DivisionId",
                table: "Departements");

            migrationBuilder.DropForeignKey(
                name: "FK_Divisions_Unites_UniteId",
                table: "Divisions");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipements_Services_ServiceId",
                table: "Equipements");

            migrationBuilder.DropForeignKey(
                name: "FK_Organes_SousEnsembles_SousEnsembleId",
                table: "Organes");

            migrationBuilder.DropForeignKey(
                name: "FK_Services_Departements_DepartementId",
                table: "Services");

            migrationBuilder.DropForeignKey(
                name: "FK_SousEnsembles_Equipements_EquipementId",
                table: "SousEnsembles");

            migrationBuilder.DropForeignKey(
                name: "FK_Unites_Entreprises_EntrepriseId",
                table: "Unites");

            migrationBuilder.DropColumn(
                name: "Adresse",
                table: "Unites");

            migrationBuilder.DropColumn(
                name: "Commune",
                table: "Unites");

            migrationBuilder.DropColumn(
                name: "Daira",
                table: "Unites");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Unites");

            migrationBuilder.DropColumn(
                name: "Directeur",
                table: "Unites");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Unites");

            migrationBuilder.DropColumn(
                name: "Telephone",
                table: "Unites");

            migrationBuilder.DropColumn(
                name: "Wilaya",
                table: "Unites");

            migrationBuilder.DropColumn(
                name: "Chef",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Telephone",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "Marque",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Divisions");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Divisions");

            migrationBuilder.DropColumn(
                name: "Responsable",
                table: "Divisions");

            migrationBuilder.DropColumn(
                name: "Telephone",
                table: "Divisions");

            migrationBuilder.DropColumn(
                name: "Chef",
                table: "Departements");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Departements");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Departements");

            migrationBuilder.DropColumn(
                name: "Telephone",
                table: "Departements");

            migrationBuilder.AlterColumn<string>(
                name: "Tag",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Statut",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Criticite",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}

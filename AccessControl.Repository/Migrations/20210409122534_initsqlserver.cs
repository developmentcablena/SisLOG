using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AccessControl.Repository.Migrations
{
    public partial class initsqlserver : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NotasFiscais",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NF = table.Column<int>(nullable: false),
                    Fornecedor = table.Column<string>(nullable: true),
                    Cidade = table.Column<string>(nullable: true),
                    UF = table.Column<string>(nullable: true),
                    Transportadora = table.Column<string>(nullable: true),
                    Valor = table.Column<decimal>(nullable: false),
                    Material = table.Column<string>(nullable: true),
                    Frete = table.Column<int>(nullable: false),
                    Volumes = table.Column<int>(nullable: false),
                    TipoVolume = table.Column<string>(nullable: true),
                    Peso = table.Column<decimal>(nullable: false),
                    Pedido = table.Column<string>(nullable: true),
                    KM = table.Column<decimal>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    DataCadastro = table.Column<DateTime>(nullable: false),
                    UsuarioId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotasFiscais", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(nullable: true),
                    Conta = table.Column<string>(nullable: true),
                    Senha = table.Column<string>(nullable: true),
                    Funcao = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    DataCadastro = table.Column<DateTime>(nullable: false),
                    Status = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Agendamentos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Motorista = table.Column<string>(nullable: true),
                    Documento = table.Column<string>(nullable: true),
                    Placa = table.Column<string>(nullable: true),
                    DataCadastro = table.Column<DateTime>(nullable: false),
                    DataEntrada = table.Column<DateTime>(nullable: true),
                    DataSaida = table.Column<DateTime>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    AprovadorId = table.Column<int>(nullable: true),
                    DataAprovacao = table.Column<DateTime>(nullable: true),
                    LiberadorId = table.Column<int>(nullable: true),
                    DataLiberacaoChegada = table.Column<DateTime>(nullable: true),
                    DataLiberacaoEntrada = table.Column<DateTime>(nullable: true),
                    DataLiberacaoSaida = table.Column<DateTime>(nullable: true),
                    UsuarioId = table.Column<int>(nullable: false),
                    NotaFiscalId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Agendamentos_NotasFiscais_NotaFiscalId",
                        column: x => x.NotaFiscalId,
                        principalTable: "NotasFiscais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_NotaFiscalId",
                table: "Agendamentos",
                column: "NotaFiscalId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Agendamentos");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "NotasFiscais");
        }
    }
}

# Discount Voucher

Este projeto faz parte do curso da Driven Education sobre testes unitários em Node.js e TypeScript. O projeto utiliza as tecnologias Node.js, TypeScript, Jest e PrismaDB para criar um sistema de vouchers de desconto. Ele inclui duas rotas: uma para criar um voucher de desconto e outra para aplicar o voucher em uma compra. <br>

Implementei os testes unitários para as duas rotas do projeto. Esses testes garantem que as funcionalidades das rotas de criação e aplicação de voucher de desconto estão funcionando corretamente, validando cenários de sucesso e também possíveis casos de erro.
## Pré-requisitos

Antes de executar o projeto, verifique se você possui os seguintes requisitos instalados em sua máquina de desenvolvimento:

- Node.js
- NPM 

## Configuração

Siga estas etapas para rodar os testes em sua máquina local:

1. Clone este repositório em sua máquina local.
2. Navegue até o diretório do projeto: cd discount-voucher.
3. Instale as dependências do projeto executando o seguinte comando: npm i.
4. Execute o comando no terminal para rodar os testes: npm run test

## Rotas

O projeto inclui as seguintes rotas:

### Rota: POST /vouchers

Esta rota é usada para criar um voucher de desconto. Ela espera receber os dados do voucher no corpo da requisição e segue a seguinte estrutura:
{
"code": "CODIGO_DO_VOUCHER",
"discount": 10
}

- `code` (string): O código do voucher.
- `discount` (number): O valor de desconto em porcentagem.

### Rota: POST /vouchers/apply

Esta rota é usada para aplicar um voucher de desconto em uma compra. Ela espera receber os dados da compra no corpo da requisição e segue a seguinte estrutura:
{
"voucherCode": "CODIGO_DO_VOUCHER",
"amount": 100
}

- `voucherCode` (string): O código do voucher a ser aplicado.
- `amount` (number): O valor total da compra.




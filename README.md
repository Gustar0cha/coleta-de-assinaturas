# Coleta de Assinaturas

Aplicacao mobile-first em Next.js, TypeScript e Tailwind CSS para coletar nome e CPF, validar os dados e registrar apoios em uma planilha Google Sheets via Google Apps Script.

## Instalar

```bash
npm install
```

## Rodar localmente

```bash
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Criar a planilha

1. Crie uma planilha no Google Sheets.
2. Crie uma aba chamada `Assinaturas`.
3. Na primeira linha, crie as colunas exatamente assim: `DATA/HORA`, `NOME`, `CPF`.
4. Copie o ID da planilha. Ele fica na URL, entre `/d/` e `/edit`.

## Configurar o Apps Script

1. Na planilha, acesse `Extensoes` > `Apps Script`.
2. Apague o conteudo inicial do editor.
3. Cole o conteudo de `google-apps-script/google-apps-script.gs`.
4. Troque `COLE_AQUI_O_ID_DA_PLANILHA` pelo ID da planilha.
5. Troque `COLE_AQUI_A_MESMA_CHAVE_DO_ENV` por uma chave longa e aleatoria.
6. Salve o projeto.

## Publicar como Web App

1. No Apps Script, clique em `Implantar` > `Nova implantacao`.
2. Escolha o tipo `App da Web`.
3. Em `Executar como`, selecione sua propria conta.
4. Em `Quem pode acessar`, selecione `Qualquer pessoa`.
5. Clique em `Implantar` e autorize as permissoes.
6. Copie a URL do Web App.

Sempre que alterar o Apps Script, crie uma nova implantacao ou edite a implantacao existente e selecione uma nova versao. A URL do Web App pode continuar a mesma quando voce atualiza a implantacao existente.

## Configurar variaveis locais

Crie `.env.local`:

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_WEB_APP_ID/exec
API_SECRET=sua-chave-longa-e-aleatoria
```

`API_SECRET` precisa ser igual ao valor configurado no Apps Script. Essa chave nunca e enviada ao navegador.

## Testar

```bash
npm run lint
npm run build
```

Depois, rode `npm run dev`, envie um CPF valido e confira se uma nova linha apareceu na aba `Assinaturas`.

## Publicar na Vercel

1. Suba o projeto para um repositorio Git.
2. Importe o repositorio na Vercel.
3. Configure as variaveis `GOOGLE_SCRIPT_URL` e `API_SECRET` em `Settings` > `Environment Variables`.
4. Publique o projeto.

## Comportamento implementado

- Mascara de CPF no frontend.
- Validacao matematica real de CPF no frontend, backend Next.js e Apps Script.
- Normalizacao do CPF para apenas numeros antes do armazenamento.
- Confirmacao antes do envio final.
- Estado de loading e tela de sucesso.
- Tratamento de CPF duplicado, nome incompleto, CPF invalido, erro de conexao e rate limit.
- Rate limiting simples por IP no Route Handler.
- `LockService` no Apps Script para evitar duplicidade em requisicoes simultaneas.
- Pagina `/privacidade` com explicacao LGPD.

## Observacoes de seguranca

O frontend chama apenas `/api/signatures`. A URL do Apps Script e a chave compartilhada ficam no backend por variaveis de ambiente. Para producao com alto volume, considere trocar o rate limit em memoria por Redis/KV e adicionar Cloudflare Turnstile.

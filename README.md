# Documentação do Ledger

## Executar com Docker

Pré-requisito: Docker com Compose v2.

Na raiz do projeto, execute:

```sh
docker compose up --build -d
```

Abra [http://localhost:3000](http://localhost:3000). O Docker instala as dependências, gera o site e disponibiliza a busca local.

Se a porta 3000 estiver ocupada, use outra porta:

```sh
LEDGER_DOCS_PORT=3001 docker compose up --build -d
```

Após editar uma página em `docs/`, execute novamente o comando de subida para reconstruir o site. Para parar, execute `docker compose down`.

## Navegação

A documentação está organizada por módulo. As fontes das regras estão em [Geral > Referências](docs/ledger/geral/referencias.md).

Para publicar o site sob um subdiretório, informe `DOCUSAURUS_URL` e `DOCUSAURUS_BASE_URL` como argumentos de build do Dockerfile.

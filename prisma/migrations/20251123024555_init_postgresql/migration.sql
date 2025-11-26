-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'atendente',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "avatar" TEXT,
    "telefone" TEXT,
    "setorId" TEXT,
    "ultimoHeartbeat" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "icone" TEXT,
    "cor" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "cep" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "plano" TEXT,
    "numeroApolice" TEXT,
    "seguradora" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veiculos" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "ano" INTEGER,
    "cor" TEXT,
    "renavam" TEXT,
    "chassi" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prestadores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "razaoSocial" TEXT,
    "tipoPessoa" TEXT NOT NULL,
    "cpf" TEXT,
    "cnpj" TEXT,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "celular" TEXT,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "servicos" JSONB NOT NULL,
    "raioAtuacao" INTEGER NOT NULL DEFAULT 50,
    "pixChave" TEXT,
    "banco" TEXT,
    "agencia" TEXT,
    "conta" TEXT,
    "tipoConta" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "avaliacaoMedia" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAtendimentos" INTEGER NOT NULL DEFAULT 0,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "ultimaAtualizacaoLocalizacao" TIMESTAMP(3),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prestadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_prestadores" (
    "id" TEXT NOT NULL,
    "prestadorId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "validade" TIMESTAMP(3),
    "arquivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_prestadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "protocolo" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "veiculoId" TEXT,
    "tipoServico" TEXT NOT NULL,
    "descricaoProblema" TEXT NOT NULL,
    "origemCep" TEXT,
    "origemEndereco" TEXT NOT NULL,
    "origemCidade" TEXT NOT NULL,
    "origemLatitude" DOUBLE PRECISION,
    "origemLongitude" DOUBLE PRECISION,
    "destinoCep" TEXT,
    "destinoEndereco" TEXT,
    "destinoCidade" TEXT,
    "destinoLatitude" DOUBLE PRECISION,
    "destinoLongitude" DOUBLE PRECISION,
    "distanciaKm" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "prestadorId" TEXT,
    "valorCotado" DOUBLE PRECISION,
    "valorFinal" DOUBLE PRECISION,
    "atendenteId" TEXT,
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtribuicao" TIMESTAMP(3),
    "dataInicio" TIMESTAMP(3),
    "dataConclusao" TIMESTAMP(3),
    "dataCancelamento" TIMESTAMP(3),
    "tempoEspera" INTEGER,
    "tempoAtendimento" INTEGER,
    "avaliacaoCliente" INTEGER,
    "comentarioCliente" TEXT,
    "fotoConclusao" TEXT,
    "conclusaoCep" TEXT,
    "conclusaoEndereco" TEXT,
    "conclusaoCidade" TEXT,
    "conclusaoLatitude" DOUBLE PRECISION,
    "conclusaoLongitude" DOUBLE PRECISION,
    "comprovantePagamento" TEXT,
    "observacoes" TEXT,
    "motivoCancelamento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_tickets" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'texto',
    "conteudo" TEXT NOT NULL,
    "arquivo" TEXT,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes_prestadores" (
    "id" TEXT NOT NULL,
    "prestadorId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_prestadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "ticketProtocolo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "dataPagamento" TIMESTAMP(3),
    "comprovante" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabela_precos" (
    "id" TEXT NOT NULL,
    "tipoServico" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "precoBase" DOUBLE PRECISION NOT NULL,
    "precoKmAdicional" DOUBLE PRECISION,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tabela_precos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "link" TEXT,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "entidade" TEXT,
    "entidadeId" TEXT,
    "usuarioId" TEXT,
    "usuarioNome" TEXT,
    "usuarioEmail" TEXT,
    "metadados" JSONB,
    "nivel" TEXT NOT NULL DEFAULT 'info',
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "modulo" TEXT NOT NULL,
    "permissao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "setores_nome_key" ON "setores"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_key" ON "clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_placa_key" ON "veiculos"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "prestadores_cpf_key" ON "prestadores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "prestadores_cnpj_key" ON "prestadores"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "prestadores_email_key" ON "prestadores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_protocolo_key" ON "tickets"("protocolo");

-- CreateIndex
CREATE UNIQUE INDEX "tabela_precos_tipoServico_key" ON "tabela_precos"("tipoServico");

-- CreateIndex
CREATE INDEX "notificacoes_usuarioId_idx" ON "notificacoes"("usuarioId");

-- CreateIndex
CREATE INDEX "notificacoes_lida_idx" ON "notificacoes"("lida");

-- CreateIndex
CREATE INDEX "notificacoes_createdAt_idx" ON "notificacoes"("createdAt");

-- CreateIndex
CREATE INDEX "logs_tipo_idx" ON "logs"("tipo");

-- CreateIndex
CREATE INDEX "logs_acao_idx" ON "logs"("acao");

-- CreateIndex
CREATE INDEX "logs_nivel_idx" ON "logs"("nivel");

-- CreateIndex
CREATE INDEX "logs_usuarioId_idx" ON "logs"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_createdAt_idx" ON "logs"("createdAt");

-- CreateIndex
CREATE INDEX "permissoes_role_idx" ON "permissoes"("role");

-- CreateIndex
CREATE INDEX "permissoes_ativo_idx" ON "permissoes"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_role_modulo_permissao_key" ON "permissoes"("role", "modulo", "permissao");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_prestadores" ADD CONSTRAINT "documentos_prestadores_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "prestadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "veiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "prestadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_atendenteId_fkey" FOREIGN KEY ("atendenteId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_tickets" ADD CONSTRAINT "historico_tickets_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_prestadores" ADD CONSTRAINT "avaliacoes_prestadores_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "prestadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

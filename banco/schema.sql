DROP TABLE IF EXISTS movimentacoes CASCADE;
DROP TABLE IF EXISTS amostras CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS exames CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;

CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE,
    sexo VARCHAR(20),
    telefone VARCHAR(20),
    criado_em TIMESTAMP DEFAULT NOW()
);
CREATE TABLE exames (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    setor VARCHAR(50) NOT NULL CHECK (setor IN ('HEMATOLOGIA','BIOQUIMICA','MICROBIOLOGIA','IMUNOLOGIA','PARASITOLOGIA','UROANALISE')),
    prazo_minutos INTEGER
);
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL CHECK (perfil IN ('ADMIN','RECEPCAO','TECNICO','BIOMEDICO')),
    criado_em TIMESTAMP DEFAULT NOW()
);
CREATE TABLE amostras (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL, 
    paciente_id INTEGER REFERENCES pacientes(id),
    exame_id INTEGER REFERENCES exames(id),
    status VARCHAR(30) NOT NULL DEFAULT 'CADASTRADO'
        CHECK (status IN ('CADASTRADO','COLETADO','RECEBIDO_NO_SETOR','EM_ANALISE','CONCLUIDO','LIBERADO')),
    data_cadastro TIMESTAMP DEFAULT NOW(),
    data_coleta TIMESTAMP,
    data_recebimento_setor TIMESTAMP,
    data_inicio_analise TIMESTAMP,
    data_conclusao TIMESTAMP,
    data_liberacao TIMESTAMP,
    usuario_cadastro_id INTEGER REFERENCES usuarios(id)
);
CREATE TABLE movimentacoes (
    id SERIAL PRIMARY KEY,
    amostra_id INTEGER REFERENCES amostras(id),
    status_anterior VARCHAR(30),
    status_novo VARCHAR(30) NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id),
    data_movimentacao TIMESTAMP DEFAULT NOW(),
    observacao TEXT
);
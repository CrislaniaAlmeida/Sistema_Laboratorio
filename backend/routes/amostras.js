const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todas as amostras (com nome do paciente e do exame, não só o ID)
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT a.*, p.nome AS paciente_nome, e.nome AS exame_nome, e.setor
            FROM amostras a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN exames e ON a.exame_id = e.id
            ORDER BY a.id
        `);
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar amostras' });
    }
});

// Cadastrar uma nova amostra
router.post('/', async (req, res) => {
    const { paciente_id, exame_id } = req.body;

    if (!paciente_id || !exame_id) {
        return res.status(400).json({ erro: 'paciente_id e exame_id são obrigatórios' });
    }

    // Gera um código simples de rastreio, ex: AM-1719340800000
    const codigo = `AM-${Date.now()}`;

    try {
        const resultado = await pool.query(
            `INSERT INTO amostras (codigo, paciente_id, exame_id, status, data_cadastro, usuario_cadastro_id)
             VALUES ($1, $2, $3, 'CADASTRADO', NOW(), $4)
             RETURNING *`,
            [codigo, paciente_id, exame_id, req.usuario.id]
        );

        const amostra = resultado.rows[0];

        // Registra o primeiro evento no histórico de movimentações
        await pool.query(
            `INSERT INTO movimentacoes (amostra_id, status_anterior, status_novo, usuario_id)
             VALUES ($1, NULL, 'CADASTRADO', $2)`,
            [amostra.id, req.usuario.id]
        );

        res.status(201).json(amostra);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar amostra' });
    }
});

const STATUS_VALIDOS = ['CADASTRADO', 'COLETADO', 'RECEBIDO_NO_SETOR', 'EM_ANALISE', 'CONCLUIDO', 'LIBERADO'];

// Mapeia cada status para a coluna de data que deve ser preenchida
const CAMPO_DATA = {
    COLETADO: 'data_coleta',
    RECEBIDO_NO_SETOR: 'data_recebimento_setor',
    EM_ANALISE: 'data_inicio_analise',
    CONCLUIDO: 'data_conclusao',
    LIBERADO: 'data_liberacao',
};

// Avançar o status de uma amostra
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { novo_status, observacao } = req.body;

    if (!STATUS_VALIDOS.includes(novo_status)) {
        return res.status(400).json({ erro: 'Status inválido' });
    }

    try {
        const amostraAtual = await pool.query('SELECT status FROM amostras WHERE id = $1', [id]);
        if (amostraAtual.rows.length === 0) {
            return res.status(404).json({ erro: 'Amostra não encontrada' });
        }
        const statusAnterior = amostraAtual.rows[0].status;

        const campoData = CAMPO_DATA[novo_status];
        const query = campoData
            ? `UPDATE amostras SET status = $1, ${campoData} = NOW() WHERE id = $2 RETURNING *`
            : `UPDATE amostras SET status = $1 WHERE id = $2 RETURNING *`;

        const resultado = await pool.query(query, [novo_status, id]);

        await pool.query(
            `INSERT INTO movimentacoes (amostra_id, status_anterior, status_novo, usuario_id, observacao)
             VALUES ($1, $2, $3, $4, $5)`,
            [id, statusAnterior, novo_status, req.usuario.id, observacao || null]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao atualizar status' });
    }
});

// Buscar o histórico completo de uma amostra
router.get('/:id/historico', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query(
            `SELECT * FROM movimentacoes WHERE amostra_id = $1 ORDER BY data_movimentacao ASC`,
            [id]
        );
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar histórico' });
    }
});

// Listar amostras com SLA atrasado
router.get('/atrasadas', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT a.id, a.codigo, a.status, a.data_coleta,
                   p.nome AS paciente_nome,
                   e.nome AS exame_nome, e.prazo_minutos,
                   ROUND(EXTRACT(EPOCH FROM (NOW() - a.data_coleta)) / 60) AS minutos_decorridos
            FROM amostras a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN exames e ON a.exame_id = e.id
            WHERE a.status != 'LIBERADO'
              AND a.data_coleta IS NOT NULL
              AND e.prazo_minutos IS NOT NULL
              AND EXTRACT(EPOCH FROM (NOW() - a.data_coleta)) / 60 > e.prazo_minutos
            ORDER BY minutos_decorridos DESC
        `);
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar amostras atrasadas' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db');

//Listar todos os exames 
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM exames ORDER BY id');
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({erro: 'Erro ao buscar exames'});
    }
});

//Cadastrar um novo exame
router.post('/', async (req, res) => {
    const {nome, setor, prazo_minutos } = req.body;

    if (!nome || !setor) {
        return res.status(400).json ({erro: 'Nome e setor são obrigatórios'});
    }
    try {
        const resultado = await pool.query(
            `INSERT INTO exames (nome, setor, prazo_minutos)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [nome, setor, prazo_minutos || null] 
        );
        res.status(201).json(resultado.rows[0]);
    } catch (erro){
        console.error(erro);
        if (erro.code === '23514') {
            return res.status(400).json({
                erro:'Setor inválido. Use: HEMATOLOGIA, BIOQUIMICA, MICROBIOLOGIA, IMUNOLOGIA, PARASITOLOGIA ou UROANALISE'
            });
        }
        res.status(500).json({erro: 'Erro ao cadastrar exame'});
    }
});
module.exports = router;
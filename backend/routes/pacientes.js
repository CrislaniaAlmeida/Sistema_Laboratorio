const express = require('express');
const router = express.Router();
const pool = require('../db');

//Listar todos os pacientes 
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM pacientes ORDER BY id');
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({erro: 'Erro ao buscar pacientes'});
    }
});

//Cadastrar um novo paciente
router.post('/', async (req, res) => {
    const {nome, cpf, data_nascimento, sexo, telefone} = req.body;

    if (!nome || !cpf) {
        return res.status(400).json({erro: 'Nome e CPF são obrigatorios'});
    }

    try {
        const resultado = await pool.query(
            `INSERT INTO pacientes (nome, cpf, data_nascimento, sexo, telefone)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
             [nome,cpf, data_nascimento, sexo, telefone]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        if (erro.code === '23505') {
            return res.status(409).json({erro: 'CPF já cadastrado'});
        }
        res.status(500).json({erro: 'Erro ao cadastrar paciente'});
    }
});

module.exports = router;
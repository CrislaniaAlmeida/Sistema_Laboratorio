const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

//Cadastrar novo usuário
router.post('/registrar', async (req, res) => {
    const {nome, login, senha, perfil} = req.body;

    if (!nome || !login || !senha || !perfil) {
        return res.status(400).json ({ erro: 'Nome, login, senha e perfil são obrigatórios '});
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, login, senha_hash, perfil)
            VALUES ($1, $2, $3, $4)
            RETURNING id, nome, login, perfil`,
            [nome, login, senhaHash, perfil]
        );

        res.status(201).json(resultado.rows[0]);
    }catch (erro) {
        console. error(erro);
        if (erro.code === '23505') {
            return res.status(409).json({ erro: 'Login já cadastrado'});
        }
        if (erro.code === '23514') {
            return res.status(400).json({ erro: 'Perfil inválido. Use: ADMIN, RECEPCAO, TECNICO ou BIOMEDICO'});
        }
        res.status(500).json({erro: 'Erro ao cadastrar usuário'});
    }
});

//Login
router.post('/login', async (req,res) => {
    const {login, senha} = req.body;

    if (!login || !senha) {
        return res.status(400).json ({erro: 'Login e senha são obrigatórios'});
    }

    try {
        const resultado = await pool.query('SELECT *FROM usuarios WHERE login = $1', [login]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Login ou senha inválidos'})
        }

        const usuario = resultado.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if(!senhaCorreta) {
            return res.status(401).json({erro: 'Login ou senha inválidos'});
        }

        const token = jwt.sign(
            {id: usuario.id, nome: usuario.nome, perfil: usuario.perfil},
            process.env.JWT_SECRET,
            { expiresIn: '8h'}
        );

        res.json({ token, usuario: {id:usuario.id, nome: usuario.nome, perfil: usuario.perfil} });
    }catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao fazer login'});
    }
});

module.exports = router;
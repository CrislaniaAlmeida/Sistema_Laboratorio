const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido'});
    }

    const token = authHeader.split(' ')[1]; // formato: "bearer <token>"

    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = dados; //disponibiliza id, nome, perfil nas proximas rotas
        next();
    } catch (erro) {
    console.error('Falha na verificação do token:', erro.message);
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}

module.exports = verificarToken;
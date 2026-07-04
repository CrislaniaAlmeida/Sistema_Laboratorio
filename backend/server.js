const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pacientesRouter = require('./routes/pacientes');
const examesRouter = require('./routes/exames');
const amostrasRouter = require('./routes/amostras');
const authRouter = require('./routes/auth');
const verificarToken = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({mensagem: 'API do Sistema de Rastreabilidade rodando!'});
});

app.use('/amostras', verificarToken, amostrasRouter);
app.use('/exames', verificarToken, examesRouter);
app.use('/pacientes', verificarToken, pacientesRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

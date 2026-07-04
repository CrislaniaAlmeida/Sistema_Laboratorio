import { useEffect, useState } from 'react';
import api from '../api/axios';

const SETORES = ['HEMATOLOGIA', 'BIOQUIMICA', 'MICROBIOLOGIA', 'IMUNOLOGIA', 'PARASITOLOGIA', 'UROANALISE'];

function Exames() {
    const [exames, setExames] = useState([]);
    const [erro, setErro] = useState('');

    const [nome, setNome] = useState('');
    const [setor, setSetor] = useState('');
    const [prazoMinutos, setPrazoMinutos] = useState('');

    function carregar() {
        api.get('/exames')
            .then((resposta) => setExames(resposta.data))
            .catch((err) => setErro(err.response?.data?.erro || 'Erro ao buscar exames'));
    }

    useEffect(() => {
        carregar();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        try {
            await api.post('/exames', {
                nome,
                setor,
                prazo_minutos: prazoMinutos ? Number(prazoMinutos) : null,
            });
            setNome('');
            setSetor('');
            setPrazoMinutos('');
            carregar();
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao cadastrar exame');
        }
    }

    return (
        <div>
            <h2>Exames</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: 30, maxWidth: 400 }}>
                <h3>Novo Exame</h3>
                <div style={{ marginBottom: 8 }}>
                    <label>Nome</label><br />
                    <input value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: '100%' }} required />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Setor</label><br />
                    <select value={setor} onChange={(e) => setSetor(e.target.value)} style={{ width: '100%' }} required>
                        <option value="">Selecione</option>
                        {SETORES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Prazo (minutos, SLA)</label><br />
                    <input
                        type="number"
                        value={prazoMinutos}
                        onChange={(e) => setPrazoMinutos(e.target.value)}
                        style={{ width: '100%' }}
                        placeholder="Deixe vazio se não tiver SLA"
                    />
                </div>
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
                <button type="submit">Cadastrar</button>
            </form>

            <h3>Lista de Exames</h3>
            <ul>
                {exames.map((e) => (
                    <li key={e.id}>{e.nome} — {e.setor} {e.prazo_minutos ? `(SLA: ${e.prazo_minutos} min)` : '(sem SLA)'}</li>
                ))}
            </ul>
        </div>
    );
}

export default Exames;
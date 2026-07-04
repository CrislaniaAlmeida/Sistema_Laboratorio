import { useEffect, useState } from 'react';
import api from '../api/axios';

const PROXIMO_STATUS = {
    CADASTRADO: 'COLETADO',
    COLETADO: 'RECEBIDO_NO_SETOR',
    RECEBIDO_NO_SETOR: 'EM_ANALISE',
    EM_ANALISE: 'CONCLUIDO',
    CONCLUIDO: 'LIBERADO',
};

function Amostras() {
    const [amostras, setAmostras] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [exames, setExames] = useState([]);
    const [erro, setErro] = useState('');

    const [pacienteId, setPacienteId] = useState('');
    const [exameId, setExameId] = useState('');

    function carregar() {
        api.get('/amostras')
            .then((resposta) => setAmostras(resposta.data))
            .catch((err) => setErro(err.response?.data?.erro || 'Erro ao buscar amostras'));
    }

    useEffect(() => {
        carregar();
        api.get('/pacientes').then((resposta) => setPacientes(resposta.data));
        api.get('/exames').then((resposta) => setExames(resposta.data));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        try {
            await api.post('/amostras', {
                paciente_id: Number(pacienteId),
                exame_id: Number(exameId),
            });
            setPacienteId('');
            setExameId('');
            carregar();
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao cadastrar amostra');
        }
    }

    async function avancarStatus(id, statusAtual) {
        const novoStatus = PROXIMO_STATUS[statusAtual];
        if (!novoStatus) return;

        try {
            await api.patch(`/amostras/${id}/status`, { novo_status: novoStatus });
            carregar();
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao avançar status');
        }
    }

    return (
        <div>
            <h2>Amostras</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: 30, maxWidth: 400 }}>
                <h3>Nova amostra</h3>
                <div style={{ marginBottom: 8 }}>
                    <label>Paciente</label><br />
                    <select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)} style={{ width: '100%' }} required>
                        <option value="">Selecione</option>
                        {pacientes.map((p) => (
                            <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Exame</label><br />
                    <select value={exameId} onChange={(e) => setExameId(e.target.value)} style={{ width: '100%' }} required>
                        <option value="">Selecione</option>
                        {exames.map((ex) => (
                            <option key={ex.id} value={ex.id}>{ex.nome}</option>
                        ))}
                    </select>
                </div>
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
                <button type="submit">Cadastrar</button>
            </form>

            <h3>Lista de amostras</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
                        <th>Código</th>
                        <th>Paciente</th>
                        <th>Exame</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {amostras.map((a) => (
                        <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{a.codigo}</td>
                            <td>{a.paciente_nome}</td>
                            <td>{a.exame_nome}</td>
                            <td>{a.status}</td>
                            <td>
                                {PROXIMO_STATUS[a.status] && (
                                    <button onClick={() => avancarStatus(a.id, a.status)}>
                                        Avançar para {PROXIMO_STATUS[a.status]}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Amostras;
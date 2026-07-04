import { useEffect, useState } from 'react';
import api from '../api/axios';

function Painel() {
    const [atrasadas, setAtrasadas] = useState([]);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);

    function carregar() {
        api.get('/amostras/atrasadas')
            .then((resposta) => {
                setAtrasadas(resposta.data);
                setErro('');
            })
            .catch((err) => setErro(err.response?.data?.erro || 'Erro ao buscar amostras atrasadas'))
            .finally(() => setCarregando(false));
    }

    useEffect(() => {
        carregar();
        const intervalo = setInterval(carregar, 30000); // atualiza a cada 30 segundos
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div>
            <h2>Painel de SLA</h2>
            <p style={{ fontSize: 13, opacity: 0.7 }}>Atualiza automaticamente a cada 30 segundos</p>

            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            {!carregando && atrasadas.length === 0 && !erro && (
                <p style={{ color: '#2ecc71', fontWeight: 'bold' }}>✅ Nenhuma amostra atrasada</p>
            )}

            {atrasadas.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #555' }}>
                            <th>Código</th>
                            <th>Paciente</th>
                            <th>Exame</th>
                            <th>Status</th>
                            <th>Prazo (SLA)</th>
                            <th>Atraso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atrasadas.map((a) => (
                            <tr key={a.id} style={{ background: '#5c2128', borderBottom: '1px solid #7a2a32' }}>
                                <td>{a.codigo}</td>
                                <td>{a.paciente_nome}</td>
                                <td>{a.exame_nome}</td>
                                <td>{a.status}</td>
                                <td>{a.prazo_minutos} min</td>
                                <td style={{ color: '#ff8a80', fontWeight: 'bold' }}>
                                    + {a.minutos_decorridos - a.prazo_minutos} min
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Painel;
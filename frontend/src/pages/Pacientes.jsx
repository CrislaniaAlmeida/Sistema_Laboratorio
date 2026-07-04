import { useEffect, useState } from 'react';
import api from '../api/axios';

function Pacientes() {
    const [pacientes, setPacientes] = useState([]);
    const [erro, setErro] = useState('');

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState('');
    const [telefone, setTelefone] = useState('');

    function carregar() {
        api.get('/pacientes')
            .then((resposta) => setPacientes(resposta.data))
            .catch((err) => setErro(err.response?.data?.erro || 'Erro ao buscar pacientes'));
    }

    useEffect(() => {
        carregar();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        try {
            await api.post('/pacientes', {
                nome,
                cpf,
                data_nascimento: dataNascimento || null,
                sexo,
                telefone,
            });
            setNome('');
            setCpf('');
            setDataNascimento('');
            setSexo('');
            setTelefone('');
            carregar();
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao cadastrar paciente');
        }
    }

    return (
        <div>
            <h2>Pacientes</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: 30, maxWidth: 400 }}>
                <h3>Novo paciente</h3>
                <div style={{ marginBottom: 8 }}>
                    <label>Nome</label><br />
                    <input value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: '100%' }} required />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>CPF</label><br />
                    <input value={cpf} onChange={(e) => setCpf(e.target.value)} style={{ width: '100%' }} required />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Data de nascimento</label><br />
                    <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Sexo</label><br />
                    <select value={sexo} onChange={(e) => setSexo(e.target.value)} style={{ width: '100%' }}>
                        <option value="">Selecione</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Outro">Outro</option>
                    </select>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Telefone</label><br />
                    <input value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ width: '100%' }} />
                </div>
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
                <button type="submit">Cadastrar</button>
            </form>

            <h3>Lista de pacientes</h3>
            <ul>
                {pacientes.map((p) => (
                    <li key={p.id}>{p.nome} — CPF: {p.cpf}</li>
                ))}
            </ul>
        </div>
    );
}

export default Pacientes;
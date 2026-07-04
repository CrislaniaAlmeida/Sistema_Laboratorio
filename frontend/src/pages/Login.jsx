import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Login() {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        try {
            const resposta = await api.post('/auth/login', { login, senha });
            localStorage.setItem('token', resposta.data.token);
            localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));
            navigate('/pacientes');
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao fazer login');
        }
    }

    return (
        <div style={{ maxWidth: 320, margin: '100px auto', fontFamily: 'sans-serif' }}>
            <h2>Sistema de Rastreabilidade</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <label>Login</label><br />
                    <input value={login} onChange={(e) => setLogin(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Senha</label><br />
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ width: '100%' }} />
                </div>
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
                <button type="submit" style={{ width: '100%' }}>Entrar</button>
            </form>
        </div>
    );
}

export default Login;
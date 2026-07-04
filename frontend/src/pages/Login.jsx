import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Login() {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const resposta = await api.post('/auth/login', { login, senha });
            localStorage.setItem('token', resposta.data.token);
            localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));
            navigate('/painel');
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao fazer login');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '48px 40px',
                width: '100%',
                maxWidth: 400,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Logo / Cabeçalho */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        fontSize: 48,
                        marginBottom: 12
                    }}>🔬</div>
                    <h2 style={{
                        color: '#1a365d',
                        fontSize: '1.5rem',
                        margin: 0,
                        border: 'none',
                        padding: 0
                    }}>
                        Sistema de Rastreabilidade
                    </h2>
                    <p style={{
                        color: '#718096',
                        fontSize: '0.85rem',
                        marginTop: 6
                    }}>
                        Controle de Amostras Laboratoriais
                    </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} style={{
                    boxShadow: 'none',
                    padding: 0,
                    margin: 0,
                    maxWidth: '100%'
                }}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ color: '#4a5568', fontWeight: 600, fontSize: '0.85rem' }}>
                            Login
                        </label>
                        <input
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Digite seu login"
                            required
                            style={{ marginTop: 6 }}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ color: '#4a5568', fontWeight: 600, fontSize: '0.85rem' }}>
                            Senha
                        </label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Digite sua senha"
                            required
                            style={{ marginTop: 6 }}
                        />
                    </div>

                    {erro && (
                        <div style={{
                            background: '#fff5f5',
                            border: '1px solid #fc8181',
                            borderRadius: 6,
                            padding: '10px 14px',
                            marginBottom: 16,
                            color: '#c53030',
                            fontSize: '0.85rem'
                        }}>
                            {erro}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={carregando}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: carregando ? '#90cdf4' : '#2b6cb0',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: carregando ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    color: '#a0aec0',
                    fontSize: '0.75rem',
                    marginTop: 32
                }}>
                    Acesso restrito a usuários autorizados
                </p>
            </div>
        </div>
    );
}

export default Login;
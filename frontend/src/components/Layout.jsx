import { Link, useNavigate, Outlet } from 'react-router-dom';

function Layout() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <nav style={{ width: 220, padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: 4 }}>🔬 Rastreabilidade</h3>
                {usuario && (
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: 24 }}>
                        {usuario.nome}<br />{usuario.perfil}
                    </p>
                )}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, background: 'transparent', boxShadow: 'none' }}>
                    <li style={{ border: 'none', padding: '4px 0' }}>
                        <Link to="/pacientes" style={{ color: '#fff', textDecoration: 'none', display: 'block', padding: '8px 12px', borderRadius: 6 }}>
                            👤 Pacientes
                        </Link>
                    </li>
                    <li style={{ border: 'none', padding: '4px 0' }}>
                        <Link to="/amostras" style={{ color: '#fff', textDecoration: 'none', display: 'block', padding: '8px 12px', borderRadius: 6 }}>
                            🧪 Amostras
                        </Link>
                    </li>
                    <li style={{ border: 'none', padding: '4px 0' }}>
                        <Link to="/exames" style={{ color: '#fff', textDecoration: 'none', display: 'block', padding: '8px 12px', borderRadius: 6 }}>
                            📋 Exames
                        </Link>
                    </li>
                    <li style={{ border: 'none', padding: '4px 0' }}>
                        <Link to="/painel" style={{ color: '#fff', textDecoration: 'none', display: 'block', padding: '8px 12px', borderRadius: 6 }}>
                            ⚠️ Painel de SLA
                        </Link>
                    </li>
                </ul>
                <div style={{ marginTop: 'auto' }}>
                    <button onClick={handleLogout}>Sair</button>
                </div>
            </nav>
            <main style={{ flex: 1, padding: 30, background: '#f0f4f8' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
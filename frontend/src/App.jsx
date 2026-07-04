import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Pacientes from './pages/Pacientes';
import Amostras from './pages/Amostras';
import Exames from './pages/Exames';
import Painel from './pages/Painel';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/amostras" element={<Amostras />} />
        <Route path="/exames" element={<Exames />} />
        <Route path="/painel" element={<Painel />} />
      </Route>
    </Routes>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

// Componente: bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação.
// Propriedade: informações que um componente PAI passa para o componente FILHO.
// Estado: informações mantidas pelo componente (lembrar: imutabilidade).

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const response = await api.post('/devs', data);
    
    if (response.data === -1)
      alert('Ops! Este usuário do Github já está cadastrado.');
    else
      setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => {
            return (
              <DevItem key={dev._id} dev={dev} />
          )})}
        </ul>
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import api from '../../services/api';

import './style.css';

function DevItem(props) {
    const { dev } = props;
    
    async function handleDeleteDev()
    {
        const { github_username } = dev;
        
        await api.delete('/devs', {
            params: {
                github_username,
            }
        });

        window.location.reload();
    };

    return (
        <li className="dev-item">
            <div className="remove-button">
                <button onClick={handleDeleteDev} type="button">
                    <figure>
                        <img src={ require("./assets/delete-icon.png") } alt="Remove user" />
                        <figcaption>Remover</figcaption>
                    </figure>
                </button>
            </div>

            <header>
                <img src={dev.avatar_url} alt={dev.name} className="src"/>
                <div className="user-info">
                    <strong>{dev.name}</strong>
                    <span>{dev.techs.join(', ')}</span>
                </div>
            </header>

            <p>{dev.bio}</p>
            
            <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no GitHub</a>
        </li>
    );
}

export default DevItem;
const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// Um controller tem geralmente no máximo cinco funções: index, show, store, update, destroy.

module.exports = {
    async index (request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },
    
    async store (request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
        
        let dev = await Dev.findOne({ github_username });

        if(dev) {
            return response.json(-1);
        }
        
        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

        //Se name for nulo, então name recebe login (o name não é obrigatório no GitHub, enquanto o login sim).
        const { name = login, avatar_url, bio} = apiResponse.data;
        
        const techsArray = parseStringAsArray(techs);
    
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };
    
        dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location,
        });

        // Filtrar as conexões que estão a no máximo 10 km de distância
        // e que o novo dev tenha pelo menos uma das tecnologias filtradas.

        const sendSocketMessageTo = findConnections(
            { latitude, longitude },
            techsArray,
        )

        sendMessage(sendSocketMessageTo, 'new-dev', dev);

        return response.json(dev);
    },

    async update ( request, response ) {
        const { github_username, techs, latitude, longitude } = request.query;

        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

        let dev;

        if(apiResponse) {
            const { name = login, avatar_url, bio} = apiResponse.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.findOneAndUpdate({ github_username }, 
                { name, avatar_url, bio, techs: techsArray, location });
        }

        return response.json(dev);
    },

    async destroy ( request, response ) {
        const { github_username } = request.query;

        await Dev.findOneAndDelete({ github_username });

        return response.json('Usuario removido.');
    }
}
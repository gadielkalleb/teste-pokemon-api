let express = require('express');
let router = express.Router();

let pokemon_controller = require('../controllers/pokemonController');

// HOME
router.get('/', pokemon_controller.index);

// TODOS OS POKEMONS
router.get('/get-pokemons', pokemon_controller.pokemon_list);

// DETALHES DO POKEMON
router.get('/get-pokemons/:id', pokemon_controller.pokemon_detail);

// FORMULARIO DE CADASTRO
router.get('/create-pokemons', pokemon_controller.pokemon_create_get);

// Cadastro Pokemon
router.post('/create-pokemons', pokemon_controller.create_pokemon_post);

// COMPRA DE POKEMON
router.get('/get-pokemons/:id/buy-pokemons', pokemon_controller.pokemon_buy)


module.exports = router;

var Pokemon = require('../models/pokemon');
var async = require('async');
var request = require('request');

const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

exports.index = function (req, res) {

    async.parallel({
        pokemon_count: function (callback) {
            Pokemon.count(callback);
        }
    }, function (err, results) {
        res.render('index', {
            title: 'Api de pokemons',
            message: 'Api de cadastro e compras de pokemon',
            error: err,
            data: results
        })
    })
};

// Display list of all Pokemons.
exports.pokemon_list = function (req, res, next) {
    Pokemon.find()
        .sort([
            ['name', 'ascending']
        ])
        .exec(function (err, list_pokemon) {
            if (err) next(err);

            res.render('pokemon_list', {
                title: 'Lista de Pokemons',
                pokemon_list: list_pokemon
            })
        })
};

// Display list of  Pokemons.
exports.pokemon_detail = function (req, res, next) {

    Pokemon.findById(req.params.id)
        .populate('pokemons')
        .exec(function (err, pokemon) {
            if (err) next(err);
            if (pokemon == null) {
                var err = new Error('Pokemon não encontrado');
                err.status = 404;
                return next(err);
            }
            res.render('pokemon_detail', {
                title: `Pokemon: ${pokemon.name}`,
                pokemon: pokemon
            });
        })

};

// Display pokemon create form on GET.
exports.pokemon_create_get = function (req, res, next) {
    res.render('pokemon_form', {
        title: 'Cadastre um pokemon'
    });
};

// Handle Pokemons create on POST.
exports.create_pokemon_post = [

    // Validate fields.
    body('name').isLength({
        min: 1
    }).
    trim()
    .withMessage('Informe o nome do pokemon.')
    .isAlphanumeric()
    .withMessage('Não pode ter numeros. erro:name'),

    body('tipo').isLength({
        min: 1
    })
    .trim()
    .withMessage('Informe o tipo de pokemon.')
    .isAlphanumeric()
    .withMessage('Não pode ter numeros. erro:tipo'),

    body('price').isLength({
        min: 1
    }).trim().withMessage('informe o preço').isNumeric(),
    body('stock').isLength({
        min: 1
    }).trim().withMessage('informe a quantidade').isNumeric(),

    // body('descricao').isLength({min: 1})
    //     .trim()
    //     .withMessage('Informe o tipo de pokemon.')
    //     .isAlphanumeric()
    //     .withMessage('Não pode ter numeros. erro: descricao'),


    // Sanitize fields.
    sanitizeBody('name').trim().escape(),
    sanitizeBody('tipe').trim().escape(),
    sanitizeBody('price').trim().escape(),
    sanitizeBody('stock').trim().escape(),
    sanitizeBody('descricao').trim().escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('pokemon_form', {
                title: 'Create Pokemon',
                pokemon: req.body,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var pokemon = new Pokemon({
                name: req.body.name,
                tipo: req.body.tipo,
                price: req.body.price,
                stock: req.body.stock,
                descricao: req.body.descricao
            });
            pokemon.save(function (err) {
                if (err) {
                    return next(err);
                }
                // Successful.
                res.redirect(pokemon.url);
            });
        }
    }
];

// Compra de Pokemon.
exports.pokemon_buy = function (req, res, next) {

    res.send('Ainda Não foi implementado');
    // async.parallel({
    //     pokemon: function(callback){
    //         Pokemon.findById(req.body.pokemonid).exec(callback)
    //     }
    // }, function(err, results){
    //     if (err) next(err);

    //     if (results.stock < req.body.stock) {
    //         return res.status(400).send({
    //             error: ''
    //         })
    //     }
    // })

};
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PokemonSchema = new Schema({
    name:{type:String, required: true, max: 100},
    tipo:{type: String, max:100},
    price:{type: Number, required: true},
    stock:{type:Number, default:1},
    descricao:{type: String, max: 200}
});

PokemonSchema.virtual('url').get(function(){
    return '/catalog/get-pokemons/'+this._id;
})

module.exports = mongoose.model('Pokemon', PokemonSchema);
const presencaModel = require("../models/presencaModel")
const usuarioModel = require("../models/usuarioModel")
const checkIn = async (req, res) =>{
    const { usuarioId } = req.body;
    const dataAtual = new Date();

    const existeUser = usuarioModel.existeUser( usuarioId );

    if (!existeUser){
        return res.status(400).json({ message: "Usuário não encontrado"})
    }

    

    try {
        
    } catch (error) {
        
    }
}

module.exports = {checkIn}
const presencaModel = require("../models/presencaModel")
const usuarioModel = require("../models/usuarioModel")

const checkIn = async (req, res) =>{
    const { usuarioId } = req.body;
    const dataAtual = new Date();

    try {
        const buscarUser = usuarioModel.buscarUser( usuarioId );
    
        if (!existeUser){
            return res.status(400).json({ message: "Usuário não encontrado"})
        }
        
        const presenca = presencaModel.registrarPresenca(existeUser.id)
    } catch (error) {
        
    }
}

module.exports = {checkIn}
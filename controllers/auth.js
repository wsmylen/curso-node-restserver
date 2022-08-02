const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo});

        // Verificar si el correo existe
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            });
        }

        // Verficar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado: false'
            });
        }

        // Virificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Hable con el administrador"
        })
    }
}

const googleSignIn = async (req, res = response) => {
    const {id_token} = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            // Tengo que crearlo
            const data =  {nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'}

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
                usuario,
                token
            });

    } catch(error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}
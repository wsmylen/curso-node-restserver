const { Usuario, Categoria, Producto } = require('../models');
const Role = require('../models/role');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
};

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
}

const existeUsuarioPorId = async(id = '') => {
    const existeId = await Usuario.findById(id);
    if (!existeId) {
        throw new Error(`El id: ${id}, no existe`);
    }
}

const existeCategoriaPorId = async(id = '') => {
    const existeId = await Categoria.findById(id);
    if (!existeId) {
        throw new Error(`La categoria por id: ${id}, no existe`);
    }
}

const existeProductoPorId = async(id = '') => {
    const existeId = await Producto.findById(id);
    if (!existeId) {
        throw new Error(`El producto por id: ${id}, no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}
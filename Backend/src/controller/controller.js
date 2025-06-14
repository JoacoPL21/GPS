import express from 'express';
import { AppDataSource } from '../config/configDB.js';
import Usuarios from '../entity/usuario.entity.js';

async function getAllUser(req, res) {
  try {
    const UserRepository = AppDataSource.getRepository(Usuarios);
    const users = await UserRepository.find();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error al obtener users:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}

export { getAllUser };
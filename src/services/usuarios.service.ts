import type { CreateUsuarioDto, UpdateUsuarioDto, Usuario } from "../types";
import {axiosClient} from '../api/api';


export async function getUsuarios(): Promise<Usuario[]>{
    const response = await axiosClient.get<Usuario[]>("/usuario");
    // GET http://localhost:3000/usuario
    return response.data;
}

export async function getUsuario(id: number): Promise<Usuario>{
    const response = await axiosClient.get<Usuario>("/usuario/" + id);
    // GET http://localhost:3000/usuario/id
    return response.data;
}

export async function createUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>{
    const response = await axiosClient.post<Usuario>("/usuario", createUsuarioDto);
    // POST http://localhost:3000/usuario
    return response.data;
}

export async function updateUsuario(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario>{
    const response = await axiosClient.patch<Usuario>("/usuario/" + id, updateUsuarioDto);
    // PATCH http://localhost:3000/usuario/id
    return response.data;
}

export async function deleteUsuario(id: number): Promise<void>{
    await axiosClient.delete("/usuario/" + id);
    // DELETE http://localhost:3000/usuario/id
}


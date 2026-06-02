import type { CreateRolDto, UpdateRolDto, Rol } from "../types";
import { axiosClient } from '../api/api';

export async function getRoles(): Promise<Rol[]> {
    const response = await axiosClient.get<Rol[]>("/rol");
    return response.data;
}

export async function getRol(id: number): Promise<Rol> {
    const response = await axiosClient.get<Rol>("/rol/" + id);
    return response.data;
}

export async function createRol(createRolDto: CreateRolDto): Promise<Rol> {
    const response = await axiosClient.post<Rol>("/rol", createRolDto);
    return response.data;
}

export async function updateRol(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    const response = await axiosClient.patch<Rol>("/rol/" + id, updateRolDto);
    return response.data;
}

export async function deleteRol(id: number): Promise<void> {
    await axiosClient.delete("/rol/" + id);
}

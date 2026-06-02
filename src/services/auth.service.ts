import type { AuthResponse, LoginDto } from "../types";
import {axiosClient} from '../api/api';

export async function login(loginDto: LoginDto): Promise<AuthResponse>{
    const response = await axiosClient.post<AuthResponse>("/auth/login", loginDto);
    // POST http://localhost:3000/auth/login
    return response.data;
}
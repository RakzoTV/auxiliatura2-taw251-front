export type NombreRol = 'admin' | 'cliente';

export interface Rol {
  idRol: number;
  nombre: NombreRol;
  asignadoEn: string;
  actualizadoEn: string;
}

export interface Usuario {
  idUsuario: number;
  username: string;
  email: string;
  idRol: number;
  rol?: Rol;
  eliminadoEn?: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  idRol: number;
}

export interface CreateUsuarioDto {
  username: string;
  email: string;
  password: string;
  idRol: number;
}

export interface UpdateUsuarioDto {
  username?: string;
  email?: string;
  password?: string;
  idRol?: number;
}

export interface CreateRolDto {
  nombre: NombreRol;
}

export interface UpdateRolDto {
  nombre?: NombreRol;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

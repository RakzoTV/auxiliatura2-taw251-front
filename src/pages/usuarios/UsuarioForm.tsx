import { useEffect, useState, type FormEvent } from 'react';
import type { Usuario, Rol, CreateUsuarioDto, UpdateUsuarioDto } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface Props {
  inicial: Usuario | null;
  roles: Rol[];
  saving: boolean;
  onSave: (data: CreateUsuarioDto | UpdateUsuarioDto) => Promise<void>;
  onCancel: () => void;
}

export default function UsuarioForm({ inicial, roles, saving, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    username: inicial?.username ?? '',
    email: inicial?.email ?? '',
    password: '',
    idRol: inicial?.idRol ?? (roles[0]?.idRol ?? 0),
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!inicial && roles.length > 0) {
      setForm((f) => ({ ...f, idRol: roles[0].idRol }))
    }
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');

    const payload: CreateUsuarioDto | UpdateUsuarioDto = inicial
      ? {
        ...(form.username !== inicial.username && { username: form.username }),
        ...(form.email !== inicial.email && { email: form.email }),
        ...(form.password && { password: form.password }),
        ...(form.idRol !== inicial.idRol && { idRol: Number(form.idRol) }),
      }
      : { ...form, idRol: Number(form.idRol) };

    try {
      await onSave(payload);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al guardar.');
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre de usuario"
        value={form.username}
        onChange={(e) => set('username', e.target.value)}
        required={!inicial}
        maxLength={16}
        placeholder="max 16 caracteres"
      />
      <Input
        label="Correo electrónico"
        type="email"
        value={form.email}
        onChange={(e) => set('email', e.target.value)}
        required={!inicial}
        placeholder="correo@ejemplo.com"
      />
      <Input
        label={inicial ? 'Nueva contraseña (opcional)' : 'Contraseña'}
        type="password"
        value={form.password}
        onChange={(e) => set('password', e.target.value)}
        required={!inicial}
        placeholder="••••••••"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Rol</label>
        <select
          value={form.idRol}
          onChange={(e) => set('idRol', Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          {roles.map((r) => (
            <option key={r.idRol} value={r.idRol}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      {formError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {inicial ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  );
}

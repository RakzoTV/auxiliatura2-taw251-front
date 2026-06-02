import { useState, type FormEvent } from 'react';
import type { Rol, CreateRolDto, UpdateRolDto, NombreRol } from '../../types';
import Button from '../../components/ui/Button';

interface Props {
  inicial: Rol | null;
  saving: boolean;
  onSave: (data: CreateRolDto | UpdateRolDto) => Promise<void>;
  onCancel: () => void;
}

const opcionesRol: NombreRol[] = ['admin', 'cliente'];

export default function RolForm({ inicial, saving, onSave, onCancel }: Props) {
  const [nombre, setNombre] = useState<NombreRol>(inicial?.nombre ?? 'cliente');
  const [formError, setFormError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    try {
      await onSave({ nombre });
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al guardar.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Nombre del rol</label>
        <select
          value={nombre}
          onChange={(e) => setNombre(e.target.value as NombreRol)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          {opcionesRol.map((op) => (
            <option key={op} value={op}>
              {op}
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
          {inicial ? 'Guardar cambios' : 'Crear rol'}
        </Button>
      </div>
    </form>
  );
}

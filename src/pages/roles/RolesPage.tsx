import { useEffect, useState } from 'react';
import type { Rol, CreateRolDto, UpdateRolDto } from '../../types';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import RolForm from './RolForm';
import { getRoles } from '../../services/rol.service';

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Rol | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Rol | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    cargarDatos()
  },
    []);

  async function cargarDatos() {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(rol: Rol) {
    setEditTarget(rol);
    setModalOpen(true);
  }

  async function handleSave(_data: CreateRolDto | UpdateRolDto) {
    // TODO: llamar al servicio correspondiente
    setModalOpen(false);
  }

  async function handleDelete() {
    // TODO: llamar al servicio de eliminar
    setDeleteTarget(null);
  }

  const columns = [
    { key: 'idRol', header: '#' },
    {
      key: 'nombre',
      header: 'Nombre',
      render: (r: Rol) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.nombre === 'admin'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-green-100 text-green-700'
          }`}>
          {r.nombre}
        </span>
      ),
    },
    {
      key: 'asignadoEn',
      header: 'Creado',
      render: (r: Rol) => new Date(r.asignadoEn).toLocaleDateString('es-PE'),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (r: Rol) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
          <Button variant="danger" onClick={() => setDeleteTarget(r)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de roles del sistema</p>
        </div>
        <Button onClick={openCreate}>+ Nuevo rol</Button>
      </div>

      <Table
        columns={columns}
        data={roles}
        rowKey={(r) => r.idRol}
        loading={loading}
        emptyText="No hay roles registrados"
      />

      <Modal
        open={modalOpen}
        title={editTarget ? 'Editar rol' : 'Nuevo rol'}
        onClose={() => setModalOpen(false)}
      >
        <RolForm
          inicial={editTarget}
          saving={saving}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={!!deleteTarget}
        title="Confirmar eliminación"
        onClose={() => setDeleteTarget(null)}
      >
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de eliminar el rol{' '}
          <span className="font-semibold">{deleteTarget?.nombre}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}

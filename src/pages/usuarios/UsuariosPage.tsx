import { useEffect, useState } from 'react';
import type { Usuario, Rol, CreateUsuarioDto, UpdateUsuarioDto } from '../../types';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import UsuarioForm from './UsuarioForm';
import { createUsuario, deleteUsuario, getUsuarios, updateUsuario } from '../../services/usuarios.service';
import { getRoles } from '../../services/rol.service';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Usuario | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Usuario | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [usuariosData, rolesData] = await Promise.all([
        getUsuarios(),
        getRoles(),
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
    }
    finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(usuario: Usuario) {
    setEditTarget(usuario);
    setModalOpen(true);
  }

  async function handleSave(data: CreateUsuarioDto | UpdateUsuarioDto) {
    setSaving(true);
    try {
      if (editTarget) {
        await updateUsuario(editTarget.idUsuario, data as UpdateUsuarioDto);
      } else {
        await createUsuario(data as CreateUsuarioDto);
      }
      setModalOpen(false);
      await cargarDatos();
    }
    finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if(!deleteTarget) return;
    setDeleting(true);
    try{
      await deleteUsuario(deleteTarget.idUsuario);
      setDeleteTarget(null);
      await cargarDatos();
    }
    finally{
      setDeleting(false);
    }
  }

  const columns = [
    { key: 'idUsuario', header: '#' },
    { key: 'username', header: 'Usuario' },
    { key: 'email', header: 'Correo' },
    {
      key: 'rol',
      header: 'Rol',
      render: (u: Usuario) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.rol?.nombre === 'admin'
          ? 'bg-purple-100 text-purple-700'
          : 'bg-green-100 text-green-700'
          }`}>
          {u.rol?.nombre ?? '-'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (u: Usuario) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => openEdit(u)}>Editar</Button>
          <Button variant="danger" onClick={() => setDeleteTarget(u)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de usuarios del sistema</p>
        </div>
        <Button onClick={openCreate} disabled={loading}>
          + Nuevo usuario
        </Button>
      </div>

      <Table
        columns={columns}
        data={usuarios}
        rowKey={(u) => u.idUsuario}
        loading={loading}
        emptyText="No hay usuarios registrados"
      />

      <Modal
        open={modalOpen}
        title={editTarget ? 'Editar usuario' : 'Nuevo usuario'}
        onClose={() => setModalOpen(false)}
      >
        <UsuarioForm
          inicial={editTarget}
          roles={roles}
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
          ¿Estás seguro de eliminar a{' '}
          <span className="font-semibold">{deleteTarget?.username}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}

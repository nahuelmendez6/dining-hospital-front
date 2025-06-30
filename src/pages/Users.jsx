import React, { useState } from 'react';
import Layout from "../components/Layout";
import UsersTable from "../components/users/UsersTable";
import UserFormModal from "../components/users/UserFormModal";
import UserStatsCards from "../components/users/UserStatsCards";
import UserFilterBar from "../components/users/UserFilterBar";
import UserToast from "../components/users/UserToast";

import { deleteUser } from '../services/userService';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../contexts/AuthContext';

const Users = () => {
  const { accessToken } = useAuth();
  const { users, loading, saveUser, setUsers } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('');

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`¿Eliminar a ${user.first_name} ${user.last_name}?`)) return;
    try {
      await deleteUser(user.id, accessToken);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setToast({ show: true, message: 'Usuario eliminado', type: 'success' });
    } catch (err) {
      setToast({ show: true, message: 'Error al eliminar', type: 'danger' });
    }
  };

  const handleSubmit = async (userData) => {
    const isEditing = !!currentUser;
    try {
      await saveUser(userData, isEditing, currentUser?.id);
      closeModal();
      setToast({
        show: true,
        message: isEditing ? 'Usuario actualizado' : 'Usuario creado',
        type: 'success'
      });
    } catch (err) {
      setToast({ show: true, message: 'Error al guardar', type: 'danger' });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  return (
    <Layout>
      <div className="container-fluid py-4 px-3 bg-light min-vh-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2><i className="bi bi-person-gear me-2" />Gestión de Usuarios</h2>
          <button className="btn btn-primary" onClick={handleCreateClick}>
            <i className="bi bi-plus-circle me-1" />Nuevo Usuario
          </button>
        </div>

        <UserStatsCards />

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <UserFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              groupFilter={groupFilter}
              setGroupFilter={setGroupFilter}
            />
            <UsersTable
              users={users}
              loading={loading}
              searchTerm={searchTerm}
              groupFilter={groupFilter}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <UserFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={currentUser}
        />

        <UserToast toast={toast} setToast={setToast} />
      </div>
    </Layout>
  );
};

export default Users;

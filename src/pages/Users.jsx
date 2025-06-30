import React, { useState } from 'react';
import Layout from "../components/Layout";
import UsersTable from "../components/users/UsersTable";
import UserFormModal from '../components/users/UserFormModal'; // Usamos el modal unificado
import UserStatsCards from '../components/users/UserStatsCards';
import { deleteUser } from '../services/userService';

import { useUsers } from '../hooks/useUsers';

import { useAuth } from '../contexts/AuthContext';


const Users = () => {

  const { accessToken } = useAuth();


  const { users, loading, saveUser, setUsers } = useUsers(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  // `currentUser` será null para crear, o un objeto de usuario para editar
  const [currentUser, setCurrentUser] = useState(null);

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setCurrentUser(null); // Aseguramos que no hay datos iniciales
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    const confirm = window.confirm(`¿Seguro que deseas eliminar a ${user.first_name} ${user.last_name}?`);
    if (!confirm) return;

    try {
      await deleteUser(user.id, accessToken);
      setUsers((prev) => prev.filter(u => u.id !== user.id));
    } catch (error) {
      console.error("Error al eliminar usuario", error);
      alert("No se pudo eliminar el usuario.");
    }
  }

  const handleSubmit = async (userData) => {
    // `isEditing` se determina por la presencia de `currentUser`
    const isEditing = !!currentUser;
    await saveUser(userData, isEditing, currentUser?.id);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null); // Limpiamos el usuario seleccionado al cerrar
  };

  return (
    <Layout>
      
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2><i className="bi bi-person-gear me-2"></i>Gestión de Usuarios</h2>
          <button className="btn btn-primary btn-lg" onClick={handleCreateClick}>
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Usuario
          </button>
        </div>
        <UserStatsCards />
        <div className="card">
          <div className="card-body">
            <UsersTable 
              users={users} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDelete}/>
          </div>
        </div>

        {/* Renderizamos el modal solo cuando es necesario */}
        <UserFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          // Pasamos los datos del usuario a editar, o null si es para crear
          initialData={currentUser}
        />
      </div>

    </Layout>
  )

}

export default Users;

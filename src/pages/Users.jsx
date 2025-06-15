import React, { useState } from 'react';
import Layout from "../components/Layout";
import UsersTable from "../components/users/UsersTable";
import UserCreateModal from '../components/users/UserCreateModal';
import UserFormModal from '../components/users/UserFormModal';
import UserStatsCards from '../components/users/UserStatsCards';

import { useUsers } from '../hooks/useUsers';

const Users = () => {

  const { users, departments, loading, saveUser} = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', dni: '', group: ''
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleEditClick = (user) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      dni: user.dni,
      group: user.group || '',
    });
    setSelectedUser(user);
    setEditing(true);
    setIsModalOpen(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveUser(formData, editing, selectedUser?.id);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ first_name: '', last_name: '', email: '', dni: '', group: '' });
    setEditing(false);
    setSelectedUser(null);
    setIsModalOpen(false);
    setShowCreateModal(false);
  }

  return (
    <Layout>
      <UserStatsCards />
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2><i className="bi bi-person-gear me-2"></i>Gestión de Usuarios</h2>
          <button className="btn btn-primary btn-lg" onClick={() => setShowCreateModal(true)}>Nuevo Usuario</button>
        </div>

        <div className="card">
          <div className="card-body">
            <UsersTable users={users} loading={loading} onEdit={handleEditClick} />
          </div>
        </div>

        


        <UserFormModal
          isOpen={isModalOpen}
          closeModal={resetForm}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleInputChange}
          departments={departments}
          editing={editing}
        />

        <UserCreateModal
          isOpen={showCreateModal}
          onClose={resetForm}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          formData={formData}
        />
      </div>

    </Layout>
  )

}

export default Users;

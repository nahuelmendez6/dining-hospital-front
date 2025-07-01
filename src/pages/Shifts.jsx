import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { BiTime } from 'react-icons/bi';
import ShiftForm from '../components/shifts/ShiftForm';
import ShiftsTable from '../components/shifts/ShiftsTable';
import ConfirmDeleteModal from '../components/shifts/ConfirmDeleteModal';
import useShifts from '../hooks/useShift';

const ShiftsPage = () => {
  const { accessToken: token } = useAuth();
  const { shifts, loading, error, saveShift, removeShift } = useShifts(token);

  const [editingShift, setEditingShift] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, loading: false });

  const handleSubmit = async (formData) => {
    const success = await saveShift(editingShift?.id, formData);
    if (success) setEditingShift(null);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal((d) => ({ ...d, loading: true }));
    const success = await removeShift(deleteModal.id);
    if (success) setDeleteModal({ show: false, id: null, loading: false });
    else setDeleteModal((d) => ({ ...d, loading: false }));
  };

  return (
    <Layout>
      <div className="container-fluid p-4">
        <h2 className="mb-4 d-flex align-items-center gap-2">
          <BiTime size={28} />
          Gestión de Turnos
        </h2>

        <ShiftForm
          onSubmit={handleSubmit}
          onCancel={() => setEditingShift(null)}
          initialData={editingShift}
          loading={loading}
        />

        <ShiftsTable
          shifts={shifts}
          loading={loading}
          error={error}
          onEdit={setEditingShift}
          onDelete={(id) => setDeleteModal({ show: true, id, loading: false })}
        />

        <ConfirmDeleteModal
          show={deleteModal.show}
          onHide={() => setDeleteModal({ show: false, id: null, loading: false })}
          onConfirm={handleDelete}
          loading={deleteModal.loading}
        />
      </div>
    </Layout>
  );
};

export default ShiftsPage;

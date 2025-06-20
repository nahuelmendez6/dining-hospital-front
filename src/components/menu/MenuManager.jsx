import { useEffect, useState } from "react";
import axios from "axios";

import MenuItemForm from "./MenuItemForm";
import MenuList from "./MenuList";
import ItemAssignSelect from "./ItemAssignSelect";

import { useAuth } from "../../contexts/AuthContext";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Accordion from "react-bootstrap/Accordion";

const API_URL = "http://localhost:8000/";

function MenuManager() {
  const [items, setItems] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const { accessToken: token } = useAuth();

  const activeShifts = shifts.filter((s) => s.menu_active);

  useEffect(() => {
    fetchItems();
    fetchShifts();
  }, []);

  useEffect(() => {
    if (activeShifts.length > 0 && !selectedShiftId) {
      setSelectedShiftId(activeShifts[0].id);
    }
  }, [activeShifts]);

  const fetchItems = async () => {
    const res = await axios.get(`${API_URL}core/menu-items/`);
    setItems(res.data);
  };

  const fetchShifts = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = await axios.get(`${API_URL}core/shifts/`, { headers });
      setShifts(res.data);
    } catch (error) {
      console.error("Error al obtener los turnos:", error.response || error);
    }
  };

  const handleItemCreated = async () => {
    setEditingItem(null);
    await fetchItems();
  };

  const updateShiftMenuItems = async (shiftId, itemIds) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      await axios.patch(`${API_URL}core/shifts/${shiftId}/edit/`, {
        menu_items: itemIds,
      }, { headers });
      await fetchShifts();
      alert("Menú asignado correctamente");
    } catch (error) {
      console.error("Error asignando ítems al turno:", error.response || error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}core/menu-items/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ítem eliminado correctamente");
      fetchItems();
    } catch (error) {
      toast.error("Error al eliminar el ítem");
      console.error(error);
    }
  };

  const toggleMenuActive = async (shiftId, currentValue) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await axios.patch(
        `${API_URL}core/shifts/${shiftId}/edit/`,
        { menu_active: !currentValue },
        { headers }
      );
      await fetchShifts();
    } catch (error) {
      console.error("Error toggling menu:", error.response || error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Menú</h2>

      <Tabs defaultActiveKey="items" className="mb-4">
        {/* TAB 1: Gestión de Ítems */}
        <Tab eventKey="items" title="Gestión de Ítems">
         
         <MenuItemForm
            initialItem={editingItem}
            onSubmit={handleItemCreated}
            onCancel={() => setEditingItem(null)}
            />
          <hr />
          <MenuList
            items={items}
            onEdit={setEditingItem}
            onDelete={handleDelete}
          />
        </Tab>

        {/* TAB 2: Asignación por Turno */}
        <Tab eventKey="turnos" title="Asignar Ítems a Turnos">
          <Accordion defaultActiveKey="0" className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Turnos con menú habilitado</Accordion.Header>
              <Accordion.Body>
                {shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                  >
                    <span>{shift.name}</span>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={shift.menu_active}
                        onChange={() =>
                          toggleMenuActive(shift.id, shift.menu_active)
                        }
                      />
                    </div>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {activeShifts.length > 0 ? (
            <Tabs
              activeKey={selectedShiftId}
              onSelect={(k) => setSelectedShiftId(parseInt(k))}
              className="mb-3"
            >
              {activeShifts.map((shift) => (
                <Tab key={shift.id} eventKey={shift.id} title={shift.name}>
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <h5>Ítems asignados</h5>
                      <MenuList
                        items={items.filter((item) => (shift.menu_items || []).includes(item.id))}
                        onEdit={setEditingItem}
                        onRemove={(itemIdToRemove) => {
                          const updated = (shift.menu_items || []).filter(id => id !== itemIdToRemove);
                          updateShiftMenuItems(shift.id, updated);
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <h5>Asignar ítems disponibles</h5>
                      <ItemAssignSelect
                        shift={shift}
                        items={items}
                        onAssign={updateShiftMenuItems}
                      />
                    </div>
                  </div>
                </Tab>
              ))}
            </Tabs>
          ) : (
            <p>No hay turnos con menú habilitado.</p>
          )}
        </Tab>
      </Tabs>
    </div>
  );
}

export default MenuManager;

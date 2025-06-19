import { useEffect, useState } from "react";
import axios from "axios";
import MenuItemForm from "./MenuItemForm";
import MenuList from "./MenuList";
import { useAuth } from "../contexts/AuthContext";
import Accordion from "react-bootstrap/Accordion";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

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
    await fetchItems();
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

  const updateShiftMenuItems = async (shiftId, itemIds) => {
    const token = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      await axios.patch(`${API_URL}core/shifts/${shiftId}/edit/`, {
        menu_items: itemIds,
      }, { headers });
      alert("Menú asignado correctamente");
    } catch (error) {
      console.error("Error asignando ítems al turno:", error.response || error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Menú</h2>

      {/* Accordion de Bootstrap para Turnos */}
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

      {/* Tabs de Bootstrap */}
      {activeShifts.length > 0 ? (
        <Tabs
          activeKey={selectedShiftId}
          onSelect={(k) => setSelectedShiftId(parseInt(k))}
          className="mb-3"
        >
          {activeShifts.map((shift) => (
            <Tab
              key={shift.id}
              eventKey={shift.id}
              title={shift.name}
            >
              <MenuItemForm
                shiftId={shift.id}
                onSubmit={handleItemCreated}
                onCancel={() => setEditingItem(null)}
              />
              <MenuList
                 items={items.filter((item) => (shift.menu_items || []).includes(item.id))}
                 onEdit={setEditingItem}
              />
              <div className="mt-3">
                <label className="mb-1 d-block fw-semibold">Asignar ítems a este turno</label>
                <select
                  multiple
                  className="form-select"
                  value={shift.menu_items || []}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, o => parseInt(o.value));
                    updateShiftMenuItems(shift.id, selected);
                  }}
                >
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

            </Tab>
          ))}
        </Tabs>
      ) : (
        <p>No hay turnos con menú habilitado.</p>
      )}
    </div>
  );
}

export default MenuManager;

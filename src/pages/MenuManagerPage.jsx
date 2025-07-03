import { useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";

import MenuItemForm from "../components/menu/MenuItemForm";
import MenuList from "../components/menu/MenuList";
import ItemAssignSelect from "../components/menu/ItemAssignSelect";
import IngredientForm from "../components/menu/IngredientForm";

import { useAuth } from "../contexts/AuthContext";
import { useMenuItems } from "../hooks/useMenuItems";
import useShifts from "../hooks/useShift.js";

import MenuItemModal from "../components/menu/MenuItemModal";
import IngredientModal from "../components/menu/IngredientModal";

function MenuManagerPage() {
  const [editingItem, setEditingItem] = useState(null);
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const { accessToken: token } = useAuth();

  const { items, fetchItems, removeItem } = useMenuItems(token);
  const { shifts, updateItems, toggleActive } = useShifts(token);

  const activeShifts = shifts.filter((s) => s.menu_active);

  const [showItemModal, setShowItemModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);


  useEffect(() => {
    if (activeShifts.length > 0 && !selectedShiftId) {
      setSelectedShiftId(activeShifts[0].id);
    }
  }, [activeShifts]);

  const handleItemCreated = async () => {
    setEditingItem(null);
    await fetchItems();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Menú</h2>

      <Tabs defaultActiveKey="items" className="mb-4">
        {/* TAB 1: Ítems */}
        <Tab eventKey="items" title="Gestión de Ítems">
        <Button variant="success" onClick={() => setShowItemModal(true)}>Nuevo Ítem</Button>
        <Button variant="success" onClick={() => setShowIngredientModal(true)}>Nuevo Ingrediente</Button>

          {/* <MenuItemForm
            initialItem={editingItem}
            onSubmit={handleItemCreated}
            onCancel={() => setEditingItem(null)}
          /> */}
          <hr />
          <MenuList
            items={items}
            onEdit={(item) => {
              setEditingItem(item);
              setShowItemModal(true);
            }}
            onDelete={removeItem}
          />
        </Tab>

        {/* TAB 2: Turnos */}
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
                        onChange={() => toggleActive(shift.id, shift.menu_active)}
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
                        items={items.filter((item) =>
                          (shift.menu_items || []).includes(item.id)
                        )}
                        onEdit={setEditingItem}
                        onRemove={(itemIdToRemove) => {
                          const updated = (shift.menu_items || []).filter(
                            (id) => id !== itemIdToRemove
                          );
                          updateItems(shift.id, updated);
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <h5>Asignar ítems disponibles</h5>
                      <ItemAssignSelect
                        shift={shift}
                        items={items}
                        onAssign={updateItems}
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

        {/* TAB 3: Ingredientes */}
        <Tab eventKey="ingredientes" title="Gestión de Ingredientes">
          <IngredientForm token={token} />
        </Tab>
      </Tabs>

      <MenuItemModal
          show={showItemModal}
          onHide={() => setShowItemModal(false)}
          initialItem={editingItem}
          onSubmit={handleItemCreated}
        />

        <IngredientModal
          show={showIngredientModal}
          onHide={() => setShowIngredientModal(false)}
          token={token}
        />

    </div>
  );
}

export default MenuManagerPage;

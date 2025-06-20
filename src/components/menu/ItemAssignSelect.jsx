import React from "react";
import Select from "react-select";

function ItemAssignSelect({ shift, items, onAssign }) {
    const options = items.map(item => ({
      value: item.id,
      label: item.name
    }));
  
    const selectedOptions = options.filter(opt =>
      (shift.menu_items || []).includes(opt.value)
    );
  
    const handleChange = (selected) => {
      const selectedIds = selected.map(opt => opt.value);
      onAssign(shift.id, selectedIds);
    };

return (
    <div className="mt-4">
      <label className="mb-2 fw-semibold d-block">Asignar ítems a {shift.name}</label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Buscar y seleccionar ítems..."
      />
    </div>
  );

}

export default ItemAssignSelect;
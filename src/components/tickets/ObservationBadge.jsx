import React from "react";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";

const iconLibraries = { Fa: FaIcons, Gi: GiIcons, Md: MdIcons };

function getIconComponent(iconName) {
  if (!iconName || iconName.length < 2) return null;
  const prefix = iconName.slice(0, 2);
  const lib = iconLibraries[prefix];
  return lib ? lib[iconName] : null;
}

const ObservationBadge = ({ icon, name }) => {
  const IconComponent = getIconComponent(icon);
  return (
    <span className="badge rounded-pill bg-info-subtle text-info-emphasis d-flex align-items-center gap-2 px-3 py-2">
      {IconComponent ? <IconComponent /> : <i className="bi bi-exclamation-triangle"></i>}
      {name}
    </span>
  );
};

export default ObservationBadge;

import PinForm from './PinForm';
import MenuForm from './MenuForm';
import { generateTicket } from '../services/ticketService';
import { useNavigate } from 'react-router-dom';

const TicketForm = ({ shiftData }) => {
  const navigate = useNavigate();

  const handleTicketSubmit = async (pin, selectedItems = []) => {
    const result = await generateTicket(pin, selectedItems);
    navigate('/tickets', { state: result });
  };

  if (shiftData.type === 'pin_only') {
    return <PinForm onSubmit={(pin) => handleTicketSubmit(pin)} />;
  }

  if (shiftData.type === 'select_menu') {
    return (
      <MenuForm
        onSubmit={(pin, items) => handleTicketSubmit(pin, items)}
        menuItems={shiftData.menu_items}
      />
    );
  }

  return null;
};

export default TicketForm;
const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'aprobado':
        return 'bg-success';
      case 'rechazado':
        return 'bg-danger';
      case 'cancelado':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bi-hourglass-split';
      case 'aprobado': return 'bi-check-circle-fill';
      case 'rechazado': return 'bi-x-circle-fill';
      case 'cancelado': return 'bi-slash-circle-fill';
      default: return 'bi-question-circle-fill';
    }
  };
  
  const TicketRow = ({ ticket }) => {
    return (
      <tr>
        <td>{ticket.id}</td>
        <td>{ticket.user}</td>
        <td>{new Date(ticket.date).toLocaleDateString()}</td>
        <td className="d-none d-md-table-cell">{ticket.shift}</td>
        <td>
          <span className={`badge px-3 py-2 rounded-pill ${getStatusClass(ticket.status)}`}>
            <i className={`bi ${getStatusIcon(ticket.status)} me-1`}></i>
            {ticket.status}
          </span>
        </td>
      </tr>
    );
  };
  
  export default TicketRow;
  
const EmptyRow = () => (
    <tr>
      <td colSpan="5" className="text-center text-muted py-4">
        <i className="bi bi-exclamation-circle me-2"></i>No hay tickets para esta fecha.
      </td>
    </tr>
  );
  
  export default EmptyRow;
  
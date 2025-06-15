const LoadingRow = () => (
    <tr>
      <td colSpan="5" className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </td>
    </tr>
  );
  
  export default LoadingRow;
  
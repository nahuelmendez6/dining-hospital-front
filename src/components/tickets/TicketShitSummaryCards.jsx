const TicketSummaryCards = ({ summary }) => {
    const cardColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info'];
  
    return (
      <div className="row g-3 mb-4">
        {summary.map(({ shift, total }, index) => {
          // Elegimos un color rotando en el array según el índice
          const colorClass = cardColors[index % cardColors.length];
  
          return (
            <div className="col-md-4" key={index}>
              <div className={`card shadow-sm border-0 text-white ${colorClass}`}>
                <div className="card-body d-flex align-items-center">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-ticket-perforated fs-2"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">{shift}</h6>
                    <h4 className="mb-0">{total} tickets</h4>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  export default TicketSummaryCards;
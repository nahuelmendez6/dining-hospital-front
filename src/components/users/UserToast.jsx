import { useEffect } from "react";

const UserToast = ({ toast, setToast }) => {
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast.show) return null;

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div className={`toast align-items-center text-white bg-${toast.type} show`}>
        <div className="d-flex">
          <div className="toast-body">{toast.message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => setToast({ ...toast, show: false })}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default UserToast;
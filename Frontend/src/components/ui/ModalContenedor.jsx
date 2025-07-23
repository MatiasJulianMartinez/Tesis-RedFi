// src/components/ui/ModalContenedor.jsx

const ModalContenedor = ({ children, onClose = null, maxWidth = "max-w-xl" }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 sm:px-6"
        onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className={`bg-secundario border border-white/10 rounded-lg w-full ${maxWidth} max-h-[90vh] overflow-visible p-6 text-texto relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalContenedor;

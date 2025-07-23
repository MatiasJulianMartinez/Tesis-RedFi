import { IconX } from "@tabler/icons-react";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import ModalContenedor from "../../../ui/ModalContenedor";

const ModalVerTecnologia = ({ tecnologia, onClose }) => {
    if (!tecnologia) return null;
  return (
    <ModalContenedor onClose={onClose}>
        <div className="flex justify-between items-start mb-4">
          <MainH2 className="mb-0">Detalle de Tecnología</MainH2>
          <MainButton
            onClick={onClose}
            type="button"
            variant="cross"
            title="Cerrar modal"
          >
            <IconX size={24} />
          </MainButton>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-texto/60">Nombre</p>
            <p className="text-lg font-medium">{tecnologia.tecnologia}</p>
          </div>

          <div>
            <p className="text-sm text-texto/60">Descripcion</p>
            <p className="text-base">{tecnologia.descripcion || "-"}</p>
          </div>

          {tecnologia.created_at && (
            <div>
              <p className="text-sm text-texto/60">Fecha de creación</p>
              <p className="text-base">
                {new Date(tecnologia.created_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <MainButton variant="primary" onClick={onClose}>
            Cerrar
          </MainButton>
        </div>
      </ModalContenedor>
  );
};

export default ModalVerTecnologia
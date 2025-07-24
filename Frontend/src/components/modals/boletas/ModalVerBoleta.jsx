import { IconX } from "@tabler/icons-react";
import MainButton from "../../ui/MainButton";
import MainH2 from "../../ui/MainH2";
import ModalContenedor from "../../ui/ModalContenedor";

const ModalVerBoleta = ({ boleta, onClose, boletaAnterior }) => {
  if (!boleta) return null;

  const montoActual = parseFloat(boleta.monto);
  const montoAnterior = boletaAnterior
    ? parseFloat(boletaAnterior.monto)
    : null;

  let diferenciaTexto = "—";
  let diferenciaColor = "text-texto";

  if (montoAnterior !== null) {
    const diferencia = montoActual - montoAnterior;
    if (diferencia > 0) {
      diferenciaTexto = `📈 Subió $${diferencia.toFixed(2)}`;
      diferenciaColor = "text-green-400";
    } else if (diferencia < 0) {
      diferenciaTexto = `📉 Bajó $${Math.abs(diferencia).toFixed(2)}`;
      diferenciaColor = "text-red-400";
    } else {
      diferenciaTexto = `🟰 Sin cambios`;
      diferenciaColor = "text-yellow-300";
    }
  }

  return (
    <ModalContenedor onClose={onClose}>
      <div className="flex justify-between mb-4">
        <MainH2 className="mb-0">Detalle de boleta</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3 ml-10 mb-2 text-xl">
          <p>
            <strong>Mes:</strong> {boleta.mes}
          </p>
          <p>
            <strong>Año:</strong> {boleta.anio}
          </p>
          <p>
            <strong>Monto:</strong> ${montoActual.toFixed(2)}
          </p>
          <p className={diferenciaColor}>
            <strong>Diferencia:</strong> {diferenciaTexto}
          </p>
          <p>
            <strong>Proveedor:</strong> {boleta.proveedor}
          </p>
          <p>
            <strong>Vencimiento:</strong>{" "}
            {new Date(boleta.vencimiento).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          {boleta.promo_hasta && (
            <p className="text-yellow-400">
              <strong>Promoción hasta:</strong>{" "}
              {new Date(boleta.promo_hasta).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          {boleta.url_imagen ? (
            <img
              src={boleta.url_imagen}
              alt="Boleta"
              className="max-h-[300px] object-contain rounded border"
            />
          ) : (
            <div className="text-center text-gray-400 italic border border-dashed p-6 rounded max-w-xs">
              ❌ El usuario no cargó una imagen de la boleta.
            </div>
          )}
        </div>
      </div>
    </ModalContenedor>
  );
};

export default ModalVerBoleta;

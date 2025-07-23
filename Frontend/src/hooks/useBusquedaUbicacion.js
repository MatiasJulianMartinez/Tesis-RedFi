import { useState, useCallback } from "react";
import { buscarUbicacion } from "../services/mapa";
import { eliminarMarcadorUbicacion } from "../services/mapa/ubicacion";
import { useAlerta } from "../context/AlertaContext"; 

const API_KEY = "195f05dc4c614f52ac0ac882ee570395";

export const useBusquedaUbicacion = (boundsCorrientes, mapRef) => {
  const [input, setInput] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const { mostrarError } = useAlerta(); 

  const buscarSugerencias = useCallback(
    (value) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);

      setDebounceTimeout(
        setTimeout(() => {
          if (value.trim().length > 2) {
            fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                value + ", Corrientes, Argentina"
              )}&key=${API_KEY}&limit=5`
            )
              .then((res) => res.json())
              .then((data) => {
                setSugerencias(data.results || []);
              })
              .catch((err) => {
                console.error("Error en autocompletar:", err);
                mostrarError("No se pudo obtener sugerencias."); 
              });
          } else {
            setSugerencias([]);
          }
        }, 150)
      );
    },
    [debounceTimeout, mostrarError]
  );

  const handleLimpiarBusqueda = () => {
    setInput("");
    setSugerencias([]);
    if (mapRef?.current) {
      eliminarMarcadorUbicacion(mapRef.current);
    }
  };

  const handleInputChange = (value) => {
    setInput(value);
    buscarSugerencias(value);
  };

  const handleBuscar = () => {
    if (mapRef?.current) {
      buscarUbicacion(input, boundsCorrientes, mostrarError, mapRef.current); 
    }
  };

  const handleSeleccionarSugerencia = (sugerencia) => {
    setInput(sugerencia.formatted);
    setSugerencias([]);
    if (mapRef?.current) {
      buscarUbicacion(sugerencia.formatted, boundsCorrientes, mostrarError, mapRef.current); 
    }
  };

  return {
    input,
    sugerencias,
    handleInputChange,
    handleBuscar,
    handleSeleccionarSugerencia,
    handleLimpiarBusqueda,
    setSugerencias,
  };
};

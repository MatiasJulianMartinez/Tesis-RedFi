import MainButton from "../ui/MainButton";

const TablaSelector = ({ tablas, tablaActual, setTablaActual }) => {
  return (
    <div className="flex justify-center gap-2 mb-8 flex-wrap">
      {tablas.map((t) => (
        <MainButton
          key={t.id}
          onClick={() => setTablaActual(t.id)}
          variant={tablaActual === t.id ? "accent" : "secondary"}
        >
          {t.label}
        </MainButton>
      ))}
    </div>
  );
};

export default TablaSelector;

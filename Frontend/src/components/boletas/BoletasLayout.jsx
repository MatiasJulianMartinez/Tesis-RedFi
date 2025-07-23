import { IconFileDescription } from '@tabler/icons-react';
import MainH1 from '../ui/MainH1';
const BoletasLayout = ({ children }) => {
  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <MainH1 icon={IconFileDescription}>Mis boletas</MainH1>
        {children}
      </div>
    </section>
  );
};

export default BoletasLayout;

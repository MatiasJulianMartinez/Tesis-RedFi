import { IconBrandFacebook } from '@tabler/icons-react';
import { IconBrandInstagram } from '@tabler/icons-react';
import { IconBrandX } from '@tabler/icons-react';
import { IconBrandLinkedin } from '@tabler/icons-react';


const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-fondo shadow-none py-6" style={{ boxShadow: '0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 -8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
      <div className="text-center text-texto/60">
        <p className="mb-3">© {year} <span className="font-semibold text-texto">Red-Fi</span>. Todos los derechos reservados.</p>

        <div className="flex justify-center gap-4 mt-2">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-texto transition-transform transform hover:scale-110 duration-300">
            <IconBrandFacebook size={18} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-texto transition-transform transform hover:scale-110 duration-300">
            <IconBrandInstagram size={18} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-texto transition-transform transform hover:scale-110 duration-300">
            <IconBrandX size={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-texto transition-transform transform hover:scale-110 duration-300">
            <IconBrandLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

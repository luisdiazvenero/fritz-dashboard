// src/components/ui/Footer.jsx
const Footer = () => (
    <footer className="border-t mt-8 py-6 px-6 bg-white">
      <div className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Mil Dashboard. Todos los derechos reservados.
      </div>
    </footer>
  );
  
  export default Footer;
const SkipLinks = () => {
  return (
    <nav aria-label="Links de navegação rápida" className="sr-only focus-within:not-sr-only">
      <ul className="fixed top-0 left-0 z-[100] flex gap-2 p-2 bg-background">
        <li>
          <a
            href="#conteudo-principal"
            className="
              inline-block px-4 py-2 
              bg-[#FFD700] text-black font-semibold 
              rounded-md shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2
              transform -translate-y-full focus:translate-y-0
              transition-transform duration-200
            "
          >
            Pular para o conteúdo principal
          </a>
        </li>
        <li>
          <a
            href="#planos"
            className="
              inline-block px-4 py-2 
              bg-[#FFD700] text-black font-semibold 
              rounded-md shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2
              transform -translate-y-full focus:translate-y-0
              transition-transform duration-200
            "
          >
            Ir para planos
          </a>
        </li>
        <li>
          <a
            href="#faq"
            className="
              inline-block px-4 py-2 
              bg-[#FFD700] text-black font-semibold 
              rounded-md shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2
              transform -translate-y-full focus:translate-y-0
              transition-transform duration-200
            "
          >
            Ir para FAQ
          </a>
        </li>
        <li>
          <a
            href="#contato"
            className="
              inline-block px-4 py-2 
              bg-[#FFD700] text-black font-semibold 
              rounded-md shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2
              transform -translate-y-full focus:translate-y-0
              transition-transform duration-200
            "
          >
            Ir para contato
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default SkipLinks;

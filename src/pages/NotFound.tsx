import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="mb-4 text-6xl font-bold text-premium-gold">404</h1>
        <p className="mb-6 text-2xl text-foreground">Página não encontrada</p>
        <p className="mb-8 text-muted-foreground">
          Desculpe, a página que você está procurando não existe.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-gradient-gold text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-premium shadow-gold"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

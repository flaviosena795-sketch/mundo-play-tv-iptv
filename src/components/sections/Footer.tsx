import { MessageCircle, Instagram, Facebook, Mail, MapPin, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-darker-bg border-t border-subtle-border" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Column */}
          <div>
            <h3 className="text-xl font-bold text-premium-gold mb-4">
              Mundo Play TV
            </h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              A melhor plataforma de IPTV do Brasil. Mais de 50.000 conteúdos em 4K Ultra HD, 
              com estabilidade garantida e suporte 24/7.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-premium-gold" />
              <span>Pagamento 100% Seguro</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Links Rápidos</h4>
            <nav aria-label="Links do rodapé">
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#sobre" className="text-muted-foreground hover:text-premium-gold transition-smooth">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="#recursos" className="text-muted-foreground hover:text-premium-gold transition-smooth">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#planos" className="text-muted-foreground hover:text-premium-gold transition-smooth">
                    Planos e Preços
                  </a>
                </li>
                <li>
                  <a href="#teste-gratis" className="text-muted-foreground hover:text-premium-gold transition-smooth">
                    Teste Grátis
                  </a>
                </li>
                <li>
                  <a href="#depoimentos" className="text-muted-foreground hover:text-premium-gold transition-smooth">
                    Depoimentos
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-premium-gold transition-smooth">
                    Perguntas Frequentes
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://wa.me/5521966238378" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-smooth"
                >
                  <MessageCircle className="w-4 h-4" />
                  (21) 96623-8378
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contato@mundoplaytv.com.br"
                  className="flex items-center gap-2 text-muted-foreground hover:text-premium-gold transition-smooth"
                >
                  <Mail className="w-4 h-4" />
                  contato@mundoplaytv.com.br
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-premium-gold" />
                <span>Atendimento 24/7</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Brasil</span>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Redes Sociais</h4>
            <div className="flex gap-3 mb-6">
              <a 
                href="https://wa.me/5521966238378" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-smooth"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://bit.ly/instamundoplaytv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center text-white transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="http://bit.ly/47Ktf3y" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-smooth"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            
            {/* Trust badges */}
            <div className="bg-gradient-card rounded-lg p-4 border border-subtle-border">
              <div className="text-center">
                <div className="text-premium-gold font-bold text-lg">⭐ 4.8/5</div>
                <div className="text-xs text-muted-foreground">+1.250 avaliações</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-subtle-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Mundo Play TV. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <Link to="/termos" className="hover:text-premium-gold transition-smooth">
                Termos de Serviço
              </Link>
              <span>•</span>
              <Link to="/privacidade" className="hover:text-premium-gold transition-smooth">
                Política de Privacidade
              </Link>
              <span>•</span>
              <span>IPTV Brasil</span>
              <span>•</span>
              <span>Canais 4K</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

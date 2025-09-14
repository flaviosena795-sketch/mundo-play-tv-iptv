import { Users, Award, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🎯 Sobre a <span className="text-premium-gold">Mundo Play TV</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Especialistas em IPTV Premium, oferecemos conteúdo de qualidade superior 
              com estabilidade incomparável, atendimento humanizado e tecnologia de ponta.
            </p>
            <div className="mt-6">
              <p className="text-lg text-premium-gold font-semibold">
                Ative em minutos e aproveite o melhor do entretenimento 4K.
              </p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-gradient-card rounded-2xl border border-subtle-border shadow-card">
              <Users className="w-12 h-12 text-premium-gold mx-auto mb-4" />
              <div className="text-3xl font-bold text-foreground mb-2">✅ +5.000</div>
              <div className="text-muted-foreground">Clientes Satisfeitos</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-card rounded-2xl border border-subtle-border shadow-card">
              <Award className="w-12 h-12 text-premium-gold mx-auto mb-4" />
              <div className="text-3xl font-bold text-foreground mb-2">✅ 99,9%</div>
              <div className="text-muted-foreground">de Uptime</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-card rounded-2xl border border-subtle-border shadow-card">
              <TrendingUp className="w-12 h-12 text-premium-gold mx-auto mb-4" />
              <div className="text-3xl font-bold text-foreground mb-2">✅ 24/7</div>
              <div className="text-muted-foreground">Suporte Técnico</div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-gradient-card rounded-2xl border border-subtle-border p-8 md:p-12 shadow-card">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  Experiência Premium em Entretenimento
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Na Mundo Play TV, transformamos a forma como você consome entretenimento. 
                    Nossa plataforma IPTV oferece acesso a milhares de canais premium com 
                    qualidade 4K e estabilidade incomparável.
                  </p>
                  <p>
                    Com anos de experiência no mercado, desenvolvemos uma infraestrutura 
                    robusta que garante transmissões sem interrupções e suporte técnico 
                    especializado sempre disponível.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-premium-gold rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Tecnologia Avançada</h4>
                    <p className="text-muted-foreground text-sm">
                      Servidores de última geração para máxima performance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-premium-gold rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Suporte Especializado</h4>
                    <p className="text-muted-foreground text-sm">
                      Equipe técnica qualificada para resolver qualquer questão
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-premium-gold rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Satisfação Garantida</h4>
                    <p className="text-muted-foreground text-sm">
                      Compromisso com a excelência em cada detalhe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
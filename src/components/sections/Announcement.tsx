import { AlertTriangle, Tv, CheckCircle, Phone } from "lucide-react";

const Announcement = () => {
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-primary/10 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-primary/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-full">
              <Tv className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Comunicado Importante
            </h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Prezados clientes, a <span className="text-primary font-semibold">Mundo Play TV</span> informa que é a única no mercado que, para garantir mais <strong>estabilidade, qualidade e segurança</strong>, atualizou o sistema de acesso IPTV.
          </p>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              📺 A partir de agora:
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Trabalhamos com <strong className="text-foreground">3 listas de servidores IPTV diferentes</strong> no mesmo aplicativo — o que reduz em até <span className="text-primary font-bold">99%</span> os travamentos e interrupções.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Recomendamos sempre o uso de <strong className="text-foreground">aplicativos PRO (pagos)</strong>, pois possuem melhor desempenho e compatibilidade com nossos servidores.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  A instalação continua <strong className="text-foreground">gratuita</strong>, mas o custo do aplicativo PRO é coberto por nós quando usado em um único aparelho.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong className="text-foreground">Atenção:</strong> Caso o cliente deseje utilizar 1 lista em cada aparelho, será necessário arcar com o custo dos aplicativos adicionais ou optar por um aplicativo gratuito, sujeito a menor qualidade.
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            Nosso objetivo é proporcionar a <strong className="text-foreground">melhor experiência de uso</strong>, com transmissão estável e sem travamentos.
          </p>

          <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
            <Phone className="w-5 h-5 text-primary" />
            <p className="text-muted-foreground">
              Em caso de dúvidas, nossa <strong className="text-foreground">equipe de suporte</strong> está à disposição.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-primary font-bold text-lg">
              🎬 MUNDO PLAY TV — Conectando você ao melhor conteúdo!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcement;

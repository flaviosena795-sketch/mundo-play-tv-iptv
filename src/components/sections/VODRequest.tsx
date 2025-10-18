import WhatsAppButton from "@/components/WhatsAppButton";
import { Clapperboard, Film, Tv, Star } from "lucide-react";

const VODRequest = () => {
  return (
    <section className="py-20 bg-gradient-card border-y border-subtle-border" aria-labelledby="vod-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-premium-gold/20 p-4 rounded-2xl">
                <Clapperboard className="w-12 h-12 text-premium-gold" />
              </div>
            </div>
            <h2 id="vod-heading" className="text-4xl md:text-5xl font-bold mb-6">
              🎬 <span className="text-premium-gold">Solicite seus VODs!</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Quer ver aquele filme ou série que ainda não está disponível?<br />
              👉 Na Mundo Play TV, você pode pedir novos conteúdos, atualizar os que já existem e ter sempre o melhor do entretenimento na sua tela.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-background rounded-2xl border border-subtle-border p-6 hover:border-premium-gold/30 transition-premium">
              <Film className="w-8 h-8 text-premium-gold mb-4 mx-auto" />
              <h3 className="font-bold text-foreground mb-2">📌 Mais liberdade</h3>
              <p className="text-muted-foreground text-sm">
                Peça novos filmes e séries
              </p>
            </div>
            
            <div className="bg-background rounded-2xl border border-subtle-border p-6 hover:border-premium-gold/30 transition-premium">
              <Tv className="w-8 h-8 text-premium-gold mb-4 mx-auto" />
              <h3 className="font-bold text-foreground mb-2">📌 Mais opções</h3>
              <p className="text-muted-foreground text-sm">
                Atualize conteúdos existentes
              </p>
            </div>
            
            <div className="bg-background rounded-2xl border border-subtle-border p-6 hover:border-premium-gold/30 transition-premium">
              <Star className="w-8 h-8 text-premium-gold mb-4 mx-auto" />
              <h3 className="font-bold text-foreground mb-2">📌 Mais diversão</h3>
              <p className="text-muted-foreground text-sm">
                Entretenimento sem limites
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-premium-gold/5 rounded-2xl p-8 border border-premium-gold/20">
            <p className="text-lg font-semibold text-foreground mb-6">
              🚀 Entretenimento sem limites é com a Mundo Play TV!
            </p>
            <WhatsAppButton className="text-lg px-8 py-4 shadow-gold">
              📱 Solicitar Conteúdo
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VODRequest;
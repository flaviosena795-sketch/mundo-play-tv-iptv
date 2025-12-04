import { AlertTriangle, Tv, CheckCircle, Phone, Sparkles } from "lucide-react";

const Announcement = () => {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-blue-500/40 rounded-2xl p-6 md:p-8 shadow-2xl shadow-blue-500/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg shadow-blue-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Comunicado Importante
            </h2>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            Prezados clientes, a <span className="text-blue-400 font-semibold">Mundo Play TV</span> informa que é a única no mercado que, para garantir mais <strong className="text-white">estabilidade, qualidade e segurança</strong>, atualizou o sistema de acesso IPTV.
          </p>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-blue-400" />
              A partir de agora:
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  Trabalhamos com <strong className="text-white">3 listas de servidores IPTV diferentes</strong> no mesmo aplicativo — o que reduz em até <span className="text-emerald-400 font-bold">99%</span> os travamentos e interrupções.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  Recomendamos sempre o uso de <strong className="text-white">aplicativos PRO (pagos)</strong>, pois possuem melhor desempenho e compatibilidade com nossos servidores.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  A instalação continua <strong className="text-white">gratuita</strong>, mas o custo do aplicativo PRO é coberto por nós quando usado em um único aparelho.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/40 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300">
                <strong className="text-amber-400">Atenção:</strong> Caso o cliente deseje utilizar 1 lista em cada aparelho, será necessário arcar com o custo dos aplicativos adicionais ou optar por um aplicativo gratuito, sujeito a menor qualidade.
              </p>
            </div>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            Nosso objetivo é proporcionar a <strong className="text-white">melhor experiência de uso</strong>, com transmissão estável e sem travamentos.
          </p>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/40 rounded-xl">
            <Phone className="w-5 h-5 text-green-400" />
            <p className="text-gray-300">
              Em caso de dúvidas, nossa <strong className="text-white">equipe de suporte</strong> está à disposição.
            </p>
          </div>

          <div className="mt-6 text-center p-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl border border-blue-500/30">
            <p className="font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎬 MUNDO PLAY TV — Conectando você ao melhor conteúdo!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcement;

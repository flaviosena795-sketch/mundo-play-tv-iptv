import { motion } from "framer-motion";
import { Check, Star, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Plans = () => {
  const [nomeCliente, setNomeCliente] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [confirmacao, setConfirmacao] = useState<{ show: boolean; plan: any } | null>(null);

  const WHATSAPP_NUMBER = "5521964269985";

  const plans = [
    {
      name: "Mensal",
      price: "R$ 29,90",
      valor: 29.9,
      period: "/mês",
      features: [
        "+15.000 canais",
        "Qualidade 4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: false,
    },
    {
      name: "Trimestral",
      price: "R$ 79,90",
      valor: 79.9,
      period: "/3 meses",
      features: [
        "+15.000 canais",
        "4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: true,
    },
    {
      name: "Semestral",
      price: "R$ 149,90",
      valor: 149.9,
      period: "/6 meses",
      features: [
        "+15.000 canais",
        "4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: false,
    },
    {
      name: "Anual",
      price: "R$ 289,90",
      valor: 289.9,
      period: "/ano",
      features: [
        "+15.000 canais",
        "4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: false,
    },
  ];

  const handlePagar = (plan: typeof plans[0]) => {
    const nome = nomeCliente[plan.name]?.trim();
    
    if (!nome) {
      alert("Por favor, digite seu nome completo antes de continuar.");
      return;
    }

    setConfirmacao({ show: true, plan });
  };

  const confirmarPagamento = async () => {
    if (!confirmacao) return;
    
    const { plan } = confirmacao;
    const nome = nomeCliente[plan.name]?.trim();

    setLoading({ ...loading, [plan.name]: true });

    try {
      const response = await fetch(
        'https://ychdztoixsefnpurmmhi.supabase.co/functions/v1/criar-preferencia',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plano: { nome: plan.name, valor: plan.valor },
            nomeCliente: nome
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro ao criar preferência:', data);
        alert(`Erro ao criar pagamento: ${data.error || 'Verifique se o token do Mercado Pago está configurado corretamente.'}`);
        return;
      }

      if (data?.initPoint) {
        window.location.href = data.initPoint;
      } else {
        console.error('Resposta do servidor:', data);
        alert('Erro: Link de pagamento não recebido. Contate o suporte.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao processar pagamento. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading({ ...loading, [plan.name]: false });
      setConfirmacao(null);
    }
  };

  return (
    <section id="planos" className="py-20 bg-background" aria-labelledby="plans-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h2
              id="plans-heading"
              className="text-4xl md:text-5xl font-bold mb-6 text-premium-gold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              🌎 MUNDO PLAY TV
            </motion.h2>

            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Escolha seu plano e tenha acesso imediato ao melhor da TV mundial!
            </motion.p>
          </div>
          
          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`
                  relative p-6 rounded-2xl border-t-4 border-premium-gold transition-all
                  bg-gradient-card shadow-card hover:shadow-gold
                  ${plan.popular ? 'ring-2 ring-premium-gold scale-105' : ''}
                `}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-gold text-accent-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      MAIS POPULAR
                    </div>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-premium-gold">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {plan.price}
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </p>
                </div>
                
                {/* Features List */}
                <ul className="text-sm mb-6 space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-5 h-5 text-premium-gold mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Nome Input */}
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={nomeCliente[plan.name] || ""}
                  onChange={(e) => setNomeCliente({ ...nomeCliente, [plan.name]: e.target.value })}
                  className="w-full px-4 py-2 mb-4 rounded-lg border border-subtle-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-premium-gold"
                />
                
                {/* CTA Button */}
                {plan.name === "Mensal" ? (
                  <div id="mp-payment-container">
                    <script 
                      src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js"
                      data-preference-id="2958149440-beaddb38-3fd4-452e-9c84-5e79ba6eb449" 
                      data-source="button"
                    />
                  </div>
                ) : (
                  <Button
                    onClick={() => handlePagar(plan)}
                    disabled={loading[plan.name]}
                    variant="default"
                    className="w-full"
                  >
                    {loading[plan.name] ? "Processando..." : "📲 Pagar Agora"}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* WhatsApp Support Button */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1%20👋%20quero%20suporte%20Mundo%20Play%20TV`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              💬 Falar com Suporte
            </a>
          </motion.div>

          {/* Bottom Note */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              🔒 Pagamento 100% seguro • ⚡ Ativação imediata • 🎯 Teste grátis disponível
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {confirmacao?.show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-gradient-card border border-subtle-border p-6 rounded-xl max-w-md w-full shadow-premium"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-premium-gold text-center">
              Confirme seu pagamento
            </h2>
            <p className="mb-6 text-center text-foreground">
              Você está prestes a pagar o plano{" "}
              <strong className="text-premium-gold">{confirmacao.plan.name}</strong>{" "}
              por{" "}
              <strong className="text-premium-gold">
                R$ {confirmacao.plan.valor.toFixed(2)}
              </strong>
              .
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setConfirmacao(null)}
                variant="secondary"
                className="flex-1"
                disabled={loading[confirmacao.plan.name]}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarPagamento}
                variant="default"
                className="flex-1"
                disabled={loading[confirmacao.plan.name]}
              >
                {loading[confirmacao.plan.name] ? "Processando..." : "Confirmar"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Plans;
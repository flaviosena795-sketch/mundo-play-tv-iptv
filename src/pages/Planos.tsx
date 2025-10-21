import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const planos = [
  {
    nome: "Mensal",
    preco: "R$ 29,90",
    duracao: "1 mês",
    link: "https://mpago.la/2JZBKqd",
  },
  {
    nome: "Trimestral",
    preco: "R$ 79,90",
    duracao: "3 meses",
    link: "https://mpago.la/28VRTT5",
  },
  {
    nome: "Semestral",
    preco: "R$ 149,90",
    duracao: "6 meses",
    link: "https://mpago.la/1xVXUV1",
  },
  {
    nome: "Anual",
    preco: "R$ 289,90",
    duracao: "12 meses",
    link: "https://mpago.la/1awVzsz",
  },
];

const Planos = () => {
  const handlePagamento = (link: string) => {
    window.open(link, "_blank");
    setTimeout(() => {
      window.open(
        "https://wa.me/5521966238378?text=Olá,+já+realizei+meu+pagamento!",
        "_blank"
      );
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 relative">
      {/* Logo */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="/logo-mundoplaytv.jpeg"
          alt="Mundo Play TV"
          width={120}
          height={120}
          className="rounded-full border-2 border-premium-gold shadow-gold"
        />
      </motion.div>

      {/* Título */}
      <motion.h1
        className="text-3xl md:text-5xl font-bold mb-10 text-center text-premium-gold"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📺 Planos de Assinatura
      </motion.h1>

      {/* Cards dos Planos */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">
        {planos.map((plano, index) => (
          <motion.div
            key={plano.nome}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="bg-gradient-card border border-subtle-border rounded-2xl shadow-card hover:shadow-premium transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-premium-gold">
                  {plano.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <p className="text-3xl font-bold text-premium-gold">
                  {plano.preco}
                </p>
                <p className="text-muted-foreground">{plano.duracao}</p>
                <Button
                  onClick={() => handlePagamento(plano.link)}
                  className="w-full mt-3"
                >
                  💳 Assinar Agora
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Botão WhatsApp flutuante */}
      <motion.a
        href="https://wa.me/5521966238378?text=Olá,+preciso+de+ajuda+com+os+planos"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 z-50"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <MessageCircle size={28} />
      </motion.a>
    </div>
  );
};

export default Planos;

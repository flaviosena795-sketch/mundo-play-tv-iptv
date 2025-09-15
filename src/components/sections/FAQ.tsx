import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const faqData = [
  {
    question: "1. O que é a Mundo Play TV?",
    answer: "A Mundo Play TV é uma plataforma de IPTV Premium que oferece acesso a milhares de canais de TV ao vivo, filmes, séries, esportes, desenhos, PPV e muito mais, tudo em qualidade 4K Ultra HD."
  },
  {
    question: "2. Preciso de antena ou aparelho especial?",
    answer: "Não. Basta ter uma conexão de internet estável (mínimo de 10MB) e um dispositivo compatível, como Smart TV, celular, tablet, PC ou TV Box."
  },
  {
    question: "3. Funciona em qualquer internet?",
    answer: "Sim. Funciona em qualquer provedor de internet no Brasil ou no exterior. Para melhor desempenho, recomendamos internet acima de 15MB e conexão cabeada ou Wi-Fi de qualidade."
  },
  {
    question: "4. Como funciona o teste grátis?",
    answer: "Você recebe acesso completo à plataforma por 6 horas, sem custo. É só solicitar pelo WhatsApp e ativamos imediatamente para você testar."
  },
  {
    question: "5. Preciso assinar contrato ou fidelidade?",
    answer: "Não. Você pode contratar de forma mensal, trimestral, semestral ou anual, sem burocracia e sem contratos de fidelidade."
  },
  {
    question: "6. Quais canais estão disponíveis?",
    answer: "São mais de 15.000 canais nacionais e internacionais, incluindo esportes, filmes, séries, notícias, documentários, infantis e muito mais. Além disso, você pode solicitar novos conteúdos diretamente pelo nosso sistema."
  },
  {
    question: "7. O serviço é seguro?",
    answer: "Sim. Trabalhamos com pagamentos 100% seguros, dados criptografados e suporte técnico disponível 24 horas por dia, 7 dias por semana."
  },
  {
    question: "8. Como é feita a instalação?",
    answer: "A instalação é simples e rápida. Nossa equipe faz toda a configuração remotamente e você só precisa ter uma TV compatível ou dispositivo para instalar o aplicativo."
  },
  {
    question: "9. Posso assistir em mais de um aparelho ao mesmo tempo?",
    answer: "Sim. Você pode usar em diferentes aparelhos (Smart TV, celular, tablet, PC, TV Box). Para acessos simultâneos, consulte nossos planos."
  },
  {
    question: "10. E se eu tiver algum problema?",
    answer: "Nosso suporte técnico especializado está disponível 24/7 via WhatsApp para resolver qualquer dúvida ou questão de forma rápida e eficiente."
  }
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            ❓ Perguntas <span className="text-premium-gold">Frequentes</span> (FAQ)
          </h2>
          
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <Collapsible
                key={index}
                open={openItems.includes(index)}
                onOpenChange={() => toggleItem(index)}
              >
                <div className="bg-card border border-subtle-border rounded-2xl overflow-hidden shadow-card hover:shadow-premium transition-premium">
                  <CollapsibleTrigger className="w-full p-6 text-left flex justify-between items-center hover:bg-accent/50 transition-smooth group">
                    <span className="font-semibold text-foreground group-hover:text-premium-gold transition-smooth">
                      {item.question}
                    </span>
                    {openItems.includes(index) ? (
                      <Minus className="w-5 h-5 text-premium-gold transition-smooth" />
                    ) : (
                      <Plus className="w-5 h-5 text-premium-gold transition-smooth" />
                    )}
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="overflow-hidden">
                    <div className="p-6 pt-0 border-t border-subtle-border">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
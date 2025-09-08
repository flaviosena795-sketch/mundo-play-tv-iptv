import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Silva",
      location: "Rio de Janeiro - RJ",
      rating: 5,
      comment: "Melhor serviço de IPTV que já usei! Qualidade excepcional e suporte sempre disponível. A estabilidade dos canais é impressionante, nunca tive problemas.",
      avatar: "C"
    },
    {
      name: "Ana Rodrigues",
      location: "São Paulo - SP",
      rating: 5,
      comment: "Estava cansada das operadoras tradicionais. Com a Mundo Play TV tenho muito mais canais por um preço justo. O atendimento é nota 10!",
      avatar: "A"
    },
    {
      name: "Roberto Santos",
      location: "Belo Horizonte - MG",
      rating: 5,
      comment: "Uso há mais de 1 ano e recomendo para toda família. Funciona perfeitamente na Smart TV e no celular. Vale cada centavo investido!",
      avatar: "R"
    },
    {
      name: "Mariana Costa",
      location: "Brasília - DF",
      rating: 5,
      comment: "A instalação foi super rápida e fácil. Agora tenho acesso a canais do mundo inteiro com qualidade 4K. Estou muito satisfeita com o serviço!",
      avatar: "M"
    },
    {
      name: "João Oliveira",
      location: "Salvador - BA",
      rating: 5,
      comment: "Excelente custo-benefício! Cancelei minha TV por assinatura tradicional e não me arrependo. A Mundo Play TV superou todas as expectativas.",
      avatar: "J"
    },
    {
      name: "Fernanda Lima",
      location: "Recife - PE",
      rating: 5,
      comment: "Suporte técnico excepcional! Sempre que preciso, são muito atenciosos e resolvem rapidamente. A qualidade dos canais é fantástica.",
      avatar: "F"
    }
  ];

  return (
    <section className="py-20 bg-darker-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              O que nossos <span className="text-premium-gold">Clientes</span> dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mais de 5.000 famílias já confiam na Mundo Play TV. 
              Veja os depoimentos de quem já faz parte da nossa família.
            </p>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="
                  relative p-6 bg-gradient-card rounded-2xl border border-subtle-border 
                  hover:shadow-card hover:border-premium-gold/20 transition-premium
                  group
                "
              >
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-premium-gold/30 mb-4" />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="w-4 h-4 fill-premium-gold text-premium-gold"
                    />
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="
                    w-12 h-12 bg-premium-gold/10 rounded-full flex items-center justify-center
                    font-bold text-premium-gold border border-premium-gold/20
                  ">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-premium-gold transition-smooth">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-premium-gold mb-2">99.8%</div>
              <div className="text-muted-foreground">Taxa de Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-premium-gold mb-2">5000+</div>
              <div className="text-muted-foreground">Clientes Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-premium-gold mb-2">24/7</div>
              <div className="text-muted-foreground">Suporte Disponível</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-premium-gold transition-smooth mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Termos de Serviço
          </h1>
          <p className="text-muted-foreground mb-8">
            Última atualização: 13 de Janeiro de 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e usar os serviços da Mundo Play TV, você concorda em cumprir e estar vinculado 
              a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, 
              não poderá acessar o serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A Mundo Play TV oferece serviços de streaming de conteúdo audiovisual através da internet 
              (IPTV), incluindo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Acesso a canais de televisão ao vivo</li>
              <li>Biblioteca de filmes e séries sob demanda</li>
              <li>Conteúdo esportivo e eventos ao vivo</li>
              <li>Suporte técnico 24 horas por dia, 7 dias por semana</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Cadastro e Conta</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para utilizar nossos serviços, você deve fornecer informações verdadeiras, precisas e completas 
              durante o processo de cadastro. Você é responsável por manter a confidencialidade de sua conta 
              e senha, e por todas as atividades que ocorram sob sua conta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Planos e Pagamentos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Os planos oferecidos possuem valores e características específicas descritas em nossa página de planos. 
              Os pagamentos são processados através do Mercado Pago, garantindo segurança nas transações.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Os preços podem ser alterados mediante aviso prévio</li>
              <li>A cobrança é realizada de acordo com o período do plano escolhido</li>
              <li>Oferecemos garantia de 7 dias com reembolso total</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Uso Aceitável</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você concorda em usar o serviço apenas para fins pessoais e não comerciais. É proibido:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Compartilhar sua conta com terceiros</li>
              <li>Revender ou redistribuir o serviço</li>
              <li>Tentar burlar medidas de segurança do sistema</li>
              <li>Usar o serviço para atividades ilegais</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Cancelamento e Reembolso</h2>
            <p className="text-muted-foreground leading-relaxed">
              Você pode cancelar sua assinatura a qualquer momento. Se o cancelamento for solicitado dentro 
              de 7 dias após a compra, você terá direito ao reembolso integral do valor pago. Após este período, 
              o acesso continuará até o final do período pago.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Disponibilidade do Serviço</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nos esforçamos para manter uma disponibilidade de 99.9%, porém não garantimos que o serviço 
              estará disponível ininterruptamente. Manutenções programadas serão comunicadas com antecedência 
              sempre que possível.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Propriedade Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo o conteúdo disponibilizado através da Mundo Play TV é protegido por direitos autorais. 
              Você não está autorizado a copiar, distribuir ou reproduzir qualquer conteúdo sem autorização expressa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              A Mundo Play TV não será responsável por danos indiretos, incidentais ou consequenciais 
              decorrentes do uso ou incapacidade de uso do serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Alterações nos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas 
              serão comunicadas através de e-mail ou notificação no serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas sobre estes Termos de Serviço, entre em contato conosco:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 mt-4">
              <li><strong className="text-foreground">WhatsApp:</strong> (21) 96623-8378</li>
              <li><strong className="text-foreground">E-mail:</strong> contato@mundoplaytv.com.br</li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
};

export default TermsOfService;

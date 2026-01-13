import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground mb-8">
            Última atualização: 13 de Janeiro de 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed">
              A Mundo Play TV está comprometida com a proteção da sua privacidade. Esta Política de Privacidade 
              explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais em conformidade 
              com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Dados que Coletamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Podemos coletar os seguintes tipos de informações:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Dados de identificação:</strong> nome, e-mail, telefone/WhatsApp</li>
              <li><strong className="text-foreground">Dados de pagamento:</strong> processados diretamente pelo Mercado Pago (não armazenamos dados de cartão)</li>
              <li><strong className="text-foreground">Dados de uso:</strong> informações sobre como você utiliza nosso serviço</li>
              <li><strong className="text-foreground">Dados técnicos:</strong> endereço IP, tipo de navegador, dispositivo utilizado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Como Usamos seus Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Fornecer e manter nosso serviço de streaming</li>
              <li>Processar pagamentos e gerenciar sua assinatura</li>
              <li>Enviar comunicações importantes sobre o serviço</li>
              <li>Fornecer suporte técnico</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Base Legal para Processamento</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Processamos seus dados pessoais com base nas seguintes fundamentações legais da LGPD:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Execução de contrato:</strong> para fornecer o serviço contratado</li>
              <li><strong className="text-foreground">Consentimento:</strong> para comunicações de marketing</li>
              <li><strong className="text-foreground">Interesse legítimo:</strong> para melhorar nossos serviços</li>
              <li><strong className="text-foreground">Obrigação legal:</strong> para cumprir exigências legais</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Podemos compartilhar seus dados com:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Mercado Pago:</strong> para processamento de pagamentos</li>
              <li><strong className="text-foreground">Serviços de análise:</strong> Google Analytics para estatísticas de uso</li>
              <li><strong className="text-foreground">Autoridades legais:</strong> quando exigido por lei</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Não vendemos, alugamos ou comercializamos suas informações pessoais para terceiros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Segurança dos Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais 
              contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia, 
              controles de acesso e monitoramento de segurança.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Retenção de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais 
              foram coletados, incluindo obrigações legais, contábeis ou de relatório. Após o cancelamento da 
              assinatura, mantemos os dados por até 5 anos para fins fiscais e legais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              De acordo com a LGPD, você tem os seguintes direitos:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Confirmação e acesso:</strong> saber se tratamos seus dados e acessá-los</li>
              <li><strong className="text-foreground">Correção:</strong> corrigir dados incompletos, inexatos ou desatualizados</li>
              <li><strong className="text-foreground">Anonimização ou exclusão:</strong> solicitar a eliminação de dados desnecessários</li>
              <li><strong className="text-foreground">Portabilidade:</strong> obter seus dados em formato estruturado</li>
              <li><strong className="text-foreground">Revogação:</strong> retirar consentimento a qualquer momento</li>
              <li><strong className="text-foreground">Oposição:</strong> opor-se a tratamento que viole a LGPD</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Cookies e Tecnologias Similares</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Manter você conectado durante a navegação</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar como nosso site é utilizado (Google Analytics)</li>
              <li>Melhorar nossos serviços</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações 
              significativas através de e-mail ou aviso em nosso site. Recomendamos revisar esta política regularmente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Contato e Encarregado de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de seus dados pessoais, 
              entre em contato conosco:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 mt-4">
              <li><strong className="text-foreground">WhatsApp:</strong> (21) 96623-8378</li>
              <li><strong className="text-foreground">E-mail:</strong> contato@mundoplaytv.com.br</li>
              <li><strong className="text-foreground">Assunto:</strong> Proteção de Dados Pessoais</li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
};

export default PrivacyPolicy;

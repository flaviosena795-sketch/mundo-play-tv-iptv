import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, PlayCircle, Globe, Mail, Phone } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-yellow-400 flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Fundo animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 to-black/90 blur-3xl"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Conteúdo principal */}
      <div className="flex flex-col items-center justify-center flex-1 z-10">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/logo-mundoplaytv.jpeg"
            alt="Mundo Play TV"
            width={150}
            height={150}
            className="rounded-full border-2 border-yellow-500 shadow-lg shadow-yellow-500/40"
          />
        </motion.div>

        {/* Título */}
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-center text-yellow-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🌍 Bem-vindo à{" "}
          <span className="text-yellow-500">MUNDO PLAY TV</span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          className="text-lg md:text-xl mt-4 text-yellow-500/80 text-center max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          A melhor experiência em entretenimento IPTV.  
          Canais, filmes, séries e esportes em alta qualidade – tudo em um só lugar.
        </motion.p>

        {/* Botões principais */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/planos">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-6 rounded-2xl shadow-lg shadow-yellow-500/40 text-lg">
              💳 Ver Planos
            </Button>
          </Link>

          <a
            href="https://wa.me/5521966238378?text=Olá,+quero+um+teste+grátis+da+MUNDO+PLAY+TV"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black font-semibold px-8 py-6 rounded-2xl text-lg"
            >
              <PlayCircle className="mr-2" /> Teste Grátis
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Rodapé fixo */}
      <footer className="w-full bg-zinc-950/90 border-t border-yellow-600/20 text-yellow-500 py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm fixed bottom-0 left-0 z-20">
        <div className="flex items-center gap-2">
          <Globe size={16} /> <span>www.mundoplaytv.com.br</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} /> <span>suporte@mundoplaytv.com.br</span>
        </div>
        <a
          href="https://wa.me/5521966238378?text=Olá,+preciso+de+ajuda+com+meu+acesso"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
        >
          <Phone size={16} /> <span>+55 21 96623-8378</span>
        </a>
      </footer>

      {/* Botão flutuante WhatsApp */}
      <motion.a
        href="https://wa.me/5521966238378?text=Olá,+preciso+de+ajuda+com+meu+acesso+MUNDO+PLAY+TV"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full p-4 shadow-lg shadow-yellow-500/40 flex items-center justify-center transition-transform transform hover:scale-110"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <MessageCircle size={28} />
      </motion.a>
    </div>
  );
};

export default Index;

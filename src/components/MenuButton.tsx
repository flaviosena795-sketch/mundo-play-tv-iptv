import { MoreVertical, Home, CreditCard, MessageCircle, HelpCircle, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MenuButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full hover:bg-accent transition">
          <MoreVertical className="w-6 h-6 text-white" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <a href="#inicio" className="flex items-center gap-2">
            <Home className="w-4 h-4" /> Início
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="#planos" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Planos
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="#teste" className="flex items-center gap-2">
            <Video className="w-4 h-4" /> Teste Grátis
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="#suporte" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Suporte
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href="https://wa.me/5521966238378"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuButton;

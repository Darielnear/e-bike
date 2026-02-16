import { useState, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ text: "Benvenuto su Cicli Volante! Come possiamo aiutarti oggi?", isBot: true }]);
      }, 500);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg hover-elevate"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      ) : (
        <div className="bg-card border rounded-2xl shadow-2xl w-80 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4">
          <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
            <span className="font-bold text-sm">Supporto Cicli Volante</span>
            <button onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></button>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-secondary/10">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg text-xs ${m.isBot ? 'bg-secondary border' : 'bg-primary text-primary-foreground'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input type="text" placeholder="Scrivi un messaggio..." className="flex-1 text-xs bg-secondary/30 border rounded px-2 py-1 focus:outline-none" />
            <Button size="icon" className="h-8 w-8"><Send className="w-3 h-3" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

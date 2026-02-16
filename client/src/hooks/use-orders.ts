import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useCreateOrder() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: any) => {
      try {
        const res = await fetch("/send_order.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!res.ok) {
          throw new Error("Errore server: " + res.status);
        }

        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON response:", text);
          throw new Error("Risposta del server non valida");
        }
      } catch (error: any) {
        throw new Error(error.message || "Errore durante l'invio dell'ordine");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useOrder(orderNumber: string) {
  // Mock order fetch for tracking since we are now static/PHP
  return { data: null, isLoading: false };
}

export function useOrders() {
  return { data: [], isLoading: false };
}

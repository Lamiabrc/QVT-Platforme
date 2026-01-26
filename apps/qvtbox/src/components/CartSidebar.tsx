import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

const CartSidebar = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalItems } = useCart();

  const total = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace('€', ''));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-gradient-hero border-white/20 text-foreground">
        <SheetHeader>
          <SheetTitle className="text-foreground font-kalam flex items-center gap-2">
            🛒 Mon Panier 
            {totalItems > 0 && (
              <Badge className="bg-gradient-accent text-white">
                {totalItems}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/70 mb-4">Votre panier est vide</p>
              <Button 
                onClick={() => setIsOpen(false)}
                className="bg-gradient-accent hover:opacity-90 text-white"
              >
                Continuer mes achats
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="bg-white/10 rounded-lg p-4 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/70 hover:text-foreground p-1 h-auto"
                      >
                        ✕
                      </Button>
                    </div>
                    <p className="text-xs text-foreground/60 mb-2">{item.origin}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0 bg-white/10 border-white/20 text-foreground"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-sm text-foreground">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 bg-white/10 border-white/20 text-foreground"
                        >
                          +
                        </Button>
                      </div>
                      <span className="font-medium text-accent">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-foreground">Total :</span>
                  <span className="font-bold text-xl text-accent">{total}€</span>
                </div>
                
                <div className="space-y-2">
                  <Link to="/checkout" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-accent hover:opacity-90 text-white">
                      Finaliser la commande
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-white/10 border-white/20 text-foreground hover:bg-white/20"
                  >
                    Continuer mes achats
                  </Button>
                </div>
                
                {total >= 80 && (
                  <p className="text-xs text-center text-accent mt-2">
                    🎉 Livraison gratuite !
                  </p>
                )}
                {total < 80 && (
                  <p className="text-xs text-center text-foreground/60 mt-2">
                    Plus que {80 - total}€ pour la livraison gratuite
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
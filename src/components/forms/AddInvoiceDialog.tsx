import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (invoice: any) => void;
}

export const AddInvoiceDialog = ({ open, onOpenChange, onAdd }: AddInvoiceDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    client: "",
    amount: "",
    items: "",
    status: "En attente",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client || !formData.amount || !formData.items) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);

    const invoiceNumber = `INV-${today.getFullYear()}-${String(Date.now()).slice(-3)}`;

    const newInvoice = {
      id: invoiceNumber,
      client: formData.client,
      amount: formData.amount,
      date: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: formData.status,
      items: parseInt(formData.items),
    };

    onAdd(newInvoice);
    toast({
      title: "Succès !",
      description: `Facture ${invoiceNumber} créée avec succès`,
    });
    
    setFormData({ client: "", amount: "", items: "", status: "En attente" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une Facture</DialogTitle>
          <DialogDescription>
            Remplissez les informations de la nouvelle facture
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="client">Nom du client *</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              placeholder="Tech Solutions Inc"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant *</Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="1,500 €"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="items">Nombre d'articles *</Label>
            <Input
              id="items"
              type="number"
              min="1"
              value={formData.items}
              onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              placeholder="3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Payée">Payée</SelectItem>
                <SelectItem value="En retard">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Date d'émission :</strong> {new Date().toLocaleDateString('fr-FR')}<br />
              <strong>Date d'échéance :</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Créer la facture
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

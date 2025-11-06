import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, MapPin, TrendingUp } from "lucide-react";
import { AddClientDialog } from "@/components/forms/AddClientDialog";

const Clients = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clients, setClients] = useState([
    { 
      id: 1, 
      name: "Tech Solutions Inc", 
      industry: "Technologie", 
      email: "contact@techsolutions.com", 
      phone: "+33 1 23 45 67 89",
      address: "15 Rue de la Tech, 75001 Paris",
      revenue: "145,000 €",
      invoices: 24,
      status: "Premium"
    },
    { 
      id: 2, 
      name: "Digital Marketing Pro", 
      industry: "Marketing", 
      email: "hello@digitalmarketing.com", 
      phone: "+33 1 34 56 78 90",
      address: "8 Avenue du Digital, 69002 Lyon",
      revenue: "89,000 €",
      invoices: 18,
      status: "Standard"
    },
    { 
      id: 3, 
      name: "Startup Innovate", 
      industry: "Innovation", 
      email: "team@startupinnovate.fr", 
      phone: "+33 4 45 67 89 01",
      address: "22 Boulevard Innovation, 31000 Toulouse",
      revenue: "67,500 €",
      invoices: 12,
      status: "Premium"
    },
    { 
      id: 4, 
      name: "Global Retail Ltd", 
      industry: "Commerce", 
      email: "info@globalretail.com", 
      phone: "+33 5 56 78 90 12",
      address: "45 Place du Commerce, 33000 Bordeaux",
      revenue: "234,000 €",
      invoices: 36,
      status: "Premium"
    },
  ]);

  const handleAddClient = (newClient: any) => {
    setClients([newClient, ...clients]);
  };

  return (
    <div className="p-8">
      <PageHeader 
        title="Gestion des Clients" 
        description="Portfolio complet de vos clients"
        action={{
          label: "Ajouter un client",
          onClick: () => setDialogOpen(true),
        }}
      />

      <AddClientDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAddClient}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">{client.industry}</p>
                  </div>
                </div>
                <Badge 
                  variant={client.status === "Premium" ? "default" : "secondary"}
                  className={client.status === "Premium" ? "bg-accent text-accent-foreground" : ""}
                >
                  {client.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{client.address}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Chiffre d'affaires</p>
                    <p className="text-lg font-bold text-foreground flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      {client.revenue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Factures émises</p>
                    <p className="text-lg font-bold text-foreground">{client.invoices}</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Voir les détails
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clients;

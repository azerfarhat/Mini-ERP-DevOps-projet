import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, DollarSign, User, Download, Eye } from "lucide-react";
import { AddInvoiceDialog } from "@/components/forms/AddInvoiceDialog";

const Invoices = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invoices, setInvoices] = useState([
    { 
      id: "INV-2025-001", 
      client: "Tech Solutions Inc", 
      amount: "12,500 €",
      date: "2025-11-05",
      dueDate: "2025-12-05",
      status: "Payée",
      items: 5
    },
    { 
      id: "INV-2025-002", 
      client: "Digital Marketing Pro", 
      amount: "8,300 €",
      date: "2025-11-04",
      dueDate: "2025-12-04",
      status: "En attente",
      items: 3
    },
    { 
      id: "INV-2025-003", 
      client: "Startup Innovate", 
      amount: "15,700 €",
      date: "2025-11-03",
      dueDate: "2025-12-03",
      status: "Payée",
      items: 7
    },
    { 
      id: "INV-2025-004", 
      client: "Global Retail Ltd", 
      amount: "22,100 €",
      date: "2025-11-02",
      dueDate: "2025-12-02",
      status: "En attente",
      items: 9
    },
    { 
      id: "INV-2025-005", 
      client: "Tech Solutions Inc", 
      amount: "9,800 €",
      date: "2025-11-01",
      dueDate: "2025-12-01",
      status: "En retard",
      items: 4
    },
    { 
      id: "INV-2025-006", 
      client: "Digital Marketing Pro", 
      amount: "6,500 €",
      date: "2025-10-30",
      dueDate: "2025-11-30",
      status: "Payée",
      items: 2
    },
  ]);

  const handleAddInvoice = (newInvoice: any) => {
    setInvoices([newInvoice, ...invoices]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Payée":
        return "bg-green-100 text-green-700";
      case "En attente":
        return "bg-yellow-100 text-yellow-700";
      case "En retard":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="p-8">
      <PageHeader 
        title="Gestion des Factures" 
        description="Suivez vos factures et paiements"
        action={{
          label: "Nouvelle facture",
          onClick: () => setDialogOpen(true),
        }}
      />

      <AddInvoiceDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAddInvoice}
      />

      <div className="grid grid-cols-1 gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground">{invoice.id}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {invoice.client}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Montant</p>
                    <p className="text-xl font-bold text-foreground flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-accent" />
                      {invoice.amount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date d'émission</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(invoice.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date d'échéance</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Statut</p>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Invoices;

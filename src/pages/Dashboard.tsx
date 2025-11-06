import { PageHeader } from "@/components/PageHeader";
import { StatsCard } from "@/components/StatsCard";
import { Users, UserCircle, Package, FileText, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const stats = [
    { title: "Total Employés", value: "48", icon: Users, trend: { value: "+12%", isPositive: true } },
    { title: "Clients Actifs", value: "234", icon: UserCircle, trend: { value: "+8%", isPositive: true } },
    { title: "Produits en Stock", value: "1,245", icon: Package, trend: { value: "-3%", isPositive: false } },
    { title: "Factures ce Mois", value: "89", icon: FileText, trend: { value: "+24%", isPositive: true } },
  ];

  const recentInvoices = [
    { id: "INV-001", client: "Tech Solutions Inc", amount: "12,500 €", status: "Payée", date: "2025-11-05" },
    { id: "INV-002", client: "Digital Marketing Pro", amount: "8,300 €", status: "En attente", date: "2025-11-04" },
    { id: "INV-003", client: "Startup Innovate", amount: "15,700 €", status: "Payée", date: "2025-11-03" },
    { id: "INV-004", client: "Global Retail Ltd", amount: "22,100 €", status: "En attente", date: "2025-11-02" },
  ];

  return (
    <div className="p-8">
      <PageHeader 
        title="Tableau de Bord" 
        description="Vue d'ensemble de votre entreprise"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Revenus Mensuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ce mois</span>
                <span className="text-2xl font-bold text-foreground">58,600 €</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-hero h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Objectif: 80,000 €</span>
                <span className="text-green-600 font-medium">+32% vs mois dernier</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Factures Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{invoice.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      invoice.status === "Payée" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

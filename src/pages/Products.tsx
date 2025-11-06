import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { AddProductDialog } from "@/components/forms/AddProductDialog";

const Products = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: "Logiciel CRM Premium", 
      category: "Software", 
      price: "499 €",
      stock: 150,
      sales: 89,
      status: "En stock",
      trend: "+12%"
    },
    { 
      id: 2, 
      name: "Service Consulting", 
      category: "Service", 
      price: "150 €/h",
      stock: 999,
      sales: 234,
      status: "Disponible",
      trend: "+28%"
    },
    { 
      id: 3, 
      name: "Formation Développement Web", 
      category: "Formation", 
      price: "1,200 €",
      stock: 45,
      sales: 67,
      status: "En stock",
      trend: "+15%"
    },
    { 
      id: 4, 
      name: "Licence Entreprise", 
      category: "License", 
      price: "2,500 €",
      stock: 12,
      sales: 34,
      status: "Stock bas",
      trend: "+8%"
    },
    { 
      id: 5, 
      name: "Support Technique Annuel", 
      category: "Service", 
      price: "850 €",
      stock: 999,
      sales: 156,
      status: "Disponible",
      trend: "+22%"
    },
    { 
      id: 6, 
      name: "Audit de Sécurité", 
      category: "Service", 
      price: "3,500 €",
      stock: 999,
      sales: 45,
      status: "Disponible",
      trend: "+35%"
    },
    // 🆕🆕 Nouveau produit ajoutééééééééé
    { 
      id: 7, 
      name: "Pack Hébergement Cloud", 
      category: "Infrastructure", 
      price: "299 €/an",
      stock: 80,
      sales: 52,
      status: "En stock",
      trend: "+18%"
    },
  ]);

  // Fonction pour ajouter un produit (par le formulaire AddProductDialog)
  const handleAddProduct = (newProduct: any) => {
    setProducts([newProduct, ...products]);
  };

  return (
    <div className="p-8">
      <PageHeader 
        title="Catalogue Produits" 
        description="Gérez votre gamme de produits et services"
        action={{
          label: "Ajouter un produit",
          onClick: () => setDialogOpen(true),
        }}
      />

      {/* Fenêtre modale d’ajout de produit */}
      <AddProductDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAddProduct}
      />

      {/* Liste des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="shadow-card hover:shadow-elevated transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary">{product.category}</Badge>
              </div>

              <h3 className="font-bold text-lg text-foreground mb-2">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold text-foreground">
                  {product.price}
                </span>
              </div>

              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stock disponible</span>
                  <span className="font-semibold text-foreground">{product.stock}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ventes totales</span>
                  <span className="font-semibold text-foreground">{product.sales}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tendance</span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {product.trend}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge 
                  variant={product.status === "Stock bas" ? "destructive" : "default"}
                  className={
                    product.status === "En stock" 
                      ? "bg-green-100 text-green-700" 
                      : product.status === "Disponible" 
                      ? "bg-primary/10 text-primary" 
                      : ""
                  }
                >
                  {product.status === "Stock bas" && <AlertCircle className="w-3 h-3 mr-1" />}
                  {product.status}
                </Badge>

                <Button variant="ghost" size="sm">
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;

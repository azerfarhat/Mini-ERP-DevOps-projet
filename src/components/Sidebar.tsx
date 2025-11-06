import { NavLink } from "./NavLink";
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Package, 
  FileText 
} from "lucide-react";

export const Sidebar = () => {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/employees", icon: Users, label: "Employés" },
    { to: "/clients", icon: UserCircle, label: "Clients" },
    { to: "/products", icon: Package, label: "Produits" },
    { to: "/invoices", icon: FileText, label: "Factures" },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Mini ERP
        </h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Système de Gestion</p>
      </div>
      
      <nav className="px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MoreVertical } from "lucide-react";
import { AddEmployeeDialog } from "@/components/forms/AddEmployeeDialog";

const Employees = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employees, setEmployees] = useState([
    { id: 1, name: "Sophie Dubois", role: "Directrice Générale", department: "Direction", email: "sophie@company.com", phone: "+33 6 12 34 56 78", status: "Actif" },
    { id: 2, name: "Marc Lefebvre", role: "Développeur Senior", department: "IT", email: "marc@company.com", phone: "+33 6 23 45 67 89", status: "Actif" },
    { id: 3, name: "Julie Martin", role: "Chef de Projet", department: "Marketing", email: "julie@company.com", phone: "+33 6 34 56 78 90", status: "Actif" },
    { id: 4, name: "Thomas Bernard", role: "Comptable", department: "Finance", email: "thomas@company.com", phone: "+33 6 45 67 89 01", status: "Actif" },
    { id: 5, name: "Emma Petit", role: "Designer UI/UX", department: "Design", email: "emma@company.com", phone: "+33 6 56 78 90 12", status: "Actif" },
    { id: 6, name: "Lucas Moreau", role: "Développeur", department: "IT", email: "lucas@company.com", phone: "+33 6 67 89 01 23", status: "En congé" },
  ]);

  const handleAddEmployee = (newEmployee: any) => {
    setEmployees([newEmployee, ...employees]);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  return (
    <div className="p-8">
      <PageHeader 
        title="Gestion des Employés" 
        description="Liste complète de vos collaborateurs"
        action={{
          label: "Ajouter un employé",
          onClick: () => setDialogOpen(true),
        }}
      />

      <AddEmployeeDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAddEmployee}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id} className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Avatar className="w-14 h-14 bg-gradient-hero">
                  <AvatarFallback className="bg-transparent text-white font-semibold">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              
              <h3 className="font-bold text-lg text-foreground mb-1">{employee.name}</h3>
              <p className="text-sm text-primary font-medium mb-1">{employee.role}</p>
              <Badge variant="secondary" className="mb-4">{employee.department}</Badge>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{employee.phone}</span>
                </div>
              </div>

              <div className="mt-4">
                <Badge 
                  variant={employee.status === "Actif" ? "default" : "secondary"}
                  className={employee.status === "Actif" ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}
                >
                  {employee.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Employees;

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Shield, User, Crown, Trash2, UserPlus } from 'lucide-react';
import type { UserRole } from '@/hooks/useUserRole';

// Only use roles that exist in the database
type DatabaseUserRole = 'admin' | 'user';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: DatabaseUserRole;
  created_at: string;
  last_sign_in_at: string | null;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get all users with their roles
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      if (rolesError) throw rolesError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');
      if (profilesError && profilesError.code !== 'PGRST116') throw profilesError;

      // Combine the data
      const combinedUsers = usersData.users.map(user => {
        const userRole = rolesData.find(role => role.user_id === user.id);
        const profile = profilesData?.find(p => p.id === user.id);
        
        return {
          id: user.id,
          email: user.email || '',
          full_name: profile?.full_name || user.user_metadata?.full_name || 'Utilisateur',
          role: (userRole?.role === 'admin' ? 'admin' : 'user') as DatabaseUserRole,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: DatabaseUserRole) => {
    try {
      // First delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: newRole
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Rôle utilisateur mis à jour",
      });

      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive"
      });
    }
  };

  const promoteToAdmin = async (userId: string) => {
    await updateUserRole(userId, 'admin');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleIcon = (role: DatabaseUserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeVariant = (role: DatabaseUserRole) => {
    switch (role) {
      case 'admin':
        return 'default'; // Using default which should be primary color
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Gestion des Utilisateurs
        </CardTitle>
        <CardDescription>
          Gérez les rôles et permissions des utilisateurs de votre plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR')
                      : 'Jamais'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role || 'user'}
                        onValueChange={(value) => updateUserRole(user.id, value as DatabaseUserRole)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Utilisateur</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {user.role !== 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => promoteToAdmin(user.id)}
                          className="flex items-center gap-1"
                        >
                          <Crown className="h-3 w-3" />
                          Promouvoir
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        )}
      </CardContent>
    </Card>
  );
};
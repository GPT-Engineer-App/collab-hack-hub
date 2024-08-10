import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { UserPlus, X, Edit, Save } from "lucide-react"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/components/ui/use-toast"

const supabase = createClient('https://bmkjdankirqsktbkgliy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2pkYW5raXJxc2t0YmtnbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMDQ2MzYsImV4cCI6MjAzODY4MDYzNn0.zQXbChBSwQh_85GHWsEHsnjdGbUiW83EOnpkOsENpPE')

const Team = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [newRole, setNewRole] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('project_id', projectId);
    if (error) console.error('Error fetching team members:', error);
    else setMembers(data);
  };

  const handleAddMember = async () => {
    if (newMember.trim()) {
      const { data, error } = await supabase
        .from('team_members')
        .insert({ name: newMember.trim(), role: newRole.trim(), project_id: projectId })
        .select();
      if (error) {
        console.error('Error adding team member:', error);
        toast({
          title: "Error",
          description: "Failed to add team member. Please try again.",
          variant: "destructive",
        });
      } else {
        setMembers([...members, data[0]]);
        setNewMember('');
        setNewRole('');
        toast({
          title: "Success",
          description: "Team member added successfully.",
        });
      }
    }
  };

  const handleRemoveMember = async (id) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error removing team member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive",
      });
    } else {
      setMembers(members.filter(member => member.id !== id));
      toast({
        title: "Success",
        description: "Team member removed successfully.",
      });
    }
  };

  const handleEditMember = (member) => {
    setEditingMember({ ...member });
  };

  const handleSaveEdit = async () => {
    const { error } = await supabase
      .from('team_members')
      .update({ name: editingMember.name, role: editingMember.role })
      .eq('id', editingMember.id);
    if (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member. Please try again.",
        variant: "destructive",
      });
    } else {
      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
      setEditingMember(null);
      toast({
        title: "Success",
        description: "Team member updated successfully.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter member name"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          />
          <Input
            placeholder="Enter member role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <Button onClick={handleAddMember}>
            <UserPlus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              {editingMember && editingMember.id === member.id ? (
                <>
                  <div className="flex-1 mr-2">
                    <Input
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="mb-2"
                    />
                    <Input
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSaveEdit}>
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-semibold">{member.name}</span>
                    {member.role && <span className="ml-2 text-sm text-gray-600">({member.role})</span>}
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => handleEditMember(member)} className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Team;

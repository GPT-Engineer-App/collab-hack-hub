import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { UserPlus, X } from "lucide-react"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://bmkjdankirqsktbkgliy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2pkYW5raXJxc2t0YmtnbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMDQ2MzYsImV4cCI6MjAzODY4MDYzNn0.zQXbChBSwQh_85GHWsEHsnjdGbUiW83EOnpkOsENpPE')

const Team = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');

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
        .insert({ name: newMember.trim(), project_id: projectId })
        .select();
      if (error) console.error('Error adding team member:', error);
      else {
        setMembers([...members, data[0]]);
        setNewMember('');
      }
    }
  };

  const handleRemoveMember = async (id) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    if (error) console.error('Error removing team member:', error);
    else setMembers(members.filter(member => member.id !== id));
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
          <Button onClick={handleAddMember}>
            <UserPlus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{member.name}</span>
              <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Team;

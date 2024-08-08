import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { UserPlus, X } from "lucide-react"

const Team = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');

  const handleAddMember = () => {
    if (newMember.trim()) {
      setMembers([...members, { name: newMember.trim(), id: Date.now() }]);
      setNewMember('');
    }
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter(member => member.id !== id));
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

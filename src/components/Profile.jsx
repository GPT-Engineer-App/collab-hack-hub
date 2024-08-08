import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, X } from "lucide-react"

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="flex space-x-2">
              <Input
                id="skills"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
              />
              <Button onClick={handleAddSkill}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-xs">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <Button className="w-full">Save Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, X, Save, Trash2 } from "lucide-react"
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/components/ui/use-toast"

import { supabase } from '../integrations/supabase';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    id: '',
    username: '',
    email: '',
    profilepicture: '',
    bio: '',
    location: '',
    website: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile. Please try again.",
        variant: "destructive",
      });
    } else {
      setProfile(data);
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      const updatedSkills = [...profile.skills, newSkill.trim()];
      setProfile({ ...profile, skills: updatedSkills });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    const updatedSkills = profile.skills.filter(s => s !== skill);
    setProfile({ ...profile, skills: updatedSkills });
  };

  const handleSaveProfile = async () => {
    const { error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', user.id);
    if (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      
      // Add notification for successful profile update
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          userid: user.id,
          message: 'Your profile has been updated successfully.',
          type: 'profile_update',
          isread: false
        });
      
      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const { error: deleteError } = await signOut();
        if (deleteError) throw deleteError;

        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
        if (authError) throw authError;

        toast({
          title: "Success",
          description: "Your account has been deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting account:', error);
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <Input
              id="username"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              id="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="profilepicture" className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
            <Input
              id="profilepicture"
              name="profilepicture"
              value={profile.profilepicture}
              onChange={handleInputChange}
              placeholder="Enter profile picture URL"
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
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <Input
              id="location"
              name="location"
              value={profile.location}
              onChange={handleInputChange}
              placeholder="Enter your location"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <Input
              id="website"
              name="website"
              value={profile.website}
              onChange={handleInputChange}
              placeholder="Enter your website URL"
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
              {profile.skills && profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-xs">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" /> Save Profile
            </Button>
            <Button variant="destructive" onClick={handleDeleteProfile}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;

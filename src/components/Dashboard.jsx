import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";

const supabase = createClient('https://bmkjdankirqsktbkgliy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2pkYW5raXJxc2t0YmtnbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMDQ2MzYsImV4cCI6MjAzODY4MDYzNn0.zQXbChBSwQh_85GHWsEHsnjdGbUiW83EOnpkOsENpPE');

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`created_by.eq.${user.id},id.in.(${
        supabase.from('project_members').select('project_id').eq('user_id', user.id)
      })`);
    if (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      });
    } else {
      setProjects(data);
      if (data.length === 0) {
        toast({
          title: "No Projects",
          description: "You don't have any projects yet. Create a new one to get started!",
        });
      }
    }
  };

  const createProject = async () => {
    if (newProjectName.trim()) {
      const { data, error } = await supabase
        .from('projects')
        .insert({ name: newProjectName.trim(), created_by: user.id })
        .select();
      if (error) {
        console.error('Error creating project:', error);
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive",
        });
      } else {
        await supabase.from('project_members').insert({ project_id: data[0].id, user_id: user.id });
        setProjects([...projects, data[0]]);
        setNewProjectName('');
        toast({
          title: "Success",
          description: `Project "${data[0].name}" created successfully!`,
        });
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <Button onClick={createProject}>Create</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link key={project.id} to={`/project/${project.id}`}>
                <Button variant="outline" className="w-full mb-2 justify-start">
                  {project.name}
                </Button>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No projects found. Create a new one to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

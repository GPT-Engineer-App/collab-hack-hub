import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { PlusCircle, Users, Lightbulb, BarChart, UserCircle, MessageSquare, FileText, Database, Bell, LogOut } from "lucide-react"
import Team from '../components/Team';
import Ideas from '../components/Ideas';
import Progress from '../components/Progress';
import Profile from '../components/Profile';
import ProjectManagement from '../components/ProjectManagement';
import Collaboration from '../components/Collaboration';
import ContentManagement from '../components/ContentManagement';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/components/ui/use-toast"

const supabase = createClient('https://bmkjdankirqsktbkgliy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2pkYW5raXJxc2t0YmtnbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMDQ2MzYsImV4cCI6MjAzODY4MDYzNn0.zQXbChBSwQh_85GHWsEHsnjdGbUiW83EOnpkOsENpPE')

const Index = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [tables, setTables] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchTables();
      fetchNotifications();
    }
  }, [user]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`created_by.eq.${user.id},id.in.(${
        supabase.from('project_members').select('project_id').eq('user_id', user.id)
      })`);
    if (error) console.error('Error fetching projects:', error);
    else setProjects(data);
  };

  const fetchTables = async () => {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    if (error) console.error('Error fetching tables:', error);
    else setTables(data.map(table => table.table_name));
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('userid', user.id)
      .order('createdat', { ascending: false });
    if (error) console.error('Error fetching notifications:', error);
    else setNotifications(data);
  };

  const markNotificationAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ isread: true })
      .eq('id', notificationId);
    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isread: true } : n
      ));
    }
  };

  const handleCreateProject = async () => {
    if (newProject.trim()) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert({ name: newProject.trim(), created_by: user.id, description: '' })
          .select();
        if (error) throw error;
        
        const newProject = data[0];
        
        // Add the creator as a project member
        const { error: memberError } = await supabase
          .from('project_members')
          .insert({ project_id: newProject.id, user_id: user.id, role: 'creator' });
        
        if (memberError) throw memberError;
        
        setProjects([...projects, newProject]);
        setNewProject('');
        setActiveProject(newProject);
        setActiveTab('team');
        toast({
          title: "Project Created",
          description: `You've successfully created the project: ${newProject.name}`,
        });
      } catch (error) {
        console.error('Error creating project:', error);
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleJoinProject = async (projectId) => {
    const { data, error } = await supabase
      .from('project_members')
      .insert({ project_id: projectId, user_id: user.id })
      .select();
    if (error) {
      console.error('Error joining project:', error);
      toast({
        title: "Error",
        description: "Failed to join the project. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Project Joined",
        description: "You've successfully joined the project!",
      });
      fetchProjects(); // Refresh the projects list
    }
  };

  const renderActiveTab = () => {
    if (!activeProject && activeTab !== 'profile') return null;

    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'team':
        return <Team projectId={activeProject.id} />;
      case 'ideas':
        return <Ideas projectId={activeProject.id} />;
      case 'progress':
        return <Progress projectId={activeProject.id} />;
      case 'management':
        return <ProjectManagement projectId={activeProject.id} />;
      case 'collaboration':
        return <Collaboration projectId={activeProject.id} />;
      case 'content':
        return <ContentManagement projectId={activeProject.id} />;
      case 'database':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {tables.map((table, index) => (
                  <li key={index}>{table}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Hackathon Collaboration Hub</h1>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create a New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Input
                    placeholder="Enter project name"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                  />
                  <Button onClick={handleCreateProject}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Project
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <Button
                        variant={activeProject?.id === project.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveProject(project);
                          setActiveTab('team');
                        }}
                      >
                        {project.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{activeProject ? activeProject.name : 'Welcome to Hackathon Hub'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant={activeTab === 'profile' ? "default" : "outline"} onClick={() => setActiveTab('profile')}>
                    <UserCircle className="mr-2 h-4 w-4" /> Profile
                  </Button>
                  {activeProject && (
                    <>
                      <Button variant={activeTab === 'team' ? "default" : "outline"} onClick={() => setActiveTab('team')}>
                        <Users className="mr-2 h-4 w-4" /> Team
                      </Button>
                      <Button variant={activeTab === 'ideas' ? "default" : "outline"} onClick={() => setActiveTab('ideas')}>
                        <Lightbulb className="mr-2 h-4 w-4" /> Ideas
                      </Button>
                      <Button variant={activeTab === 'progress' ? "default" : "outline"} onClick={() => setActiveTab('progress')}>
                        <BarChart className="mr-2 h-4 w-4" /> Progress
                      </Button>
                      <Button variant={activeTab === 'management' ? "default" : "outline"} onClick={() => setActiveTab('management')}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Management
                      </Button>
                      <Button variant={activeTab === 'collaboration' ? "default" : "outline"} onClick={() => setActiveTab('collaboration')}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Collaboration
                      </Button>
                      <Button variant={activeTab === 'content' ? "default" : "outline"} onClick={() => setActiveTab('content')}>
                        <FileText className="mr-2 h-4 w-4" /> Content
                      </Button>
                      <Button variant={activeTab === 'database' ? "default" : "outline"} onClick={() => setActiveTab('database')}>
                        <Database className="mr-2 h-4 w-4" /> Database
                      </Button>
                    </>
                  )}
                </div>
                {renderActiveTab()}
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4" />
                        <span>{notification.message}</span>
                      </div>
                      {!notification.isread && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

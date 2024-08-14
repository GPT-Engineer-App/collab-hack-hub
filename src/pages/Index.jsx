import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import RecentActivities from '../components/RecentActivities';
import { Input } from "@/components/ui/input"
import DashboardSummary from '../components/DashboardSummary';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Users, Lightbulb, BarChart, UserCircle, MessageSquare, FileText, Database, Bell, LogOut, Home, Settings, Search, Edit, Trash2, Menu } from "lucide-react"
import Team from '../components/Team';
import Ideas from '../components/Ideas';
import Progress from '../components/Progress';
import Profile from '../components/Profile';
import ProjectManagement from '../components/ProjectManagement';
import Collaboration from '../components/Collaboration';
import ContentManagement from '../components/ContentManagement';
import TaskManagement from '../components/TaskManagement';
import Notifications from '../components/Notifications';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/components/ui/use-toast"

import { supabase } from '../integrations/supabase';

const Index = () => {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tables, setTables] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          await Promise.all([fetchProjects(), fetchAllProjects(), fetchTables(), fetchNotifications()]);
        } catch (err) {
          setError('Failed to fetch data. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // ... (keep all the existing functions)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    // ... (keep the existing renderContent function)
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out md:w-64 bg-white shadow-md overflow-y-auto z-40`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Hackathon Hub</h1>
          <Button variant="outline" className="w-full mb-4" onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button variant="outline" className="w-full mb-4" onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}>
            <UserCircle className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button variant="outline" className="w-full mb-4" onClick={() => { setActiveTab('browseProjects'); setSidebarOpen(false); }}>
            <Search className="mr-2 h-4 w-4" /> Browse Projects
          </Button>
        </div>
        {user && (
          <div className="p-4 border-t">
            <h2 className="font-semibold mb-2">Your Projects</h2>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.id}>
                  <Button
                    variant={activeProject?.id === project.id ? "default" : "ghost"}
                    className="w-full justify-start mb-2"
                    onClick={() => {
                      setActiveProject(project);
                      setActiveTab('projectDashboard');
                      setSidebarOpen(false);
                    }}
                  >
                    {project.name}
                  </Button>
                  {activeProject?.id === project.id && (
                    <ul className="ml-4 space-y-2">
                      <li>
                        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setActiveTab('tasks'); setSidebarOpen(false); }}>
                          Tasks
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setActiveTab('team'); setSidebarOpen(false); }}>
                          Team Members
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setActiveTab('documents'); setSidebarOpen(false); }}>
                          Documents
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setActiveTab('collaboration'); setSidebarOpen(false); }}>
                          Real-Time Collaboration
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setActiveTab('projectSettings'); setSidebarOpen(false); }}>
                          Project Settings
                        </Button>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4" onClick={() => { setActiveTab('newProject'); setSidebarOpen(false); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{activeProject ? activeProject.name : 'Dashboard'}</h2>
            {user ? (
              <Button variant="outline" onClick={async () => {
                await signOut();
                navigate('/signin');
              }}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/signin')}>
                <LogOut className="mr-2 h-4 w-4" /> Sign In
              </Button>
            )}
          </div>

          {user && activeProject && (
            <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
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
                <Settings className="mr-2 h-4 w-4" /> Management
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
            </div>
          )}

          {user ? (
            activeTab === 'newProject' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      id="newProjectName"
                      name="newProjectName"
                      placeholder="Enter project name"
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                    />
                    <Button onClick={handleCreateProject}>Create Project</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              renderContent()
            )
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Hackathon Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sign in to start collaborating on exciting hackathon projects!</p>
                <Button className="mt-4" onClick={() => navigate('/signin')}>Sign In</Button>
              </CardContent>
            </Card>
          )}

          {user && <Notifications />}
        </div>
      </div>
    </div>
  );
};

export default Index;
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { PlusCircle, Users, Lightbulb, BarChart, UserCircle, MessageSquare, FileText } from "lucide-react"
import Team from '../components/Team';
import Ideas from '../components/Ideas';
import Progress from '../components/Progress';
import Profile from '../components/Profile';
import ProjectManagement from '../components/ProjectManagement';
import Collaboration from '../components/Collaboration';
import ContentManagement from '../components/ContentManagement';

const Index = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const handleCreateProject = () => {
    if (newProject.trim()) {
      const newProjectObj = { name: newProject.trim(), id: Date.now() };
      setProjects([...projects, newProjectObj]);
      setNewProject('');
      setActiveProject(newProjectObj);
      setActiveTab('team');
    }
  };

  const renderActiveTab = () => {
    if (activeTab === 'profile') {
      return <Profile />;
    }
    if (!activeProject) return null;

    switch (activeTab) {
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Hackathon Collaboration Hub</h1>
      
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create a New Project</CardTitle>
            <CardDescription>Start collaborating on your hackathon idea</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter project name"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
              />
              <Button onClick={handleCreateProject}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <Button
                        variant={activeProject?.id === project.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setActiveProject(project)}
                      >
                        {project.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            {activeProject && (
              <Card>
                <CardHeader>
                  <CardTitle>{activeProject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-around mb-4">
                    <Button variant={activeTab === 'profile' ? "default" : "outline"} onClick={() => setActiveTab('profile')}>
                      <UserCircle className="mr-2 h-4 w-4" /> Profile
                    </Button>
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
                  </div>
                  {renderActiveTab()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

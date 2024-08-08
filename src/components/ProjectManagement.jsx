import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, CheckCircle2, XCircle } from "lucide-react"

const ProjectManagement = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask.trim(), id: Date.now(), completed: false }]);
      setNewTask('');
    }
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button onClick={handleAddTask}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className={task.completed ? 'line-through' : ''}>{task.text}</span>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleToggleTask(task.id)}>
                  <CheckCircle2 className={`h-4 w-4 ${task.completed ? 'text-green-500' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveTask(task.id)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ProjectManagement;

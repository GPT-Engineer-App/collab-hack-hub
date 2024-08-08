import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://bmkjdankirqsktbkgliy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2pkYW5raXJxc2t0YmtnbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMDQ2MzYsImV4cCI6MjAzODY4MDYzNn0.zQXbChBSwQh_85GHWsEHsnjdGbUiW83EOnpkOsENpPE');

const TaskManagement = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);
    if (error) console.error('Error fetching tasks:', error);
    else setTasks(data);
  };

  const createTask = async () => {
    if (newTaskName.trim()) {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ name: newTaskName.trim(), project_id: projectId })
        .select();
      if (error) console.error('Error creating task:', error);
      else {
        setTasks([...tasks, data[0]]);
        setNewTaskName('');
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Task Management</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Task Name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
            <Button onClick={createTask}>Create</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.map((task) => (
            <div key={task.id} className="flex justify-between items-center mb-2">
              <span>{task.name}</span>
              <Button variant="outline" size="sm">Complete</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManagement;

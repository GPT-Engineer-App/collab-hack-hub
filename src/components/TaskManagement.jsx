import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useTasks, useAddTask } from '../integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

const TaskManagement = ({ projectId }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const { data: tasks, isLoading, isError } = useTasks(projectId);
  const addTaskMutation = useAddTask();
  const { toast } = useToast();

  const createTask = async () => {
    if (newTaskName.trim()) {
      try {
        await addTaskMutation.mutateAsync({ taskname: newTaskName.trim(), projectid: projectId, status: 'pending' });
        setNewTaskName('');
        toast({ title: "Task created", description: "New task has been added successfully." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to create task. Please try again.", variant: "destructive" });
      }
    }
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (isError) return <div>Error loading tasks</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="New task name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <Button onClick={createTask}>Add Task</Button>
        </div>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-2">
              <Checkbox id={`task-${task.id}`} />
              <label htmlFor={`task-${task.id}`}>{task.name}</label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskManagement;

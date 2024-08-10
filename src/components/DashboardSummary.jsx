import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '../integrations/supabase';

const DashboardSummary = ({ userId }) => {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['dashboardSummary', userId],
    queryFn: async () => {
      const [projectsResponse, tasksResponse, ideasResponse] = await Promise.all([
        supabase.from('projects').select('id').or(`created_by.eq.${userId},id.in.(${supabase.from('project_members').select('project_id').eq('user_id', userId)})`),
        supabase.from('tasks').select('id, status').eq('assignedto', userId),
        supabase.from('ideas').select('id').eq('user_id', userId),
      ]);

      return {
        projectCount: projectsResponse.data?.length || 0,
        pendingTaskCount: tasksResponse.data?.filter(task => task.status === 'pending').length || 0,
        ideaCount: ideasResponse.data?.length || 0,
      };
    },
  });

  if (isLoading) return <div>Loading summary...</div>;
  if (error) return <div>Error loading summary</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{summary.projectCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{summary.pendingTaskCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{summary.ideaCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;

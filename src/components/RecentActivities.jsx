import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '../integrations/supabase';

const RecentActivities = ({ userId }) => {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['recentActivities', userId],
    queryFn: async () => {
      const [tasksResponse, ideasResponse, commentsResponse] = await Promise.all([
        supabase.from('tasks').select('*').eq('assignedto', userId).order('createdat', { ascending: false }).limit(5),
        supabase.from('ideas').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
        supabase.from('comments').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      ]);

      return [
        ...(tasksResponse.data || []).map(task => ({ ...task, type: 'task' })),
        ...(ideasResponse.data || []).map(idea => ({ ...idea, type: 'idea' })),
        ...(commentsResponse.data || []).map(comment => ({ ...comment, type: 'comment' })),
      ].sort((a, b) => new Date(b.createdat || b.created_at) - new Date(a.createdat || a.created_at)).slice(0, 5);
    },
  });

  if (isLoading) return <div>Loading recent activities...</div>;
  if (error) return <div>Error loading recent activities</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-center space-x-2">
              {activity.type === 'task' && <span className="font-bold">New Task:</span>}
              {activity.type === 'idea' && <span className="font-bold">New Idea:</span>}
              {activity.type === 'comment' && <span className="font-bold">New Comment:</span>}
              <span>{activity.taskname || activity.title || activity.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;

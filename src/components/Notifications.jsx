import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useNotifications } from '../integrations/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

const Notifications = () => {
  const { user } = useAuth();
  const { data: notifications, isLoading, isError, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
  const { toast } = useToast();

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      toast({ title: "Notification marked as read", description: "The notification has been updated." });
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({ title: "Error", description: "Failed to mark notification as read. Please try again.", variant: "destructive" });
    }
  };

  if (isLoading) return <div>Loading notifications...</div>;
  if (isError) return <div>Error loading notifications</div>;

  return (
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
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Notifications;

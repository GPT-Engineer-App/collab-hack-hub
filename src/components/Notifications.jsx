import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase';

const Notifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notifications, isLoading, isError } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('userid', user.id)
        .order('createdat', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ isread: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      toast({ title: "Notification marked as read", description: "The notification has been updated." });
      queryClient.invalidateQueries(['notifications', user?.id]);
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
        {notifications && notifications.length > 0 ? (
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
        ) : (
          <p>No notifications at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Notifications;

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useNotifications } from '../integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

const Notifications = () => {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const { toast } = useToast();

  const markAsRead = async (notificationId) => {
    try {
      // Implement the logic to mark a notification as read
      // This might involve calling a mutation function from your Supabase integration
      // For now, we'll just show a toast message
      toast({ title: "Notification marked as read", description: "The notification has been updated." });
      refetch();
    } catch (error) {
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

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivities = ({ userId }) => {
  // Implement the logic to fetch and display recent activities here
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display recent activities here */}
        <p>Recent activities will be shown here.</p>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;

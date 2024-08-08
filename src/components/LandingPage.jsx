import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Welcome to Hackathon Hub</CardTitle>
          <CardDescription className="text-center">Collaborate, Innovate, Create</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Join our platform to collaborate on exciting hackathon projects, share ideas, and build amazing solutions!
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;

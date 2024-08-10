import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { supabase } from '../integrations/supabase';
import { useAuth } from '../contexts/AuthContext';

const Ideas = ({ projectId }) => {
  const [newIdea, setNewIdea] = useState('');
  const [newIdeaTag, setNewIdeaTag] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: ideas, isLoading, error } = useQuery({
    queryKey: ['ideas', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('project_id', projectId)
        .order('votes', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addIdeaMutation = useMutation({
    mutationFn: async (newIdea) => {
      const { data, error } = await supabase
        .from('ideas')
        .insert([newIdea])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ideas', projectId]);
    },
  });

  const voteIdeaMutation = useMutation({
    mutationFn: async ({ id, votes }) => {
      const { data, error } = await supabase
        .from('ideas')
        .update({ votes })
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ideas', projectId]);
    },
  });

  const handleAddIdea = () => {
    if (newIdea.trim()) {
      addIdeaMutation.mutate({
        title: newIdea.trim(),
        description: '',
        project_id: projectId,
        user_id: user.id,
        votes: 0,
        tags: newIdeaTag.trim() ? [newIdeaTag.trim()] : [],
      });
      setNewIdea('');
      setNewIdeaTag('');
    }
  };

  const handleVote = (id, currentVotes, increment) => {
    voteIdeaMutation.mutate({ id, votes: currentVotes + increment });
  };

  if (isLoading) return <div>Loading ideas...</div>;
  if (error) return <div>Error loading ideas</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Ideas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter your idea"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
          />
          <Input
            placeholder="Add a tag"
            value={newIdeaTag}
            onChange={(e) => setNewIdeaTag(e.target.value)}
          />
          <Button onClick={handleAddIdea}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
        <ul className="space-y-2">
          {ideas.map((idea) => (
            <li key={idea.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <div>
                <span className="font-bold">{idea.title}</span>
                {idea.tags && idea.tags.length > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    {idea.tags.join(', ')}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span>{idea.votes}</span>
                <Button variant="ghost" size="sm" onClick={() => handleVote(idea.id, idea.votes, 1)}>
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleVote(idea.id, idea.votes, -1)}>
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Ideas;

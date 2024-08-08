import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, ThumbsUp, ThumbsDown } from "lucide-react"

const Ideas = ({ projectId }) => {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState('');

  const handleAddIdea = () => {
    if (newIdea.trim()) {
      setIdeas([...ideas, { text: newIdea.trim(), id: Date.now(), votes: 0 }]);
      setNewIdea('');
    }
  };

  const handleVote = (id, increment) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, votes: idea.votes + increment } : idea
    ));
  };

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
          <Button onClick={handleAddIdea}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
        <ul className="space-y-2">
          {ideas.map((idea) => (
            <li key={idea.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{idea.text}</span>
              <div className="flex items-center space-x-2">
                <span>{idea.votes}</span>
                <Button variant="ghost" size="sm" onClick={() => handleVote(idea.id, 1)}>
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleVote(idea.id, -1)}>
                  <ThumbsDown className="h-4 w-4" />
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

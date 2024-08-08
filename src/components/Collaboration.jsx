import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Send, MessageSquare } from "lucide-react"

const Collaboration = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage.trim(), id: Date.now(), sender: 'You' }]);
      setNewMessage('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Collaboration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto mb-4 bg-gray-100 p-4 rounded">
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage}>
            <Send className="mr-2 h-4 w-4" /> Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Collaboration;

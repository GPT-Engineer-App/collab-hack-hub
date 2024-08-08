import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Image, Video } from "lucide-react"

const ContentCreation = ({ onSave }) => {
  const [path, setPath] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('');
  const [source, setSource] = useState('');

  const handleSave = () => {
    const meta = { content }; // You might want to add more metadata here
    onSave({ path, meta, type, source });
    setPath('');
    setContent('');
    setType('');
    setSource('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Page</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="mb-4"
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          className="mb-4"
        />
        <Input
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleSave} className="w-full">Save Page</Button>
      </CardContent>
    </Card>
  );
};

export default ContentCreation;

import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Image, Video } from "lucide-react"

const ContentCreation = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    onSave({ title, content, tags });
    setTitle('');
    setContent('');
    setTags([]);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          className="mb-4"
        />
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <Button onClick={handleAddTag}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Tag
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 px-2 py-1 rounded">{tag}</span>
          ))}
        </div>
        <Button onClick={handleSave} className="w-full">Save Content</Button>
      </CardContent>
    </Card>
  );
};

export default ContentCreation;

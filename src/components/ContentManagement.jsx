import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Search } from "lucide-react"
import ContentCreation from './ContentCreation';
import ContentDistribution from './ContentDistribution';

const ContentManagement = ({ projectId }) => {
  const [contents, setContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  const handleSaveContent = (newContent) => {
    setContents([...contents, { ...newContent, id: Date.now() }]);
  };

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!projectId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please select a project to manage content.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <ContentCreation onSave={handleSaveContent} />
      
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search content"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          {filteredContents.length > 0 ? (
            <ul className="space-y-2">
              {filteredContents.map((content) => (
                <li key={content.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{content.title}</span>
                  <Button onClick={() => setSelectedContent(content)}>
                    <Search className="mr-2 h-4 w-4" /> View
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No content found. Create some content to get started!</p>
          )}
        </CardContent>
      </Card>

      {selectedContent && (
        <ContentDistribution content={selectedContent} />
      )}
    </div>
  );
};

export default ContentManagement;

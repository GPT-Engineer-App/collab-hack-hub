import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Search } from "lucide-react"
import ContentCreation from './ContentCreation';
import ContentDistribution from './ContentDistribution';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://bmkjdankirqsktbkgliy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2pkYW5raXJxc2t0YmtnbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMDQ2MzYsImV4cCI6MjAzODY4MDYzNn0.zQXbChBSwQh_85GHWsEHsnjdGbUiW83EOnpkOsENpPE')

const ContentManagement = () => {
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('nods_page')
      .select('*');
    if (error) console.error('Error fetching pages:', error);
    else setPages(data);
  };

  const handleSavePage = async (newPage) => {
    const { data, error } = await supabase
      .from('nods_page')
      .insert({ path: newPage.path, meta: newPage.meta, type: newPage.type, source: newPage.source })
      .select();
    if (error) console.error('Error saving page:', error);
    else {
      setPages([...pages, data[0]]);
    }
  };

  const filteredPages = pages.filter(page =>
    page.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (page.meta && JSON.stringify(page.meta).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <ContentCreation onSave={handleSavePage} />
      
      <Card>
        <CardHeader>
          <CardTitle>Page Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search pages"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <ul className="space-y-2">
            {filteredPages.map((page) => (
              <li key={page.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{page.path}</span>
                <Button onClick={() => setSelectedPage(page)}>
                  <Search className="mr-2 h-4 w-4" /> View
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {selectedPage && (
        <ContentDistribution content={selectedPage} />
      )}
    </div>
  );
};

export default ContentManagement;

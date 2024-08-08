import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Share2, Mail, Twitter, Facebook, Linkedin } from "lucide-react"
import { TwitterShareButton, FacebookShareButton, LinkedinShareButton } from "react-share";

const ContentDistribution = ({ content }) => {
  const [email, setEmail] = useState('');
  const shareUrl = "https://yourdomain.com/content/" + content.id; // Replace with actual URL

  const handleEmailShare = () => {
    // Implement email sharing logic here
    console.log(`Sharing content to ${email}`);
    setEmail('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribute Content</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">{content.title}</h3>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleEmailShare}>
            <Mail className="mr-2 h-4 w-4" /> Share via Email
          </Button>
        </div>
        <div className="flex space-x-2">
          <TwitterShareButton url={shareUrl} title={content.title}>
            <Button variant="outline">
              <Twitter className="mr-2 h-4 w-4" /> Twitter
            </Button>
          </TwitterShareButton>
          <FacebookShareButton url={shareUrl} quote={content.title}>
            <Button variant="outline">
              <Facebook className="mr-2 h-4 w-4" /> Facebook
            </Button>
          </FacebookShareButton>
          <LinkedinShareButton url={shareUrl} title={content.title}>
            <Button variant="outline">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </Button>
          </LinkedinShareButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentDistribution;

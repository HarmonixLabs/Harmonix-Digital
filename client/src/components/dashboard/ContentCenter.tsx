import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Image, Video, Hash, Send, Clock, CheckCircle,
  Instagram, Linkedin, Twitter, Facebook, Youtube, Globe,
  Edit, Eye, Trash2, Download, Upload, Calendar as CalendarIcon
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'post' | 'reel' | 'story' | 'article' | 'video';
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
  platforms: string[];
  scheduledDate?: Date;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'AI Agents: The Future of Business Automation',
    type: 'article',
    status: 'published',
    platforms: ['LinkedIn', 'Blog'],
    engagement: { likes: 342, comments: 28, shares: 45, views: 2841 }
  },
  {
    id: '2',
    title: 'Behind the Scenes: Building CA$H',
    type: 'reel',
    status: 'scheduled',
    platforms: ['Instagram', 'TikTok'],
    scheduledDate: new Date(Date.now() + 86400000 * 2)
  },
  {
    id: '3',
    title: 'Weekly Tips: Maximizing Agent Performance',
    type: 'post',
    status: 'review',
    platforms: ['Twitter', 'LinkedIn']
  },
  {
    id: '4',
    title: 'Customer Success Story: 10x Revenue Growth',
    type: 'video',
    status: 'draft',
    platforms: ['YouTube', 'LinkedIn']
  }
];

const platformIcons: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="h-4 w-4" />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
  Twitter: <Twitter className="h-4 w-4" />,
  Facebook: <Facebook className="h-4 w-4" />,
  YouTube: <Youtube className="h-4 w-4" />,
  TikTok: <Video className="h-4 w-4" />,
  Blog: <Globe className="h-4 w-4" />
};

export default function ContentCenter() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'published': return 'default';
      case 'scheduled': return 'secondary';
      case 'approved': return 'outline';
      case 'review': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'post': return <FileText className="h-4 w-4" />;
      case 'reel': return <Video className="h-4 w-4" />;
      case 'story': return <Image className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Content Center</h2>
          <p className="text-muted-foreground">Powered by ECHO - Your Social Media Agent</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Review</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">124K</p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="content">All Content</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>
                  Plan and schedule your content across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled for {selectedDate?.toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">Product Launch Teaser</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Instagram className="h-3 w-3" />
                          <Twitter className="h-3 w-3" />
                          <span className="text-xs text-muted-foreground">2:00 PM</span>
                        </div>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule New Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* All Content View */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content Library</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Hash className="h-4 w-4 mr-2" />
                    Generate Hashtags
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockContent.map((item) => (
                  <div key={item.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge variant={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {item.platforms.map((platform) => (
                              <span key={platform} className="flex items-center gap-1">
                                {platformIcons[platform]}
                              </span>
                            ))}
                          </div>
                          
                          {item.scheduledDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.scheduledDate.toLocaleDateString()}
                            </span>
                          )}
                          
                          {item.engagement && (
                            <div className="flex items-center gap-3">
                              <span>{item.engagement.likes} likes</span>
                              <span>{item.engagement.comments} comments</span>
                              <span>{item.engagement.views} views</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drafts View */}
        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Drafts</CardTitle>
              <CardDescription>
                Work in progress content awaiting review or completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Draft management interface coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics View */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>
                Track engagement and optimize your content strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Analytics dashboard coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
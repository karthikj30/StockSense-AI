"use client";

import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RESOURCES } from "@/lib/data/resources";

function ResourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-brand hover:underline"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Resources
        </h1>
        <p className="mt-1 text-sm text-muted">
          Curated courses, YouTube channels, books, and tools for Indian
          investors
        </p>
      </div>

      <Tabs defaultValue="courses">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6 grid gap-4 lg:grid-cols-2">
          {RESOURCES.courses.map((course) => (
            <Card
              key={course.title}
              className={course.recommended ? "border-brand/30" : undefined}
            >
              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="text-2xl">{course.icon}</span>
                  {course.recommended && (
                    <Badge variant="default">Recommended</Badge>
                  )}
                </div>
                <h3 className="font-display font-semibold text-foreground">
                  <ResourceLink href={course.url}>{course.title}</ResourceLink>
                </h3>
                <p className="mt-2 text-sm text-muted">{course.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{course.type}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                  <Badge variant="outline">{course.language}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="youtube" className="mt-6 grid gap-4 lg:grid-cols-2">
          {RESOURCES.youtube.map((channel) => (
            <Card key={channel.title}>
              <CardContent className="p-5">
                <span className="text-2xl">{channel.icon}</span>
                <h3 className="mt-2 font-display font-semibold text-foreground">
                  <ResourceLink href={channel.url}>{channel.title}</ResourceLink>
                </h3>
                <p className="mt-2 text-sm text-muted">{channel.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">{channel.language}</Badge>
                  {channel.subscribers && (
                    <Badge variant="secondary">{channel.subscribers}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="books" className="mt-6 grid gap-4 lg:grid-cols-2">
          {RESOURCES.books.map((book) => (
            <Card key={book.title}>
              <CardContent className="p-5">
                <h3 className="font-display font-semibold text-foreground">
                  {book.freeUrl ? (
                    <ResourceLink href={book.freeUrl}>{book.title}</ResourceLink>
                  ) : (
                    book.title
                  )}
                </h3>
                <p className="mt-1 text-sm text-muted">by {book.author}</p>
                <p className="mt-2 text-sm text-muted">{book.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{book.level}</Badge>
                  <Badge variant="outline">{book.available}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tools" className="mt-6 grid gap-4 lg:grid-cols-2">
          {RESOURCES.tools.map((tool) => (
            <Card key={tool.title}>
              <CardContent className="p-5">
                <h3 className="font-display font-semibold text-foreground">
                  <ResourceLink href={tool.url}>{tool.title}</ResourceLink>
                </h3>
                <p className="mt-2 text-sm text-muted">{tool.description}</p>
                <Badge variant="secondary" className="mt-3">
                  {tool.type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function ProjectsPage() {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="font-bold">Error loading projects</h2>
        <p>Make sure json-server is running on port 3001</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            {projects?.length} active projects
          </p>
        </div>
        <Link href="/projects/new">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            + New Project
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="hover:bg-accent cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${project.color}`}
                  ></div>
                  <CardTitle>{project.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {project.tasksCompleted}/{project.tasksTotal} tasks
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`${project.color} h-2 rounded-full`}
                      style={{
                        width: `${(project.tasksCompleted / project.tasksTotal) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

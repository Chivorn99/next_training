"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createTask, getProjects } from "@/lib/api";
import { TaskForm } from "@/components/task-form";
import { TaskFormData } from "@/lib/schemas/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTaskPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.push("/tasks");
    },
  });

  const handleSubmit = (data: TaskFormData) => {
    createMutation.mutate({
      ...data,
      tags: [],
      comments: [],
    });
  };

  if (isLoadingProjects) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            projects={projects}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Create Task"
          />
          {createMutation.isError && (
            <p className="text-red-500 mt-4">
              Error: {createMutation.error.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

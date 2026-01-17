"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { getTask, getProjects, updateTask } from "@/lib/api";
import { TaskForm } from "@/components/task-form";
import { TaskFormData } from "@/lib/schemas/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const queryClient = useQueryClient();

  const { data: task, isLoading: isLoadingTask } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId),
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const updateMutation = useMutation({
    mutationFn: (data: TaskFormData) => updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      router.push("/tasks");
    },
  });

  const handleSubmit = (data: TaskFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoadingTask || isLoadingProjects) {
    return <div className="p-6">Loading...</div>;
  }

  if (!task) {
    return <div className="p-6">Task not found</div>;
  }

  const defaultValues: TaskFormData = {
    title: task.title,
    description: task.description,
    projectId: task.projectId,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            projects={projects}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            submitLabel="Update Task"
          />
          {updateMutation.isError && (
            <p className="text-red-500 mt-4">
              Error: {updateMutation.error.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
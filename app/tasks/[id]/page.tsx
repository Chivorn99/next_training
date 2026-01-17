"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getTask, getProject, deleteTask } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteTaskDialog } from "@/components/delete-task-dialog";
import { Pencil } from "lucide-react";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const queryClient = useQueryClient();

  const { data: task, isLoading: isLoadingTask } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId),
  });

  const { data: project } = useQuery({
    queryKey: ["project", task?.projectId],
    queryFn: () => getProject(task!.projectId),
    enabled: !!task?.projectId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.push("/tasks");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoadingTask) {
    return <div className="p-6">Loading...</div>;
  }

  if (!task) {
    return <div className="p-6">Task not found</div>;
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{task.title}</CardTitle>
          <div className="flex gap-2">
            <Link href={`/tasks/${taskId}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <DeleteTaskDialog
              taskTitle={task.title}
              onConfirm={handleDelete}
              isLoading={deleteMutation.isPending}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">
              Description
            </h3>
            <p>{task.description}</p>
          </div>

          <div className="flex gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Priority
              </h3>
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Status
              </h3>
              <Badge className={statusColors[task.status]}>{task.status}</Badge>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">
              Project
            </h3>
            <p>{project?.name || "Loading..."}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">
              Due Date
            </h3>
            <p>{new Date(task.dueDate).toLocaleDateString()}</p>
          </div>

          {deleteMutation.isError && (
            <p className="text-red-500">
              Error deleting task: {deleteMutation.error.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

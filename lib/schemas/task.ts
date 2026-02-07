import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  projectId: z.string().min(1, "Project is required"),
  priority: z.enum(["low", "medium", "high"], {
    message: "Priority is required",
  }),
  status: z.enum(["todo", "in-progress", "done"], {
    message: "Status is required",
  }),
  dueDate: z.string().min(1, "Due date is required"),
});

export type TaskFormData = z.infer<typeof taskSchema>;

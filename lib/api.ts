import { Project, Task } from "./types";

const API_URL = "http://localhost:3001";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/projects`);
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
}

export async function getProject(id: string): Promise<Project> {
  const res = await fetch(`${API_URL}/projects/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }
  return res.json();
}

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}

export async function getTask(id: string): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }
  return res.json();
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks?projectId=${projectId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}

// Create Task
export async function createTask(
  task: Omit<Task, "id" | "subtasks">
): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...task,
      subtasks: [],
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to create task");
  }
  return res.json();
}

// Update Task
export async function updateTask(
  id: string,
  task: Partial<Task>
): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    throw new Error("Failed to update task");
  }
  return res.json();
}

// Delete Task
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete task");
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in-progress" | "done"
) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update task status");
  }

  return response.json();
}

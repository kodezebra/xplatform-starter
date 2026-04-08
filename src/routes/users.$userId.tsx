import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, Shield, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUser, useUsers } from "@/lib/hooks/useUsers";
import { UserModal } from "@/components/users/UserModal";
import { useToast } from "@/lib/hooks/useToast";
import type { NewUser } from "@/lib/db";

export function meta() {
  return [
    { title: "User Details" },
    { name: "description", content: "View user details" },
  ];
}

const activityLog = [
  { action: "Logged in", time: "Today at 10:32 AM" },
  { action: "Updated profile settings", time: "Yesterday at 3:45 PM" },
  { action: "Created new campaign", time: "2 days ago" },
  { action: "Viewed dashboard", time: "3 days ago" },
];

export default function UserDetail() {
  const toast = useToast();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(userId || "");
  const { updateUser, deleteUser, isUpdating } = useUsers();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSave = (data: NewUser) => {
    if (userId) {
      updateUser({ id: userId, data });
    }
    setEditOpen(false);
    toast.success("User updated successfully");
  };

  const handleDelete = () => {
    if (userId) {
      deleteUser(userId);
      navigate("/users");
      toast.success("User deleted");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading user...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load user</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/users"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to users
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="size-3.5 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash className="size-3.5 mr-1 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-semibold text-primary">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                user.status === "active"
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              <span className={`size-1.5 rounded-full ${
                user.status === "active" ? "bg-green-600" : "bg-muted-foreground"
              }`} />
              {user.status}
            </span>
            <span className="text-xs text-muted-foreground">
              Joined {formatDate(user.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg">
          <div className="px-4 py-2.5 border-b">
            <h2 className="text-sm font-semibold">Contact</h2>
          </div>
          <div className="p-4 space-y-2.5 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-muted-foreground" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Joined {formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg">
          <div className="px-4 py-2.5 border-b">
            <h2 className="text-sm font-semibold">Permissions</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="size-3.5 text-muted-foreground" />
              <span className="font-medium text-sm capitalize">{user.role}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {user.role === "admin" && "Full access to all features"}
              {user.role === "editor" && "Can create and edit content"}
              {user.role === "viewer" && "Read-only access"}
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="px-4 py-2.5 border-b">
          <h2 className="text-sm font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border text-sm">
          {activityLog.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2.5 flex items-center justify-between"
            >
              <span className="truncate">{item.action}</span>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <UserModal
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        onSave={handleSave}
        isSaving={isUpdating}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium">{user.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

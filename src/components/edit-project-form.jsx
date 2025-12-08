"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditProjectForm({ project, uuid }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: project.title || "",
    description: project.description || "",
    image: project.image || "",
    link: project.link || "",
    keywords: project.keywords || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${uuid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update project");

      toast.success("Project updated successfully!");
      router.push(`/projects/${uuid}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${uuid}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete project");

      toast.success("Project deleted successfully!");
      router.push("/projects");
      router.refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div>
        <label className="block font-medium mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Project Link</label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Project
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});

  const router = useRouter();
  const createProject = useMutation(api.projects.create);

  function resetForm() {
    setName("");
    setUrl("");
    setErrors({});
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: { name?: string; url?: string } = {};
    if (!name.trim()) nextErrors.name = "Enter a project name";

    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      nextErrors.url = "Enter a URL to monitor";
    } else {
      try {
        new URL(normalizedUrl);
      } catch {
        nextErrors.url = "Enter a valid URL, e.g. https://example.com";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const projectId = await createProject({ name: name.trim(), url: normalizedUrl });
      toast.success(`${name.trim()} is being monitored`);
      resetForm();
      setOpen(false);
      router.push(`/projects/${projectId}`);
    } catch {
      toast.error("Failed to create project — try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button className="bg-lime-400 text-black hover:bg-lime-300" />}>
        <Plus className="mr-2 h-4 w-4" /> New Project
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0b0f0e] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a project</DialogTitle>
          <DialogDescription className="text-white/50">
            Enter a name and the URL you want Pulse to monitor.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label className="text-white/70" htmlFor="project-name">
              Project name
            </Label>
            <Input
              className="border-white/10 bg-white/[0.03] text-white"
              id="project-name"
              onChange={(e) => setName(e.target.value)}
              placeholder="My website"
              value={name}
            />
            {errors.name ? <p className="text-xs text-red-400">{errors.name}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/70" htmlFor="project-url">
              Website URL
            </Label>
            <Input
              className="border-white/10 bg-white/[0.03] text-white"
              id="project-url"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="youtube.com or https://myapp.com"
              value={url}
            />
            {errors.url ? <p className="text-xs text-red-400">{errors.url}</p> : null}
            <p className="text-xs text-white/30">We&apos;ll check this URL every 30 seconds for uptime and latency.</p>
          </div>

          <DialogFooter>
            <Button className="bg-lime-400 text-black hover:bg-lime-300" disabled={submitting} type="submit">
              {submitting ? "Creating..." : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
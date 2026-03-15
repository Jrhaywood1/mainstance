"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestFormSchema } from "@/lib/validation";
import { type Category, type Site } from "@/lib/types";
import { requestPriorities } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type RequestFormValues = {
  title: string;
  description: string;
  category_id: string;
  priority: (typeof requestPriorities)[number];
  site_id: string;
  building?: string;
  floor?: string;
  room?: string;
  hallway?: string;
  location_notes?: string;
};

export function RequestForm({ categories, sites }: { categories: Category[]; sites: Site[] }) {
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category_id: categories[0]?.id ?? "",
      priority: "Medium",
      site_id: sites[0]?.id ?? "",
      building: "",
      floor: "",
      room: "",
      hallway: "",
      location_notes: ""
    }
  });

  return (
    <form className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Dock door sensor fault" {...form.register("title")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Describe the issue, impact, and urgency." {...form.register("description")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...form.register("category_id")}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...form.register("priority")}
          >
            {requestPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="site">Site</Label>
          <select
            id="site"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...form.register("site_id")}
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="building">Building</Label>
          <Input id="building" {...form.register("building")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="floor">Floor</Label>
          <Input id="floor" {...form.register("floor")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="room">Room</Label>
          <Input id="room" {...form.register("room")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hallway">Hallway</Label>
          <Input id="hallway" {...form.register("hallway")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location_notes">Location notes</Label>
          <Textarea id="location_notes" {...form.register("location_notes")} />
        </div>
      </div>

      <Button type="submit">Submit request</Button>
    </form>
  );
}

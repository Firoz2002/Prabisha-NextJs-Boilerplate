"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Icons from "lucide-react"

// Zod schema for form validation
const sidebarItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().url("Must be a valid URL"),
  icon: z.string().optional(),
  position: z.number().min(0).optional(),
})

export default function SidebarAdminPage() {
  const [groups, setGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof sidebarItemSchema>>({
    resolver: zodResolver(sidebarItemSchema),
    defaultValues: { label: "", href: "", icon: "", position: 0 },
  })

  useEffect(() => {
    // Fetch sidebar groups from API
    async function fetchGroups() {
      const res = await fetch("/api/sidebar-groups")
      const data = await res.json()
      setGroups(data.data)
    }
    fetchGroups()
  }, [])

  const onSubmit = async (values: z.infer<typeof sidebarItemSchema>) => {
    if (!selectedGroup) return alert("Please select a group first")

    const res = await fetch("/api/sidebar-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, sidebarGroupId: selectedGroup }),
    })

    if (res.ok) {
      reset()
      alert("Sidebar item added successfully")
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Sidebar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Select Group */}
          <div>
            <Label>Select Group</Label>
            <Select onValueChange={(v) => setSelectedGroup(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a sidebar group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input placeholder="Item name" {...register("label")} />
              {errors.label && <p className="text-red-500 text-sm">{errors.label.message}</p>}
            </div>

            <div>
              <Label>Href</Label>
              <Input placeholder="/dashboard" {...register("href")} />
              {errors.href && <p className="text-red-500 text-sm">{errors.href.message}</p>}
            </div>

            {/* Icon Picker */}
            <div>
              <Label>Icon</Label>
              <Select onValueChange={(v) => setValue("icon", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an icon" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {Object.keys(Icons).map((iconName) => {
                    const IconComp = (Icons as any)[iconName]
                    return (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          <IconComp className="w-4 h-4" />
                          {iconName}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Position</Label>
              <Input type="number" {...register("position", { valueAsNumber: true })} />
            </div>

            <Button type="submit">Add Sidebar Item</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

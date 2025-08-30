"use client"
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";


// Types
interface SubHeaderItem {
  id?: string
  label: string
  href: string
}

interface HeaderItem {
  id: string
  label: string
  href: string
  icon: string | null
  isActive: boolean
  position: number
  subHeaderItems: SubHeaderItem[]
}

// Main Page
export default function HeaderSettingsPage() {
  const [headerItems, setHeaderItems] = useState<HeaderItem[]>([])
  const [editingItem, setEditingItem] = useState<HeaderItem | null>(null)
  const [formData, setFormData] = useState<Omit<HeaderItem, "id" | "position">>({
    label: "",
    href: "",
    icon: "",
    isActive: true,
    subHeaderItems: [],
  })

  // Fetch existing header items
  useEffect(() => {
    fetch("/api/site-settings/header")
      .then((res) => res.json())
      .then((data) => {console.log(data);
        setHeaderItems(data.headers)})
      .catch(() => toast.error("Failed to load header items"))
  }, [])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleActive = (value: boolean) => {
    setFormData({ ...formData, isActive: value })
  }

  // SubHeader management
  const addSubHeaderItem = () => {
    setFormData({
      ...formData,
      subHeaderItems: [...formData.subHeaderItems, { label: "", href: "" }],
    })
  }

  const updateSubHeaderItem = (index: number, field: keyof SubHeaderItem, value: string) => {
    const updated = [...formData.subHeaderItems]
    updated[index][field] = value
    setFormData({ ...formData, subHeaderItems: updated })
  }

  const removeSubHeaderItem = (index: number) => {
    setFormData({
      ...formData,
      subHeaderItems: formData.subHeaderItems.filter((_, i) => i !== index),
    })
  }

  // Edit existing
  const startEdit = (item: HeaderItem) => {
    setEditingItem(item)
    setFormData({
      label: item.label,
      href: item.href,
      icon: item.icon,
      isActive: item.isActive,
      subHeaderItems: item.subHeaderItems || [],
    })
  }

  // Reset form
  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      label: "",
      href: "",
      icon: "",
      isActive: true,
      subHeaderItems: [],
    })
  }

  // Submit
  const handleSubmit = async () => {
    try {
      const method = editingItem ? "PUT" : "POST"
      const body = {
        ...formData,
        id: editingItem?.id,
        position: editingItem ? editingItem.position : headerItems.length + 1,
      }

      const res = await fetch("/api/site-settings/header", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Request failed")

      const updated = await res.json()
      if (editingItem) {
        setHeaderItems(headerItems.map((h) => (h.id === updated.id ? updated : h)))
        toast.success("Header updated")
      } else {
        setHeaderItems([...headerItems, updated])
        toast.success("Header added")
      }

      resetForm()
    } catch (e) {
      toast.error("Failed to save header")
    }
  }

  // Delete
  const deleteItem = async (id: string) => {
    try {
      const res = await fetch("/api/site-settings/header", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Delete failed")

      setHeaderItems(headerItems.filter((h) => h.id !== id))
      toast.success("Header deleted")
    } catch {
      toast.error("Failed to delete header")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Header Settings</h1>

      {/* Form */}
      <div className="p-4 border rounded-md space-y-4">
        <Input
          name="label"
          placeholder="Label"
          value={formData.label}
          onChange={handleInputChange}
        />
        <Input
          name="href"
          placeholder="Href (/home, /about)"
          value={formData.href}
          onChange={handleInputChange}
        />
        <Input
          name="icon"
          placeholder="Icon name (lucide)"
          value={formData.icon || ""}
          onChange={handleInputChange}
        />

        {/* Active toggle */}
        <div className="flex items-center space-x-2">
          <Switch checked={formData.isActive} onCheckedChange={toggleActive} />
          <span>{formData.isActive ? "Active" : "Inactive"}</span>
        </div>

        {/* SubHeader items */}
        <div>
          <h3 className="font-medium mb-2">Sub Header Items</h3>
          {formData.subHeaderItems.map((item, idx) => (
            <div key={idx} className="flex space-x-2 mb-2">
              <Input
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateSubHeaderItem(idx, "label", e.target.value)}
              />
              <Input
                placeholder="Href"
                value={item.href}
                onChange={(e) => updateSubHeaderItem(idx, "href", e.target.value)}
              />
              <Button variant="destructive" onClick={() => removeSubHeaderItem(idx)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addSubHeaderItem} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" /> Add SubHeader
          </Button>
        </div>

        {/* Submit */}
        <Button onClick={handleSubmit}>
          {editingItem ? "Update Header" : "Add Header"}
        </Button>
        {editingItem && (
          <Button variant="outline" onClick={resetForm} className="ml-2">
            Cancel
          </Button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2">
        {headerItems
          .sort((a, b) => a.position - b.position)
          .map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{item.label}</span>
                <span className="text-sm text-gray-500">{item.href}</span>
                {item.isActive ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex space-x-2">
                <Button size="icon" variant="outline" onClick={() => startEdit(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

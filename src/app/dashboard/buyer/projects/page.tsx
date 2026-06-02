"use client"

import Link from "next/link"
import { Plus, MoreHorizontal, Eye, Edit3, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const projects = [
  { id: "PRJ-001", name: "Beachfront Villa Development", type: "Residential", status: "active", budget: "$850,000", timeline: "12 months", progress: 65 },
  { id: "PRJ-002", name: "City Center Office Tower", type: "Commercial", status: "active", budget: "$2.5M", timeline: "24 months", progress: 30 },
  { id: "PRJ-003", name: "Stone Town Hotel Renovation", type: "Hospitality", status: "planning", budget: "$420,000", timeline: "8 months", progress: 10 },
  { id: "PRJ-004", name: "Industrial Warehouse Complex", type: "Industrial", status: "completed", budget: "$1.8M", timeline: "18 months", progress: 100 },
  { id: "PRJ-005", name: "Residential Apartment Block", type: "Residential", status: "on-hold", budget: "$620,000", timeline: "14 months", progress: 45 },
]

const statusVariant: Record<string, "success" | "warning" | "default" | "secondary"> = {
  active: "success",
  planning: "warning",
  completed: "default",
  "on-hold": "secondary",
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500">Manage your construction projects</p>
        </div>
        <Link href="/dashboard/buyer/projects/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Project</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Type</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Budget</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Timeline</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Progress</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/buyer/projects/${project.id}`}>
                        <p className="font-medium text-gray-900 hover:text-zanzibar-600">{project.name}</p>
                      </Link>
                      <p className="text-xs text-gray-400">{project.id}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{project.type}</td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant[project.status] || "secondary"}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">{project.budget}</td>
                    <td className="px-5 py-4 text-gray-600">{project.timeline}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-zanzibar-500 transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/dashboard/buyer/projects/${project.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

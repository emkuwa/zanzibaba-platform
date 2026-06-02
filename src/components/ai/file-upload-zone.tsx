"use client"

import { useState, useRef } from "react"
import { Upload, File, X, FileText, FileSpreadsheet, Image as ImageIcon, FileArchive } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadedFileInfo {
  name: string
  size: number
  type: string
  file: File
}

interface FileUploadZoneProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  label: string
  description: string
  onFilesChange: (files: UploadedFileInfo[]) => void
  className?: string
}

const fileIcons: Record<string, React.ReactNode> = {
  "application/pdf": <FileText className="h-5 w-5 text-red-500" />,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <FileSpreadsheet className="h-5 w-5 text-green-600" />,
  "image/": <ImageIcon className="h-5 w-5 text-blue-500" />,
}

function getFileIcon(type: string) {
  for (const [key, icon] of Object.entries(fileIcons)) {
    if (type.startsWith(key)) return icon
  }
  return <File className="h-5 w-5 text-gray-500" />
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploadZone({
  accept = ".pdf,.xlsx,.xls,.csv,.dwg,.dxf,.jpg,.jpeg,.png,.doc,.docx",
  multiple = true,
  maxSize = 10 * 1024 * 1024,
  label,
  description,
  onFilesChange,
  className,
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFileInfo[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(newFiles: FileList | File[]) {
    setError(null)
    const valid: UploadedFileInfo[] = []
    const fileArray = Array.from(newFiles)

    for (const file of fileArray) {
      if (file.size > maxSize) {
        setError(`${file.name} exceeds ${formatSize(maxSize)} limit`)
        continue
      }
      valid.push({ name: file.name, size: file.size, type: file.type, file })
    }

    const updated = multiple ? [...files, ...valid] : valid
    setFiles(updated)
    onFilesChange(updated)
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesChange(updated)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all",
          isDragging
            ? "border-zanzibar-500 bg-zanzibar-50"
            : "border-gray-300 hover:border-zanzibar-400 hover:bg-zanzibar-50/50"
        )}
      >
        <div className="mb-3 rounded-full bg-zanzibar-100 p-3">
          <Upload className="h-6 w-6 text-zanzibar-600" />
        </div>
        <p className="font-medium text-gray-700">{label}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
        <p className="mt-2 text-xs text-gray-400">
          Accepted: PDF, XLSX, DWG, JPG, PNG (max {formatSize(maxSize)} each)
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border bg-white px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getFileIcon(f.type)}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {f.name}
                  </p>
                  <p className="text-xs text-gray-400">{formatSize(f.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useRef, useState } from 'react'
import { Upload, File, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { validateFile, uploadToIPFS, formatFileSize, type IPFSUploadResult } from '@/lib/ipfs'

interface FileUploaderProps {
  onUploadComplete: (result: IPFSUploadResult) => void
  onRemove: () => void
  disabled?: boolean
  existingFile?: { name: string; cid: string; size: number } | null
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function FileUploader({ onUploadComplete, onRemove, disabled, existingFile }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [state, setState] = useState<UploadState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<IPFSUploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(selectedFile: File) {
    const validation = validateFile(selectedFile)
    if (!validation.valid) {
      setError(validation.error!)
      setState('error')
      return
    }

    setFile(selectedFile)
    setState('uploading')
    setError(null)

    try {
      const result = await uploadToIPFS(selectedFile)
      setUploadResult(result)
      setState('success')
      onUploadComplete(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setState('error')
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (disabled || state === 'uploading') return
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  function handleRemove() {
    setFile(null)
    setUploadResult(null)
    setState('idle')
    setError(null)
    onRemove()
    if (inputRef.current) inputRef.current.value = ''
  }

  // Show existing file if provided
  if (existingFile && state === 'idle') {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
          <File className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{existingFile.name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{formatFileSize(existingFile.size)}</span>
            <span>•</span>
            <a
              href={`https://ipfs.io/ipfs/${existingFile.cid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-mono"
            >
              {existingFile.cid.slice(0, 8)}...
            </a>
          </div>
        </div>
        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  // Success state
  if (state === 'success' && file && uploadResult) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2.5">
        <div className="h-10 w-10 rounded bg-green-500/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <a
              href={uploadResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-mono"
            >
              {uploadResult.cid.slice(0, 8)}...
            </a>
            <Badge variant="success" className="text-[10px] px-1 py-0">Uploaded</Badge>
          </div>
        </div>
        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  // Uploading state
  if (state === 'uploading' && file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5">
        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Uploading to IPFS... {formatFileSize(file.size)}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <div className="h-10 w-10 rounded bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Upload failed</p>
            <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          Try again
        </Button>
      </div>
    )
  }

  // Idle / upload zone
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
        accept=".pdf,.zip,.txt,.md,image/png,image/jpeg"
      />
      <div
        onDragEnter={() => !disabled && setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors cursor-pointer',
          dragActive && 'border-primary bg-primary/5',
          !dragActive && 'border-border hover:border-primary/50 hover:bg-muted/50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, ZIP, TXT, MD, PNG, JPG (max 10MB)
          </p>
        </div>
      </div>
    </div>
  )
}

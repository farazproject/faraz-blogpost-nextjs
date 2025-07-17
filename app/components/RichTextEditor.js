"use client"
import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  ),
})

// Import Quill styles
import "react-quill/dist/quill.snow.css"

export default function RichTextEditor({ value, onChange, placeholder = "Start writing..." }) {
  const quillRef = useRef(null)

  // Quill modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: () => {
          const input = document.createElement("input")
          input.setAttribute("type", "file")
          input.setAttribute("accept", "image/*")
          input.click()

          input.onchange = () => {
            const file = input.files[0]
            if (file) {
              // Create a simple file reader for demo purposes
              // In production, you'd upload to a cloud service
              const reader = new FileReader()
              reader.onload = (e) => {
                const quill = quillRef.current?.getEditor()
                if (quill) {
                  const range = quill.getSelection()
                  quill.insertEmbed(range.index, "image", e.target.result)
                }
              }
              reader.readAsDataURL(file)
            }
          }
        },
      },
    },
    clipboard: {
      matchVisual: false,
    },
  }

  // Quill formats
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
  ]

  // Handle editor change
  const handleChange = (content, delta, source, editor) => {
    onChange(content)
  }

  // Custom styles for the editor
  useEffect(() => {
    // Add custom styles to the Quill editor
    const style = document.createElement("style")
    style.textContent = `
      .ql-editor {
        min-height: 200px;
        font-size: 16px;
        line-height: 1.6;
      }
      
      .ql-editor.ql-blank::before {
        color: #9ca3af;
        font-style: normal;
      }
      
      .ql-toolbar {
        border-top: 1px solid #e5e7eb;
        border-left: 1px solid #e5e7eb;
        border-right: 1px solid #e5e7eb;
        border-bottom: none;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
      }
      
      .ql-container {
        border-bottom: 1px solid #e5e7eb;
        border-left: 1px solid #e5e7eb;
        border-right: 1px solid #e5e7eb;
        border-top: none;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
      }
      
      .ql-toolbar .ql-stroke {
        fill: none;
        stroke: #374151;
      }
      
      .ql-toolbar .ql-fill {
        fill: #374151;
        stroke: none;
      }
      
      .ql-toolbar .ql-picker-label {
        color: #374151;
      }
      
      .ql-toolbar button:hover,
      .ql-toolbar button:focus {
        color: #4f46e5;
      }
      
      .ql-toolbar button.ql-active {
        color: #4f46e5;
      }
      
      .ql-toolbar .ql-picker-label:hover,
      .ql-toolbar .ql-picker-label.ql-active {
        color: #4f46e5;
      }
    `

    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: "white",
        }}
      />

      {/* Word count and other stats */}
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <div>{value && <span>{value.replace(/<[^>]*>/g, "").length} characters</span>}</div>

        <div className="flex items-center space-x-4">
          <span>Rich text editor</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}

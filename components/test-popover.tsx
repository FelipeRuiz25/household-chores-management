"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function TestPopover() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="p-4 border rounded">
      <h3 className="mb-4 font-bold">Test Popover</h3>
      <Popover
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen)
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(true)
            }}
          >
            Click me to test popover
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <div>
            <p>This is a test popover content</p>
            <Button
              className="mt-2"
              onClick={() => {
                setOpen(false)
              }}
            >
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}


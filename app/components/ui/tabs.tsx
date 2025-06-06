"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: "",
  onValueChange: () => null,
})

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, children, className, ...props }, ref) => {
    const [tabValue, setTabValue] = React.useState(value || defaultValue || "")
    
    const handleValueChange = React.useCallback((newValue: string) => {
      setTabValue(newValue)
      onValueChange?.(newValue)
    }, [onValueChange])
    
    React.useEffect(() => {
      if (value !== undefined) {
        setTabValue(value)
      }
    }, [value])
    
    return (
      <TabsContext.Provider value={{ value: tabValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled = false, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
    const isActive = selectedValue === value
    
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => onValueChange(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-background text-foreground shadow-sm",
          className
        )}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(TabsContext)
    const isActive = selectedValue === value
    
    if (!isActive) return null
    
    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }

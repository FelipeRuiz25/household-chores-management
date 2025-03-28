"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { useUsers } from "@/contexts/users-context"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    role: z.string({
        required_error: "Please select a role.",
    }),
})

interface AddUserDialogProps {
    trigger: React.ReactNode
    onUserAdded?: () => void
}

export function AddUserDialog({ trigger, onUserAdded }: AddUserDialogProps) {
    const { addUser } = useUsers()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        // Add the new user to our context
        addUser(values)

        // Show success toast
        toast.success("Family member added", {
            description: `${values.name} has been added successfully.`,
        })

        // Reset form and close dialog
        setTimeout(() => {
            setIsSubmitting(false)
            form.reset()
            setOpen(false)
            if (onUserAdded) onUserAdded()
        }, 500)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-2 sm:p-4">
                <DialogHeader className="text-left px-2 sm:px-4">
                    <DialogTitle>Add Family Member</DialogTitle>
                    <DialogDescription>Enter the details for the new family member</DialogDescription>
                </DialogHeader>
                <Card className="border-0 shadow-none">
                    <CardContent className="space-y-4 px-2 sm:px-4 pt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="space-y-4 mb-8">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter full name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Enter email address" {...field} />
                                                </FormControl>
                                                <FormDescription>This will be used for notifications and login</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="parent">Parent</SelectItem>
                                                        <SelectItem value="child">Child</SelectItem>
                                                        <SelectItem value="other">Other Family Member</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting} className="w-full">
                                        {isSubmitting ? (
                                            <>Saving...</>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Family Member
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}


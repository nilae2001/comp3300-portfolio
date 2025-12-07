"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "./ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"


export default function ContactMe() {
    const MessageFormSchema = z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters." }),
        email: z.string().email({ message: "Please enter a valid email address." }),
        message: z.string().min(10, { message: "Message must be at least 10 characters." }),
    })

    const form = useForm({
        resolver: zodResolver(MessageFormSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    })

    async function onSubmit(values) {
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('message', values.message)

        const sendEmail = (async () => {
            const res = await fetch('/api/projects/contact-me', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                throw new Error(data?.message ?? 'Something went wrong.')
            }
            return data
        })()

        toast.promise(sendEmail, {
            loading: 'Sending your email…',
            success: ({ message }) => message ?? 'Email sent! Thanks for reaching out.',
            error: (error) => error.message ?? 'Email failed. Please try again.',
        })

        try {
            await sendEmail
        } catch {
            // error toast already shown
        }
        form.reset()
    }

    return (
        <div className="flex flex-col items-center justify-center w-full my-8 bg-stone-500 py-8">
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Get in Touch</h2>
            <p className="mb-4 text-center max-w-md text-stone-100">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out!
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg flex flex-col gap-4 px-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-stone-50">Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Name" className="text-stone-50" {...field} />
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
                                <FormLabel className="text-stone-50">Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="abc@abc.com" className="text-stone-50" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-stone-50">Message</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Your message here..." className="h-32 text-stone-50" {...field}></Textarea>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button variant='outline' type="submit" className="self-end mt-2">Send Message</Button>
                </form>
            </Form>
        </div>
    )
}   
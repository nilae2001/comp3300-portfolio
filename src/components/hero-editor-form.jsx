"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const heroSchema = z.object({
    avatar: z
        .string()
        .trim()
        .min(1)
        .refine((v) => v.startsWith("data:"), "Avatar must be a data URL"),
    fullName: z.string().trim().min(2).max(200),
    shortDescription: z.string().trim().min(2).max(120),
    longDescription: z.string().trim().min(10).max(5000),
});

const defaultHeroValues = {
    avatar: "",
    fullName: "",
    shortDescription: "",
    longDescription: "",
};

export default function HeroEditorForm() {
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [heroData, setHeroData] = useState(defaultHeroValues);
    const fileInputRef = useRef(null);

    const form = useForm({
        resolver: zodResolver(heroSchema),
        defaultValues: defaultHeroValues,
    });

    const { handleSubmit, control, reset, formState } = form;
    const { isSubmitting } = formState;

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const res = await fetch("/api/hero");
                if (!res.ok) throw new Error("Failed to fetch hero");
                const json = await res.json();
                // API returns { data: hero }
                const data = json?.data ?? defaultHeroValues;
                // reset expects an object with the form field names
                reset({
                    avatar: data.avatar ?? "",
                    fullName: data.fullName ?? "",
                    shortDescription: data.shortDescription ?? "",
                    longDescription: data.longDescription ?? "",
                });
                if (data.avatar) setAvatarPreview(data.avatar);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load current hero data");
                // ensure form has sensible defaults
                reset(defaultHeroValues);
                setAvatarPreview(defaultHeroValues.avatar);
            }
        };
        fetchHero();
    }, [reset]);

    useEffect(() => {
        reset(heroData);
        if (heroData.avatar) {
            setAvatarPreview(heroData.avatar);
        }
    }, [heroData]);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (typeof dataUrl === "string") {
                setAvatarPreview(dataUrl);
                form.setValue("avatar", dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append("avatar", values.avatar || "");
            formData.append("fullName", values.fullName);
            formData.append("shortDescription", values.shortDescription);
            formData.append("longDescription", values.longDescription);
            if (avatarFile) formData.append("avatarFile", avatarFile);

            const promise = fetch("/api/hero", {
                method: "PUT",
                body: formData,
            }).then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.message || "Failed to update hero"
                    );
                }
                const json = await response.json();
                setHeroData(json.data)
                // return response.json();
            });

            const result = await toast.promise(promise, {
                loading: "Updating hero section...",
                success: "Hero section updated",
                error: (err) => err.message || "Failed to update hero",
            });
        } catch (err) {
            console.error("Hero form error:", err);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={control}
                    name="avatar"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Avatar</FormLabel>
                            <div className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <FormControl>
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="cursor-pointer"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Upload a profile image (JPG, PNG, etc.)
                                    </FormDescription>
                                </div>

                                {avatarPreview && (
                                    <div className="shrink-0">
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            className="w-24 h-24 rounded-lg object-cover border"
                                        />
                                    </div>
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your full name displayed on the hero section
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="shortDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Full-stack developer & designer"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Brief one-liner about yourself (max 200
                                characters)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="longDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Long Description *</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell visitors more about yourself, your experience, and what you do..."
                                    rows={8}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Detailed description (max 1000 characters)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update hero section"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
/* eslint-disable @next/next/no-img-element */
'use client';

import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/AppShell';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ImagePlus,
    Sparkles,
    Upload,
    X,
} from 'lucide-react';

type FormState = {
    firstName: string;
    lastName: string;
    prompt: string;
    description: string;
    intro: string;
};

type GalleryItem = {
    id: string;
    preview: string;
    file: File;
};

const steps = [
    {
        title: 'Identity',
        description: 'Avatar, name, and the first impression.',
    },
    {
        title: 'Voice & Story',
        description: 'Craft the agent prompt, description, and intro.',
    },
    {
        title: 'Media Kit',
        description: 'Upload supporting visuals to set the mood.',
    },
];

const maxGalleryItems = 6;

export default function CreateAiAgentPage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormState>({
        firstName: '',
        lastName: '',
        prompt: '',
        description: '',
        intro: '',
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        setCompleted(false);
    }, [step]);

    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
            gallery.forEach((item) => URL.revokeObjectURL(item.preview));
        };
    }, [avatarPreview, gallery]);

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setAvatar(file);
        setAvatarPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
    };

    const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        setGallery((prev) => {
            const remaining = Math.max(0, maxGalleryItems - prev.length);
            const allowedFiles = files.slice(0, remaining);
            const mapped = allowedFiles.map((file, index) => ({
                id: `${file.name}-${Date.now()}-${index}`,
                preview: URL.createObjectURL(file),
                file,
            }));
            return [...prev, ...mapped];
        });
        event.target.value = '';
    };

    const removeGalleryItem = (id: string) => {
        setGallery((prev) => {
            const target = prev.find((item) => item.id === id);
            if (target) URL.revokeObjectURL(target.preview);
            return prev.filter((item) => item.id !== id);
        });
    };

    const resetFlow = () => {
        setForm({ firstName: '', lastName: '', prompt: '', description: '', intro: '' });
        setAvatar(null);
        setGallery((prev) => {
            prev.forEach((item) => URL.revokeObjectURL(item.preview));
            return [];
        });
        setAvatarPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setStep(0);
        setCompleted(false);
    };

    const handleChange = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const currentStepComplete = useMemo(() => {
        if (step === 0) {
            return Boolean(form.firstName.trim() && form.lastName.trim() && (avatar || avatarPreview));
        }
        if (step === 1) {
            return Boolean(form.prompt.trim() && form.description.trim() && form.intro.trim());
        }
        return gallery.length > 0;
    }, [step, form, avatar, avatarPreview, gallery]);

    const goNext = () => {
        if (!currentStepComplete) return;
        if (step < steps.length - 1) {
            setStep((prev) => prev + 1);
        } else {
            setCompleted(true);
        }
    };

    const goPrev = () => {
        if (step === 0) return;
        setStep((prev) => prev - 1);
    };

    const stepContent = useMemo(() => {
        if (step === 0) {
            return (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Give your agent a face</h2>
                        <p className="mt-2 text-sm text-white/70">
                            Upload an avatar and set a memorable identity. This will be the first thing users see.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6 backdrop-blur">
                        <span className="text-sm font-medium text-white/70">Avatar</span>
                        <div className="mt-4 flex flex-col gap-6 sm:flex-row">
                            <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Selected avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <Upload className="size-8 text-white/40" />
                                )}
                            </div>
                            <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-white/70 transition hover:border-violet-400/60 hover:bg-violet-500/10">
                                <Upload className="size-5 text-violet-300" />
                                <span className="font-medium text-white">Upload image</span>
                                <span className="text-xs text-white/60">PNG, JPG up to 5MB</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </label>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm text-white/70">
                            First name
                            <input
                                value={form.firstName}
                                onChange={(event) => handleChange('firstName', event.target.value)}
                                placeholder="aiAgent"
                                className="rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-white/70">
                            Last name
                            <input
                                value={form.lastName}
                                onChange={(event) => handleChange('lastName', event.target.value)}
                                placeholder="Alpha"
                                className="rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
                            />
                        </label>
                    </div>
                </div>
            );
        }

        if (step === 1) {
            return (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Shape how it thinks</h2>
                        <p className="mt-2 text-sm text-white/70">
                            Describe the tone, goals, and behaviour. These details guide the conversations the agent will have.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <label className="flex flex-col gap-2 text-sm text-white/70">
                            System prompt
                            <textarea
                                value={form.prompt}
                                onChange={(event) => handleChange('prompt', event.target.value)}
                                rows={5}
                                placeholder="You are a strategic confidant who helps people reframe their challenges with empathy..."
                                className="min-h-[140px] rounded-3xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-white/70">
                            Description
                            <textarea
                                value={form.description}
                                onChange={(event) => handleChange('description', event.target.value)}
                                rows={4}
                                placeholder="Summarise the agent in a few evocative sentences that will appear on the profile."
                                className="rounded-3xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-white/70">
                            Intro message
                            <textarea
                                value={form.intro}
                                onChange={(event) => handleChange('intro', event.target.value)}
                                rows={3}
                                placeholder="How does the first hello sound? Set the scene in one paragraph."
                                className="rounded-3xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
                            />
                        </label>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Curate the vibe</h2>
                    <p className="mt-2 text-sm text-white/70">
                        Add reference images, scenes, or moodboard shots to help the audience visualise your agent.
                    </p>
                </div>

                <div className="rounded-3xl border border-dashed border-white/15 bg-neutral-900/60 p-6 text-center text-sm text-white/70">
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-3">
                        <ImagePlus className="size-6 text-violet-300" />
                        <span className="font-medium text-white">Upload gallery</span>
                        <span className="text-xs text-white/60">Drop multiple images or pick from your library</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
                    </label>
                </div>
                {gallery.length >= maxGalleryItems && (
                    <p className="text-xs text-white/60">
                        You&apos;ve reached the {maxGalleryItems}-image limit. Remove an image if you want to add a new one.
                    </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    {gallery.map((item) => (
                        <div key={item.id} className="group relative overflow-hidden rounded-3xl border border-white/10">
                            <img src={item.preview} alt="Gallery asset" className="h-40 w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeGalleryItem(item.id)}
                                className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                                aria-label="Remove image"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    ))}
                    {!gallery.length && (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-sm text-white/60">
                            <p>Once you add images, they will appear here with quick remove controls.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }, [step, form, gallery, avatarPreview]);

    return (
        <AppShell>
            <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute left-[-10%] top-[-15%] h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="absolute right-[-20%] top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
                </div>

                <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-24 pt-12 lg:flex-row lg:gap-12">
                    <div className="flex w-full flex-col gap-6 lg:w-[60%]">
                        <header className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                                <Sparkles className="size-3.5 text-violet-300" />
                                Build your agent
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight">Create a new aiAgent</h1>
                            <p className="max-w-2xl text-sm text-white/70">
                                Craft the personality, story, and visuals your companion will carry into every conversation. Move through each stage to launch a polished profile.
                            </p>
                        </header>

                        {completed && (
                            <div className="flex items-center gap-3 rounded-3xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                                <CheckCircle2 className="size-5" />
                                <span>Your draft is ready! Feel free to revisit any step or publish when you&apos;re set.</span>
                            </div>
                        )}

                        <ol className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-900/60 p-5 sm:flex-row sm:items-start sm:gap-6">
                            {steps.map((item, index) => {
                                const status = index === step ? 'current' : index < step ? 'done' : 'todo';
                                return (
                                    <li key={item.title} className="flex flex-1 items-start gap-3">
                                        <span
                                            className={`mt-1 inline-flex size-8 items-center justify-center rounded-full border text-sm font-semibold transition ${
                                                status === 'done'
                                                    ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200'
                                                    : status === 'current'
                                                        ? 'border-violet-400/60 bg-violet-500/20 text-violet-100'
                                                        : 'border-white/15 bg-white/5 text-white/50'
                                            }`}
                                        >
                                            {status === 'done' ? <CheckCircle2 className="size-4" /> : index + 1}
                                        </span>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-white/90">{item.title}</p>
                                            <p className="text-xs text-white/60">{item.description}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>

                        <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-6 shadow-[0_30px_80px_-50px_rgba(79,70,229,0.6)]">
                            {stepContent}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    disabled={step === 0}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ArrowLeft className="size-4" />
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={resetFlow}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10"
                                >
                                    Start over
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={goNext}
                                disabled={!currentStepComplete}
                                className="inline-flex items-center gap-2 self-end rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {step === steps.length - 1 ? 'Create aiAgent' : 'Continue'}
                                <ArrowRight className="size-4" />
                            </button>
                        </div>
                    </div>

                    <aside className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:w-[40%]">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold">Live preview</h2>
                                <p className="text-sm text-white/70">
                                    Keep an eye on how your agent is shaping up. Details update in real-time as you type.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-neutral-900/80 p-5">
                                <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <Sparkles className="size-6 text-white/40" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-white">
                                        {(form.firstName || 'Your') + ' ' + (form.lastName || 'agent')}
                                    </p>
                                    <p className="max-h-20 overflow-hidden text-xs text-white/60">
                                        {form.description || 'Describe the essence of your companion to hint at the experience users will unlock.'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-3xl border border-white/10 bg-neutral-900/70 p-5">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">Intro message</h3>
                                    <p className="mt-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/70">
                                        {form.intro || 'This is where your aiAgent opens the conversation with warmth, clarity, and direction.'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">System prompt</h3>
                                    <p className="mt-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-white/60">
                                        {form.prompt || 'Define the rules, tone, and expertise. Your guidance informs every response.'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/50">
                                    <span>Gallery</span>
                                    <span>
                                        {gallery.length} {gallery.length === 1 ? 'image' : 'images'} · {Math.max(0, maxGalleryItems - gallery.length)} left
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {gallery.length ? (
                                        gallery.slice(0, 6).map((item) => (
                                            <div key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                                <img src={item.preview} alt="Gallery preview" className="h-20 w-full object-cover" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-3 rounded-2xl border border-dashed border-white/15 bg-neutral-900/60 p-4 text-center text-xs text-white/50">
                                            Add up to six highlight visuals to enrich the story.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppShell>
    );
}

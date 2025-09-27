"use client";

import { ArrowLeft, MoreHorizontal, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/Button';


export default function HeaderActions({ onEdit }: { onEdit: () => void }) {
    const router = useRouter();
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    onClick={() => router.back()}
                    variant="frostedIcon"
                    className="hidden md:inline-flex"
                    aria-label="Go back"
                >
                    <ArrowLeft className="size-5" />
                </Button>
                <Button variant="frostedIcon">
                    <Share2 className="size-5" />
                </Button>
                <Button variant="frostedIcon">
                    <MoreHorizontal className="size-5" />
                </Button>
            </div>
            <div className="flex items-center gap-3">
                <Button onClick={onEdit} variant="solidWhitePill">
                    Edit Profile
                </Button>
            </div>
        </div>
    );
}
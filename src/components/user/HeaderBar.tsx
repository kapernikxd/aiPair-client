import { ArrowLeft, MoreHorizontal, Share2, Sparkles } from "lucide-react";
import { Button } from '@/components/ui/Button';


export default function HeaderBar() {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <Button variant="frostedIcon">
                    <ArrowLeft className="size-5" />
                </Button>
                <Button variant="frostedIcon">
                    <Share2 className="size-5" />
                </Button>
                <Button variant="frostedIcon">
                    <MoreHorizontal className="size-5" />
                </Button>
            </div>
            <Button variant="frostedPill">
                <Sparkles className="size-4" />
                Subscribed
            </Button>
        </div>
    );
}
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PropsWithChildren, useCallback, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import posthog from "posthog-js";
import { toast } from "sonner"

export const WlsModal = ({ children }: PropsWithChildren) => {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState<boolean | null>(null);

    const closeRef = useRef<HTMLButtonElement>(null);

    const verifyEmail = useCallback(async () => {
        if (!email) {
            setSuccess(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSuccess(false);
            return;
        }

        const res = await fetch("/api/wl", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            posthog.capture("wl-signup")
            const data = await res.text();
            closeRef.current?.click();
            toast(`Successfully added "${email}" to waitlist.`);
            setEmail("")

            setSuccess(true);
        } else {
            setSuccess(false);
        }
    }, [email]);

    return (
        <Dialog>
            <DialogTrigger onClick={() => { posthog.capture("wl-clicked") }}>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join the Memski waitlist</DialogTitle>
                    <DialogDescription>{"Be the first to hear updates when we lauch!"}</DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); verifyEmail() }} className="flex flex-col space-y-2 mt-2">
                    <Label>Enter your email address</Label>
                    <div className="flex flex-col space-y-2">
                        <div className="w-full flex flex-row space-x-2">
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={({ target: { value }}) => { setSuccess(null); setEmail(value); }}
                                className={success === false ? "border-red-500" : ""}
                            />
                            <Button type="submit">Confirm</Button>
                            <DialogClose className="hidden" ref={closeRef} />
                        </div>
                    </div>
                    {success === false && (
                        <p className="text-sm text-red-500">Please enter a valid email address.</p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function IndexPage() {
    return (
        <main className="w-screen h-screen p-8">
            <div className="flex p-8 ml-24">
                <Image src="/" alt="" width={40} height={40} />
                <span>Logoipsum</span>
            </div>
            <div className="flex">
                <div className="flex max-w-[700px] flex-col items-start gap-2 p-8 ml-24 mt-16">
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl">
                        Headpace, AI-Powered Calendar Assistant
                    </h1>
                    <p className="max-w-[500px] text-lg text-muted-foreground">
                        Transform your productivity.
                        Designed to streamline your schedule, manage appointments, and keep you on track.
                        Experience the future of time management today.
                    </p>
                    <div className="flex gap-4 text-lg font-bold">
                        <Button className="h-12 w-36">Login</Button>
                        <Button className="h-12 w-36" variant="outline">Learn more</Button>
                    </div>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                    orientation="vertical"
                    className="w-full max-w-xs"
                >
                    <CarouselContent className="-mt-1 h-[200px]">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index} className="pt-1 md:basis-1/2">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex items-center justify-center p-6">
                                            <span className="text-3xl font-semibold">{index + 1}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </main >
    );
}
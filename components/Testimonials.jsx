"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Computer Science Major",
    avatar: "https://i.pravatar.cc/150?img=1",
    content:
      "UTAMarket saved me so much money on textbooks! I found all the books I needed for my classes at half the price of the campus bookstore.",
  },
  {
    id: 2,
    name: "Samantha Lee",
    role: "Business Administration Major",
    avatar: "https://i.pravatar.cc/150?img=5",
    content:
      "I furnished my entire apartment with items from UTAMarket. The furniture section has amazing deals from graduating students.",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Engineering Major",
    avatar: "https://i.pravatar.cc/150?img=3",
    content:
      "When my laptop died right before finals, I found an affordable replacement on UTAMarket within hours. Lifesaver!",
  },
  {
    id: 4,
    name: "Emily Chen",
    role: "Biology Major",
    avatar: "https://i.pravatar.cc/150?img=9",
    content:
      "The tutoring services available on UTAMarket helped me pass Organic Chemistry. Highly recommend checking out the services section!",
  },
  {
    id: 5,
    name: "David Kim",
    role: "Psychology Major",
    avatar: "https://i.pravatar.cc/150?img=8",
    content:
      "As a seller on UTAMarket, I've been able to make back some money on textbooks and electronics I no longer need. The platform is super easy to use.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Students Say</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Hear from fellow UTA students who have bought and sold on our
            marketplace
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="md:basis-1/2 lg:basis-1/3 pl-4"
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar>
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <p className="text-sm text-zinc-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-zinc-700">{testimonial.content}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

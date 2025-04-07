"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Tag,
  ChevronRight,
  BookOpen,
  TrendingUp,
  ShoppingBag,
  Lightbulb,
  School,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock blog data - in a real app, this would come from a CMS or API
const featuredPosts = [
  {
    id: 1,
    title: "Ultimate Guide to UTA Spirit Gear: Show Your Maverick Pride",
    excerpt:
      "Discover the latest collection of UTA merchandise and learn how to style your spirit wear for any occasion.",
    image: "/blog/spirit-gear.jpg",
    category: "Fashion",
    date: "March 15, 2024",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Top 10 Must-Have School Supplies for UTA Students",
    excerpt:
      "Get ready for the semester with our curated list of essential supplies every UTA student needs.",
    image: "/blog/supplies.jpg",
    category: "Student Life",
    date: "March 12, 2024",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Sustainable Shopping: Eco-Friendly Products at UTA Market",
    excerpt:
      "Learn about our commitment to sustainability and discover our range of environmentally conscious products.",
    image: "/blog/eco.jpg",
    category: "Sustainability",
    date: "March 10, 2024",
    readTime: "6 min read",
  },
];

const latestPosts = [
  {
    id: 4,
    title: "5 Study Space Essentials from UTA Market",
    category: "Student Life",
    date: "March 8, 2024",
  },
  {
    id: 5,
    title: "New Collection Alert: Spring 2024 UTA Apparel",
    category: "Fashion",
    date: "March 6, 2024",
  },
  {
    id: 6,
    title: "Gift Guide: Perfect Presents for UTA Graduates",
    category: "Gift Ideas",
    date: "March 4, 2024",
  },
  {
    id: 7,
    title: "Tech Accessories Every Student Needs",
    category: "Technology",
    date: "March 2, 2024",
  },
];

const categories = [
  { name: "Student Life", icon: School, count: 12 },
  { name: "Fashion", icon: ShoppingBag, count: 8 },
  { name: "Study Tips", icon: Lightbulb, count: 6 },
  { name: "Trending", icon: TrendingUp, count: 5 },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-[#0064B1] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">UTA Market Blog</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Your source for campus life, shopping guides, and student
              resources
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Featured Posts */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
                <div className="space-y-8">
                  {featuredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-64">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-zinc-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {post.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          <Link
                            href={`/blog/${post.id}`}
                            className="hover:text-[#0064B1] transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-zinc-600 mb-4">{post.excerpt}</p>
                        <Button
                          variant="outline"
                          className="text-[#0064B1] border-[#0064B1]"
                          asChild
                        >
                          <Link href={`/blog/${post.id}`}>
                            Read More
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Latest Posts */}
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#0064B1]" />
                  Latest Posts
                </h2>
                <div className="space-y-4">
                  {latestPosts.map((post) => (
                    <article
                      key={post.id}
                      className="border-b last:border-0 pb-4 last:pb-0"
                    >
                      <Link
                        href={`/blog/${post.id}`}
                        className="hover:text-[#0064B1] transition-colors"
                      >
                        <h3 className="font-medium mb-1">{post.title}</h3>
                      </Link>
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {post.category}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Categories */}
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={`/blog/category/${category.name.toLowerCase()}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <category.icon className="h-5 w-5 text-[#0064B1]" />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-sm text-zinc-600">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

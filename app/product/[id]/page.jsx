"use client";

import { useState, useEffect, use } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/ProductCard";
import Image from "next/image";
import { toast } from "sonner";
import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useParams } from "next/navigation";

// This would normally come from a database or API
const getProductById = (id) => {
  // Sample product data for UTA merchandise
  return {
    id: id,
    name: "UTA Classic Hoodie",
    category: "Apparel",
    price: 49.99,
    originalPrice: 59.99,
    discount: 17,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?q=80&w=1974&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 156,
    description:
      "Stay warm and show your UTA pride with our Classic Hoodie. Made from premium cotton blend material, featuring the iconic UTA logo embroidered on the chest. Perfect for chilly days on campus or showing your school spirit anywhere you go.",
    details: [
      "80% Cotton, 20% Polyester blend",
      "Machine washable",
      "Ribbed cuffs and waistband",
      "Kangaroo pocket",
      "Drawstring hood",
      "Embroidered UTA logo",
    ],
    availableSizes: ["XS", "S", "M", "L", "XL", "2XL"],
    availableColors: ["Navy Blue", "Gray", "Orange", "White"],
    reviews: [
      {
        id: 1,
        user: "Sarah M.",
        rating: 5,
        date: "March 15, 2024",
        comment:
          "Super comfortable and great quality! The size runs true to fit.",
        helpful: 24,
        notHelpful: 2,
      },
      {
        id: 2,
        user: "Mike R.",
        rating: 4,
        date: "March 10, 2024",
        comment:
          "Nice hoodie, but I wish it came in more colors. The material is very soft though!",
        helpful: 15,
        notHelpful: 1,
      },
      {
        id: 3,
        user: "Jessica L.",
        rating: 5,
        date: "March 5, 2024",
        comment:
          "Perfect for those chilly mornings on campus. The embroidery is really well done.",
        helpful: 19,
        notHelpful: 0,
      },
    ],
    aiRecommendations: [
      {
        id: 101,
        name: "UTA Logo T-Shirt",
        category: "Apparel",
        price: 24.99,
        image:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
        rating: 4.6,
        reason: "Perfect for layering with the hoodie",
      },
      {
        id: 102,
        name: "UTA Backpack",
        category: "Accessories",
        price: 39.99,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop",
        rating: 4.9,
        reason: "Complete your campus look",
      },
      {
        id: 103,
        name: "Maverick Pride Cap",
        category: "Accessories",
        price: 22.99,
        image:
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1936&auto=format&fit=crop",
        rating: 4.7,
        reason: "Customers often buy these together",
      },
    ],
  };
};

export default function ProductPage() {
  const params = useParams();
  const productId = params.id; // Now safely accessing the id parameter
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        // Set initial size and color if available
        if (data.availableSizes?.length > 0) {
          setSelectedSize(data.availableSizes[0]);
        }
        if (data.availableColors?.length > 0) {
          setSelectedColor(data.availableColors[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setCartMessage({ type: "", text: "" });

      // Validate size if sizes are available
      if (product.availableSizes?.length > 0 && !selectedSize) {
        toast.error("Please select a size");
        return;
      }

      // Validate color if colors are available
      if (product.availableColors?.length > 0 && !selectedColor) {
        toast.error("Please select a color");
        return;
      }

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          selectedSize,
          selectedColor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login page if not authenticated
          router.push(
            "/login?redirect=" + encodeURIComponent(window.location.pathname)
          );
          return;
        }
        throw new Error(data.message || "Failed to add item to cart");
      }

      // Show success toast with cart action
      toast.success("Added to cart!", {
        description: `${quantity}x ${product.name} added to your cart`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      });

      // Reset selections
      setQuantity(1);
      if (product.availableSizes?.length > 0) {
        setSelectedSize(product.availableSizes[0]);
      }
      if (product.availableColors?.length > 0) {
        setSelectedColor(product.availableColors[0]);
      }
    } catch (err) {
      toast.error("Failed to add item to cart", {
        description: err.message,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-zinc-600">{error || "Product not found"}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-600">
                  {product.discount}% OFF
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square relative overflow-hidden rounded-md border cursor-pointer ${
                    selectedImage === index ? "ring-2 ring-blue-600" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-zinc-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-zinc-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-[#0064B1]">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-zinc-500 line-through">
                    ${Number(product.originalPrice).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-zinc-600 mb-6">{product.description}</p>

              {/* Size Selector */}
              {product.availableSizes?.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <Badge
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.availableColors?.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableColors.map((color) => (
                      <Badge
                        key={color}
                        variant={
                          selectedColor === color ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Quantity
                </label>
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Cart Message */}
              {cartMessage.text && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    cartMessage.type === "error"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {cartMessage.text}
                </div>
              )}

              {/* Shipping Info */}
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over $35</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-600">
            {product.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(review.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-zinc-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.user}</span>
                  <span className="text-zinc-500">·</span>
                  <span className="text-zinc-500">{review.date}</span>
                </div>
                <p className="text-zinc-600 mb-2">{review.comment}</p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-zinc-500">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                  <Button variant="ghost" size="sm" className="text-zinc-500">
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Not Helpful ({review.notHelpful})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {product.aiRecommendations.map((recommendation) => (
              <ProductCard
                key={recommendation.id}
                id={recommendation.id}
                name={recommendation.name}
                price={recommendation.price}
                image={recommendation.image}
                itemDetails={{
                  Type: recommendation.category,
                }}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "utamarket",
};

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "newest";
    const categoryId = parseInt(searchParams.get("categoryId"));
    const limit = 12; // Number of products per page
    const offset = (page - 1) * limit;

    // Create database connection
    const connection = await mysql.createConnection(dbConfig);

    // Get total count of products for the category
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM products WHERE category_id = ?",
      [categoryId]
    );
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);

    // Determine sort order
    let orderBy = "p.id DESC"; // Default: newest first
    switch (sort) {
      case "price-low":
        orderBy = "p.price ASC";
        break;
      case "price-high":
        orderBy = "p.price DESC";
        break;
      case "name-asc":
        orderBy = "p.name ASC";
        break;
      case "name-desc":
        orderBy = "p.name DESC";
        break;
      default:
        orderBy = "p.id DESC";
    }

    // Get paginated products with sorting and category filter
    const [products] = await connection.execute(
      `SELECT 
        p.id,
        p.name,
        p.price,
        p.image_url,
        p.item_details,
        c.category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?`,
      [categoryId, limit.toString(), offset.toString()]
    );

    // Close the connection
    await connection.end();

    // Format the response
    const formattedProducts = products.map((product) => {
      // Parse item_details if it's a string, otherwise use the object directly
      let itemDetails = {};
      try {
        itemDetails =
          typeof product.item_details === "string"
            ? JSON.parse(product.item_details)
            : product.item_details || {};
      } catch (e) {
        console.error("Error parsing item_details:", e);
        itemDetails = {};
      }

      return {
        id: product.id,
        name: product.name,
        price: `$${Number(product.price).toFixed(2)}`,
        image: product.image_url,
        itemDetails: {
          Type: itemDetails.Type || "N/A",
          Color: itemDetails.Color || "N/A",
          Size: itemDetails.Size || "N/A",
        },
        category: product.category_name,
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

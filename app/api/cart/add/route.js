import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "utamarket",
};

export async function POST(request) {
  let connection;
  try {
    // Get the token from the cookie - properly awaited both calls
    const cookieStore = await cookies();
    const token = await cookieStore.get("auth_token");
    const tokenValue = token?.value;

    if (!tokenValue) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(
      tokenValue,
      process.env.JWT_SECRET || "utamarket_secret_key_2024"
    );

    // Get request body
    const body = await request.json();
    const { productId, quantity, selectedSize, selectedColor } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { message: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    // Create database connection
    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Check if product exists and has enough stock
      const [products] = await connection.execute(
        "SELECT id, stock_quantity FROM products WHERE id = ?",
        [productId]
      );

      if (products.length === 0) {
        throw new Error("Product not found");
      }

      const product = products[0];
      if (product.stock_quantity < quantity) {
        throw new Error("Not enough stock available");
      }

      // Get or create active cart for user
      const [carts] = await connection.execute(
        "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
        [decoded.userId]
      );

      let cartId;
      if (carts.length === 0) {
        // Create new cart
        const [result] = await connection.execute(
          "INSERT INTO carts (user_id) VALUES (?)",
          [decoded.userId]
        );
        cartId = result.insertId;
      } else {
        cartId = carts[0].id;
      }

      // Add or update cart item
      const [existingItems] = await connection.execute(
        `SELECT id, quantity FROM cart_items 
         WHERE cart_id = ? AND product_id = ? AND selected_size = ? AND selected_color = ?`,
        [cartId, productId, selectedSize || null, selectedColor || null]
      );

      if (existingItems.length > 0) {
        // Update existing item
        await connection.execute(
          `UPDATE cart_items 
           SET quantity = quantity + ?
           WHERE id = ?`,
          [quantity, existingItems[0].id]
        );
      } else {
        // Add new item
        await connection.execute(
          `INSERT INTO cart_items 
           (cart_id, product_id, quantity, selected_size, selected_color)
           VALUES (?, ?, ?, ?, ?)`,
          [
            cartId,
            productId,
            quantity,
            selectedSize || null,
            selectedColor || null,
          ]
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        message: "Item added to cart successfully",
        cartId,
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);

    if (error.message === "Product not found") {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (error.message === "Not enough stock available") {
      return NextResponse.json(
        { message: "Not enough stock available" },
        { status: 400 }
      );
    }

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

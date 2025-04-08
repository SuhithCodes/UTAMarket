const mysql = require("mysql2/promise");

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "utamarket",
};

async function createProductSizesTable() {
  let connection;
  try {
    // Create database connection
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database successfully");

    // Create product_sizes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_sizes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        size VARCHAR(10) NOT NULL,
        stock_quantity INT NOT NULL DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE KEY unique_product_size (product_id, size)
      )
    `);

    console.log("Product sizes table created successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

// Execute the function
createProductSizesTable();

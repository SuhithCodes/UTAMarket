const mysql = require("mysql2/promise");

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "utamarket",
};

async function updateAIRecommendationLogs() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database successfully");

    // Clear existing logs to avoid duplicates
    await connection.execute("TRUNCATE TABLE ai_recommendation_logs");
    console.log("Cleared existing AI recommendation logs");

    // 1. Insert View interactions from browsing_history
    const [viewResults] = await connection.execute(`
      INSERT INTO ai_recommendation_logs (user_id, product_id, interaction_type, recommendation_time)
      SELECT 
        user_id,
        product_id,
        'View' as interaction_type,
        view_timestamp as recommendation_time
      FROM browsing_history
    `);
    console.log(`Inserted ${viewResults.affectedRows} View interactions`);

    // 2. Insert Wishlist interactions
    const [wishlistResults] = await connection.execute(`
      INSERT INTO ai_recommendation_logs (user_id, product_id, interaction_type, recommendation_time)
      SELECT 
        user_id,
        product_id,
        'Wishlist' as interaction_type,
        created_at as recommendation_time
      FROM wishlists
    `);
    console.log(
      `Inserted ${wishlistResults.affectedRows} Wishlist interactions`
    );

    // 3. Insert Purchase interactions from completed orders
    const [purchaseResults] = await connection.execute(`
      INSERT INTO ai_recommendation_logs (user_id, product_id, interaction_type, recommendation_time)
      SELECT DISTINCT
        c.user_id,
        ci.product_id,
        'Purchase' as interaction_type,
        c.updated_at as recommendation_time
      FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.status = 'converted_to_order'
    `);
    console.log(
      `Inserted ${purchaseResults.affectedRows} Purchase interactions`
    );

    // 4. Insert Add to Cart interactions from active carts
    const [cartResults] = await connection.execute(`
      INSERT INTO ai_recommendation_logs (user_id, product_id, interaction_type, recommendation_time)
      SELECT DISTINCT
        c.user_id,
        ci.product_id,
        'Add to Cart' as interaction_type,
        ci.created_at as recommendation_time
      FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.status = 'active'
    `);
    console.log(
      `Inserted ${cartResults.affectedRows} Add to Cart interactions`
    );

    // Get total count of interactions
    const [totalCount] = await connection.execute(
      "SELECT COUNT(*) as total FROM ai_recommendation_logs"
    );
    console.log(`Total AI recommendation logs: ${totalCount[0].total}`);

    // Get count by interaction type
    const [typeCounts] = await connection.execute(`
      SELECT interaction_type, COUNT(*) as count 
      FROM ai_recommendation_logs 
      GROUP BY interaction_type
    `);
    console.log("\nInteractions by type:");
    typeCounts.forEach((type) => {
      console.log(`${type.interaction_type}: ${type.count}`);
    });
  } catch (error) {
    console.error("Error updating AI recommendation logs:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\nDatabase connection closed");
    }
  }
}

// Run the update
updateAIRecommendationLogs().catch(console.error);

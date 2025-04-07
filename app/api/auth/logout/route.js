import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Get the cookie store
    const cookieStore = cookies();

    // Delete the auth token cookie
    cookieStore.delete("auth_token");

    // You might want to add additional server-side cleanup here
    // For example, invalidating any active sessions in the database

    return NextResponse.json(
      { message: "Logged out successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie":
            "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=strict",
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Failed to logout" }, { status: 500 });
  }
}

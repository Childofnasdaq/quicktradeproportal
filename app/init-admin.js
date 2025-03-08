// This script creates an admin user if none exists
// It runs on the client side when the app loads

// Create admin user function
function createAdminUser() {
  try {
    // Check if we already have an admin user
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const adminExists = users.some((user) => user.isAdmin === true)

    if (!adminExists) {
      // Create admin users with both email formats
      const adminUsers = [
        {
          id: "admin-" + Date.now().toString(),
          email: "admin@quicktradepro.com",
          password: "admin123",
          name: "Admin",
          displayName: "System Admin",
          mentorId: 999999,
          approved: true,
          isAdmin: true,
        },
        {
          id: "admin2-" + Date.now().toString(),
          email: "admin@0785345880",
          password: "admin123",
          name: "Admin",
          displayName: "System Admin",
          mentorId: 888888,
          approved: true,
          isAdmin: true,
        },
      ]

      users.push(...adminUsers)
      localStorage.setItem("users", JSON.stringify(users))
      console.log("Admin users created")
    }
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

// Execute the function
if (typeof window !== "undefined") {
  createAdminUser()
}


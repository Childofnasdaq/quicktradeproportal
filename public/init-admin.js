// This script ensures the admin user exists in localStorage
// It runs on the client side when the app loads

if (typeof window !== "undefined") {
  // Check if we already have an admin user
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const adminExists = users.some((user) => user.isAdmin === true)

  if (!adminExists) {
    // Create admin user
    const adminUser = {
      id: "admin-" + Date.now().toString(),
      email: "admin@quicktradepro.com",
      password: "admin123",
      name: "Admin",
      displayName: "System Admin",
      mentorId: 999999,
      approved: true,
      isAdmin: true,
    }

    users.push(adminUser)
    localStorage.setItem("users", JSON.stringify(users))
    console.log("Admin user created")
  }
}


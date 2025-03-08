import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return "N/A"
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let key = ""

  // Generate 5 groups of 5 characters separated by hyphens
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    if (i < 4) key += "-"
  }

  return key
}

export function calculateExpiryDate(plan: string, startDate: Date): Date {
  const date = new Date(startDate)

  switch (plan) {
    case "3days":
      date.setDate(date.getDate() + 3)
      break
    case "5days":
      date.setDate(date.getDate() + 5)
      break
    case "30days":
      date.setDate(date.getDate() + 30)
      break
    case "3months":
      date.setMonth(date.getMonth() + 3)
      break
    case "6months":
      date.setMonth(date.getMonth() + 6)
      break
    case "1year":
      date.setFullYear(date.getFullYear() + 1)
      break
    case "lifetime":
      // Set to a far future date for "lifetime"
      date.setFullYear(date.getFullYear() + 100)
      break
    default:
      date.setDate(date.getDate() + 30) // Default to 30 days
  }

  return date
}

export function getPlanDisplayName(planId: string): string {
  const plans: Record<string, string> = {
    "3days": "3 Days",
    "5days": "5 Days",
    "30days": "30 Days",
    "3months": "3 Months",
    "6months": "6 Months",
    "1year": "1 Year",
    lifetime: "Lifetime",
  }

  return plans[planId] || planId
}

export function generateMentorId(): number {
  // Generate a random 6-digit mentor ID
  return Math.floor(100000 + Math.random() * 900000)
}

export function isAdminEmail(email: string): boolean {
  // Check if the email is in the admin format
  return email === "admin@quicktradepro.com" || email === "admin@0785345880"
}


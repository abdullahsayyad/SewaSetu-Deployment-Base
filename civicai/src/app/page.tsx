import { redirect } from "next/navigation"

export default function Home() {
  // Redirect root to Citizen login by default
  redirect("/citizen/login")
}

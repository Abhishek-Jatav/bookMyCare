const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Register user
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Login user
export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Fetch user profile (needs auth headers)
export async function getProfile(headers = {}) {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    headers,
  });
  if (!res.ok) throw new Error("Invalid token or unauthorized");
  return res.json();
}

// Fetch providers list (needs auth headers)
export async function fetchProviders(headers = {}) {
  const res = await fetch(`${API_BASE}/providers`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch providers");
  return res.json();
}

// Fetch bookings for customer (needs auth headers)
export async function fetchBookings(userId: number, headers = {}) {
  const res = await fetch(`${API_BASE}/appointments/${userId}`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

// Create booking (needs auth headers)
export async function createBooking(
  customerId: number,
  providerId: number,
  date: string,
  timeSlot: string,
  headers = {}
) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ customerId, providerId, date, timeSlot }),
  });
  if (!res.ok) throw new Error("Booking failed");
  return res.json();
}

// Cancel booking (needs auth headers)
export async function cancelBooking(
  bookingId: number,
  customerId: number,
  headers = {}
) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ customerId }),
  });
  if (!res.ok) throw new Error("Cancel booking failed");
  return res.json();
}


// Fetch provider's availability slots (needs auth headers)
export async function fetchProviderAvailability(
  providerId: number,
  headers = {}
) {
  const res = await fetch(`${API_BASE}/availability/${providerId}`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch availability");
  return res.json();
}

// Add availability slot (needs auth headers)
export async function addAvailabilitySlot(
  providerId: number,
  date: string,
  timeSlot: string,
  headers = {}
) {
  const res = await fetch(`${API_BASE}/availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ providerId, date, timeSlot }),
  });
  if (!res.ok) throw new Error("Failed to add availability slot");
  return res.json();
}

// Fetch provider's bookings (appointments)
export async function fetchProviderBookings(providerId: number, headers = {}) {
  const res = await fetch(`${API_BASE}/appointments/provider/${providerId}`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchProviders,
  fetchBookings,
  createBooking,
  cancelBooking,
} from "@/lib/api";
import Spinner from "./Spinner";

export default function CustomerDashboard() {
  const { user, loading, getAuthHeaders } = useAuth();
  const [providers, setProviders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingSlot, setBookingSlot] = useState({
    providerId: 0,
    date: "",
    timeSlot: "",
  });

  useEffect(() => {
    if (!user) return;

    setLoadingProviders(true);
    fetchProviders(getAuthHeaders())
      .then(setProviders)
      .catch(() => setError("Failed to load providers"))
      .finally(() => setLoadingProviders(false));

    setLoadingBookings(true);
    fetchBookings(user.id, getAuthHeaders())
      .then(setBookings)
      .catch(() => setError("Failed to load bookings"))
      .finally(() => setLoadingBookings(false));
  }, [user, getAuthHeaders]);

  if (loading) return <p>Loading user data...</p>;
  if (!user) return <p>Please login to see this page.</p>;

  // Handlers
  const handleBook = async () => {
    setError("");
    try {
      if (
        !bookingSlot.providerId ||
        !bookingSlot.date ||
        !bookingSlot.timeSlot
      ) {
        setError("Please select provider, date, and time slot");
        return;
      }
      await createBooking(
        user.id,
        bookingSlot.providerId,
        bookingSlot.date,
        bookingSlot.timeSlot,
        getAuthHeaders()
      );
      alert("Booking successful!");
      // Refresh bookings
      const updated = await fetchBookings(user.id, getAuthHeaders());
      setBookings(updated);
    } catch (err: any) {
      setError(err.message || "Booking failed");
    }
  };

  const handleCancel = async (bookingId: number) => {
    setError("");
    try {
      await cancelBooking(bookingId, user.id, getAuthHeaders());
      alert("Booking cancelled");
      // Refresh bookings
      const updated = await fetchBookings(user.id, getAuthHeaders());
      setBookings(updated);
    } catch (err: any) {
      setError(err.message || "Cancel failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Providers List */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Available Providers</h2>
        {loadingProviders ? (
          <Spinner />
        ) : (
          <ul className="space-y-2">
            {providers.map((p) => (
              <li key={p.id} className="border p-3 rounded">
                <p className="font-semibold">{p.name}</p>
                <p>Email: {p.email}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Booking Form */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Book a Slot</h2>
        <div className="flex flex-col space-y-3 max-w-md">
          <select
            value={bookingSlot.providerId}
            onChange={(e) =>
              setBookingSlot({
                ...bookingSlot,
                providerId: Number(e.target.value),
              })
            }
            className="border p-2 rounded">
            <option value={0}>Select Provider</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={bookingSlot.date}
            onChange={(e) =>
              setBookingSlot({ ...bookingSlot, date: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Time Slot (e.g. 10:00 AM - 10:30 AM)"
            value={bookingSlot.timeSlot}
            onChange={(e) =>
              setBookingSlot({ ...bookingSlot, timeSlot: e.target.value })
            }
            className="border p-2 rounded"
          />

          <button
            onClick={handleBook}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </section>

      {/* Bookings List */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Your Bookings</h2>
        {loadingBookings ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          <ul className="space-y-2 max-w-md">
            {bookings.map((b) => (
              <li
                key={b.id}
                className={`border p-3 rounded flex justify-between items-center ${
                  b.status === "CANCELLED" ? "opacity-50" : ""
                }`}>
                <div>
                  <p>
                    Date: {new Date(b.date).toLocaleDateString()} - {b.timeSlot}
                  </p>
                  <p>Status: {b.status}</p>
                </div>
                {b.status === "BOOKED" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

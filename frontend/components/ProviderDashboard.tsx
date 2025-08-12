"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchProviderAvailability,
  addAvailabilitySlot,
  fetchProviderBookings,
  cancelBooking,
} from "@/lib/api";
import Spinner from "./Spinner";

export default function ProviderDashboard() {
  const { user, loading, getAuthHeaders } = useAuth();

  const [availability, setAvailability] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: "", timeSlot: "" });

  useEffect(() => {
    if (!user) return;
    setLoadingAvailability(true);
    fetchProviderAvailability(user.id, getAuthHeaders())
      .then(setAvailability)
      .catch(() => setError("Failed to load availability"))
      .finally(() => setLoadingAvailability(false));

    setLoadingBookings(true);
    fetchProviderBookings(user.id, getAuthHeaders())
      .then(setBookings)
      .catch(() => setError("Failed to load bookings"))
      .finally(() => setLoadingBookings(false));
  }, [user, getAuthHeaders]);

  if (loading) return <p>Loading user data...</p>;
  if (!user) return <p>Please login to see this page.</p>;

  // Add new availability slot
  const handleAddSlot = async () => {
    setError("");
    try {
      if (!newSlot.date || !newSlot.timeSlot) {
        setError("Please select date and enter time slot");
        return;
      }
      await addAvailabilitySlot(
        user.id,
        newSlot.date,
        newSlot.timeSlot,
        getAuthHeaders()
      );
      alert("Availability slot added!");
      // Refresh availability
      const updated = await fetchProviderAvailability(
        user.id,
        getAuthHeaders()
      );
      setAvailability(updated);
      setNewSlot({ date: "", timeSlot: "" });
    } catch (err: any) {
      setError(err.message || "Failed to add slot");
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId: number) => {
    setError("");
    try {
      await cancelBooking(bookingId, user.id, getAuthHeaders());
      alert("Booking cancelled");
      // Refresh bookings
      const updated = await fetchProviderBookings(user.id, getAuthHeaders());
      setBookings(updated);
    } catch (err: any) {
      setError(err.message || "Cancel failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Availability Section */}
      <section className="mb-8 max-w-md">
        <h2 className="text-xl font-semibold mb-3">
          Manage Availability Slots
        </h2>

        <div className="flex flex-col space-y-3 mb-4">
          <input
            type="date"
            value={newSlot.date}
            onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Time Slot (e.g. 10:00 AM - 10:30 AM)"
            value={newSlot.timeSlot}
            onChange={(e) =>
              setNewSlot({ ...newSlot, timeSlot: e.target.value })
            }
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddSlot}
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Add Slot
          </button>
        </div>

        {loadingAvailability ? (
          <Spinner />
        ) : availability.length === 0 ? (
          <p>No availability slots yet.</p>
        ) : (
          <ul className="space-y-2">
            {availability.map((slot) => (
              <li
                key={slot.id}
                className="border p-3 rounded flex justify-between">
                <span>
                  {new Date(slot.date).toLocaleDateString()} - {slot.timeSlot}
                </span>
                <span>{slot.isBooked ? "Booked" : "Available"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bookings Section */}
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
                  <p>Customer: {b.customer?.name || b.customerId}</p>
                </div>
                {b.status === "BOOKED" && (
                  <button
                    onClick={() => handleCancelBooking(b.id)}
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

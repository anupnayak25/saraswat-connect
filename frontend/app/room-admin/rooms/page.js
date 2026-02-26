"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

function AdminRoomsContent() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    max_guests: "",
    is_ac: false,
    is_available: true,
    amenities: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase.from("rooms").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        max_guests: parseInt(formData.max_guests),
        amenities: formData.amenities ? formData.amenities.split(",").map((a) => a.trim()) : [],
      };

      if (editingRoom) {
        const { error } = await supabase.from("rooms").update(roomData).eq("id", editingRoom.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("rooms").insert([roomData]);
        if (error) throw error;
      }

      setShowModal(false);
      setEditingRoom(null);
      resetForm();
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      alert("Error saving room: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || "",
      price: room.price,
      max_guests: room.max_guests,
      is_ac: room.is_ac,
      is_available: room.is_available,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      const { error } = await supabase.from("rooms").delete().eq("id", id);
      if (error) throw error;
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Error deleting room: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      max_guests: "",
      is_ac: false,
      is_available: true,
      amenities: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activePage="Rooms" />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Rooms Management</h1>
            <p className="text-gray-600 mt-1">Manage all available rooms</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingRoom(null);
              setShowModal(true);
            }}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-semibold">
            + Add New Room
          </button>
        </div>

        {loading && !showModal ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        room.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                      {room.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{room.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-2xl font-bold text-orange-600">₹{room.price}/night</p>
                    <p className="text-sm text-gray-600">
                      {room.max_guests} Guests • {room.is_ac ? "AC" : "Non-AC"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingRoom ? "Edit Room" : "Add New Room"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night (₹) *</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests *</label>
                      <input
                        type="number"
                        required
                        value={formData.max_guests}
                        onChange={(e) => setFormData({ ...formData, max_guests: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="WiFi, TV, Hot Water"
                      value={formData.amenities}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_ac}
                        onChange={(e) => setFormData({ ...formData, is_ac: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Air Conditioned</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_available}
                        onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Available</span>
                    </label>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50">
                      {loading ? "Saving..." : editingRoom ? "Update Room" : "Add Room"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingRoom(null);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminRooms() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminRoomsContent />
    </ProtectedRoute>
  );
}

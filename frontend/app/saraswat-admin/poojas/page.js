"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/saraswat-admin/AdminLayout";
import FormModal from "@/components/saraswat-admin/FormModal";

export default function PoojasPage() {
  const [poojas, setPoojas] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentItem, setCurrentItem] = useState(null);
  const messageHandlerRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [poojasResult, placesResult] = await Promise.all([
        supabase.from("poojas").select("*, place:places(name)").order("created_at", { ascending: false }),
        supabase.from("places").select("*"),
      ]);

      if (poojasResult.error) throw poojasResult.error;
      if (placesResult.error) throw placesResult.error;

      setPoojas(poojasResult.data || []);
      setPlaces(placesResult.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode("add");
    setCurrentItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalMode("edit");
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this pooja?")) return;

    try {
      const { error } = await supabase.from("poojas").delete().eq("id", id);
      if (error) throw error;

      messageHandlerRef.current?.("success", "Pooja deleted successfully!");
      await loadData();
    } catch (error) {
      messageHandlerRef.current?.("error", `Error deleting pooja: ${error.message}`);
    }
  };

  const renderForm = (formData, handleChange) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
        <select
          name="type"
          value={formData.type || ""}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
          <option value="">Select type</option>
          <option value="daily">Daily</option>
          <option value="special">Special</option>
          <option value="festival">Festival</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Temple Place *</label>
        <select
          name="temple_place_id"
          value={formData.temple_place_id || ""}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
          <option value="">Select place</option>
          {places.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
        <input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timings</label>
        <input
          type="text"
          name="timings"
          value={formData.timings || ""}
          onChange={handleChange}
          placeholder="e.g., 6:00 AM - 8:00 PM"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
        <input
          type="text"
          name="duration"
          value={formData.duration || ""}
          onChange={handleChange}
          placeholder="e.g., 30 minutes"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </>
  );

  return (
    <AdminLayout title="Poojas Management" description="Manage temple ceremonies and rituals">
      {({ showMessage }) => {
        setMessageHandler(() => showMessage);

        return (
          <>
            <div className="mb-6">
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
                + Add New Pooja
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Temple
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timings
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {poojas.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No poojas found. Click &quot;Add New Pooja&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      poojas.map((pooja) => (
                        <tr key={pooja.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{pooja.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pooja.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {pooja.place?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{pooja.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {pooja.timings || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(pooja)}
                              className="text-blue-600 hover:text-blue-900 mr-4">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(pooja.id)} className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {showModal && (
              <FormModal
                mode={modalMode}
                table="poojas"
                item={currentItem}
                onClose={() => {
                  setShowModal(false);
                  setCurrentItem(null);
                }}
                onSuccess={() => {
                  setShowModal(false);
                  setCurrentItem(null);
                  loadData();
                  showMessage("success", `Pooja ${modalMode === "add" ? "added" : "updated"} successfully!`);
                }}
                onError={(error) => showMessage("error", error)}
                renderForm={renderForm}
              />
            )}
          </>
        );
      }}
    </AdminLayout>
  );
}

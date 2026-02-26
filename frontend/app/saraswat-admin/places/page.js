"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/saraswat-admin/AdminLayout";
import FormModal from "@/components/saraswat-admin/FormModal";

export default function PlacesPage() {
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
      const { data, error } = await supabase.from("places").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      setPlaces(data || []);
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
    if (!confirm("Are you sure you want to delete this place?")) return;

    try {
      const { error } = await supabase.from("places").delete().eq("id", id);
      if (error) throw error;

      messageHandlerRef.current?.("success", "Place deleted successfully!");
      await loadData();
    } catch (error) {
      messageHandlerRef.current?.("error", `Error deleting place: ${error.message}`);
    }
  };

  const renderForm = (formData, handleChange) => (
    <>
      <div className="md:col-span-2">
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
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="4"
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
    <AdminLayout title="Places Management" description="Manage religious and tourist locations">
      {({ showMessage }) => {
        messageHandlerRef.current = showMessage;

        return (
          <>
            <div className="mb-6">
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
                + Add New Place
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
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image URL
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {places.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                          No places found. Click &quot;Add New Place&quot;to create one.
                        </td>
                      </tr>
                    ) : (
                      places.map((place) => (
                        <tr key={place.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{place.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                            {place.description || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-blue-600 truncate max-w-xs">
                            {place.image_url || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(place)}
                              className="text-blue-600 hover:text-blue-900 mr-4">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(place.id)} className="text-red-600 hover:text-red-900">
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
                table="places"
                item={currentItem}
                onClose={() => {
                  setShowModal(false);
                  setCurrentItem(null);
                }}
                onSuccess={() => {
                  setShowModal(false);
                  setCurrentItem(null);
                  loadData();
                  showMessage("success", `Place ${modalMode === "add" ? "added" : "updated"} successfully!`);
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

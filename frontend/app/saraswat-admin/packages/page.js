"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/saraswat-admin/AdminLayout";
import FormModal from "@/components/saraswat-admin/FormModal";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
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
      const [packagesResult, placesResult] = await Promise.all([
        supabase.from("packages").select("*, place:places(name)").order("created_at", { ascending: false }),
        supabase.from("places").select("*"),
      ]);

      if (packagesResult.error) throw packagesResult.error;
      if (placesResult.error) throw placesResult.error;

      setPackages(packagesResult.data || []);
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
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const { error } = await supabase.from("packages").delete().eq("id", id);
      if (error) throw error;

      messageHandlerRef.current?.("success", "Package deleted successfully!");
      await loadData();
    } catch (error) {
      messageHandlerRef.current?.("error", `Error deleting package: ${error.message}`);
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Place *</label>
        <select
          name="place_id"
          value={formData.place_id || ""}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days) *</label>
        <input
          type="number"
          name="duration_days"
          value={formData.duration_days || ""}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
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
      <div className="md:col-span-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_available"
            checked={formData.is_available !== false}
            onChange={handleChange}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">Available for booking</span>
        </label>
      </div>
    </>
  );

  return (
    <AdminLayout title="Packages Management" description="Manage tour packages and offerings">
      {({ showMessage }) => {
        messageHandlerRef.current = showMessage;

        return (
          <>
            <div className="mb-6">
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
                + Add New Package
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
                        Place
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {packages.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No packages found. Click &quot;Add New Package&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      packages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{pkg.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {pkg.place?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {pkg.duration_days} days
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{pkg.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                pkg.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                              {pkg.is_available ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEdit(pkg)} className="text-blue-600 hover:text-blue-900 mr-4">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(pkg.id)} className="text-red-600 hover:text-red-900">
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
                table="packages"
                item={currentItem}
                onClose={() => {
                  setShowModal(false);
                  setCurrentItem(null);
                }}
                onSuccess={() => {
                  setShowModal(false);
                  setCurrentItem(null);
                  loadData();
                  showMessage("success", `Package ${modalMode === "add" ? "added" : "updated"} successfully!`);
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

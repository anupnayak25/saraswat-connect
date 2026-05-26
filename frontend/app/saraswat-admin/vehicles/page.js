"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/saraswat-admin/AdminLayout";
import FormModal from "@/components/saraswat-admin/FormModal";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/contexts/AuthContext";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentItem, setCurrentItem] = useState(null);
  const messageHandlerRef = useRef(null);
  const { confirm } = useToast();
  const { user, loading: authLoading } = useAuth();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    loadData();
  }, [authLoading, user, loadData]);

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
    const confirmed = await confirm("Are you sure you want to delete this vehicle?");
    if (!confirmed) return;

    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw error;

      messageHandlerRef.current?.("success", "Vehicle deleted successfully!");
      await loadData();
    } catch (error) {
      messageHandlerRef.current?.("error", `Error deleting vehicle: ${error.message}`);
    }
  };

  const renderForm = (formData, handleChange) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type *</label>
        <input
          type="text"
          name="type"
          value={formData.type || ""}
          onChange={handleChange}
          required
          placeholder="e.g. Car, SUV, Bus"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
        <input
          type="text"
          name="vehicle_number"
          value={formData.vehicle_number || ""}
          onChange={handleChange}
          placeholder="e.g. KA01AB1234"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity || ""}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price per Km (₹) *</label>
        <input
          type="number"
          name="price_per_km"
          value={formData.price_per_km || ""}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status *</label>
        <select
          name="availability_status"
          value={formData.availability_status || "available"}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div>
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
    <AdminLayout title="Vehicles Management" description="Manage cars, buses and other transport options">
      {({ showMessage }) => {
        messageHandlerRef.current = showMessage;

        return (
          <>
            <div className="mb-6">
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
                + Add New Vehicle
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
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price/Km
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vehicles.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No vehicles found. Click &quot;Add New Vehicle&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{vehicle.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {vehicle.vehicle_number || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vehicle.capacity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{vehicle.price_per_km}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                vehicle.availability_status === "available"
                                  ? "bg-green-100 text-green-800"
                                  : vehicle.availability_status === "booked"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}>
                              {vehicle.availability_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleEdit(vehicle)}
                              className="text-blue-600 hover:text-blue-900 mr-4">
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(vehicle.id)}
                              className="text-red-600 hover:text-red-900">
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
                table="vehicles"
                item={currentItem}
                onClose={() => {
                  setShowModal(false);
                  setCurrentItem(null);
                }}
                onSuccess={() => {
                  setShowModal(false);
                  setCurrentItem(null);
                  loadData();
                  showMessage("success", `Vehicle ${modalMode === "add" ? "added" : "updated"} successfully!`);
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

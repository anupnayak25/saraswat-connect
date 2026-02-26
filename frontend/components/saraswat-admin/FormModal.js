"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function FormModal({ mode, table, item, onClose, onSuccess, onError, renderForm }) {
  const [formData, setFormData] = useState(item || {});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let result;

      if (mode === "add") {
        result = await supabase.from(table).insert([formData]);
      } else {
        result = await supabase.from(table).update(formData).eq("id", item.id);
      }

      if (result.error) throw result.error;

      onSuccess();
    } catch (error) {
      onError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getTableLabel = () => {
    const labels = {
      poojas: "Pooja",
      places: "Place",
      packages: "Package",
      rooms: "Room",
    };
    return labels[table] || table;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "add" ? "Add New" : "Edit"} {getTableLabel()}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderForm(formData, handleChange)}</div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? "Saving..." : mode === "add" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

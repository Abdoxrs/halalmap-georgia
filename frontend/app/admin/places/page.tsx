'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getAllPlaces, createPlace, updatePlace, deletePlace, togglePlaceVerified } from '@/lib/api';
import type { Place, PlaceFormData, Coordinates } from '@/lib/types';
import toast from 'react-hot-toast';

// Dynamic import for AdminMapPicker to prevent SSR issues
const AdminMapPicker = dynamic(() => import('@/components/AdminMapPicker'), {
  ssr: false,
});

export default function PlacesManagement() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState<PlaceFormData>({
    name: '',
    type: 'restaurant',
    latitude: 41.7151,
    longitude: 44.8271,
    city: 'Tbilisi',
  });

  const fetchPlaces = async () => {
    try {
      const response = await getAllPlaces();
      setPlaces(response.data);
    } catch (error) {
      toast.error('Failed to load places');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlace) {
        await updatePlace(editingPlace.id, formData);
        toast.success('Place updated!');
      } else {
        await createPlace(formData);
        toast.success('Place created!');
      }
      setShowForm(false);
      setEditingPlace(null);
      resetForm();
      fetchPlaces();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (place: Place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      type: place.type,
      latitude: place.latitude,
      longitude: place.longitude,
      city: place.city || '',
      address: place.address || '',
      description: place.description || '',
      phone: place.phone || '',
      website: place.website || '',
      verified: place.verified,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this place?')) return;
    try {
      await deletePlace(id);
      toast.success('Place deleted');
      fetchPlaces();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleToggleVerified = async (id: number) => {
    try {
      await togglePlaceVerified(id);
      toast.success('Verification updated');
      fetchPlaces();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'restaurant',
      latitude: 41.7151,
      longitude: 44.8271,
      city: 'Tbilisi',
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="spinner border-primary-600"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Places Management</h1>
        <button onClick={() => { setShowForm(true); setEditingPlace(null); resetForm(); }} className="btn-primary">
          ➕ Add Place
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingPlace ? 'Edit Place' : 'Add New Place'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input" required />
            </div>
            <div>
              <label className="label">Type *</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} className="input">
                <option value="restaurant">Restaurant</option>
                <option value="mosque">Mosque</option>
              </select>
            </div>
            
            {/* Location picker section */}
            <div className="md:col-span-2">
              <label className="label">Location on Map *</label>
              <AdminMapPicker
                coordinates={{ lat: formData.latitude, lng: formData.longitude }}
                onCoordinatesChange={(coords: Coordinates) => {
                  setFormData({
                    ...formData,
                    latitude: coords.lat,
                    longitude: coords.lng,
                  });
                }}
                defaultCenter={{ lat: 41.7151, lng: 44.8271 }}
              />
            </div>
            
            {/* Legacy direct input fields (hidden but still functional) */}
            <div className="hidden">
              <label className="label">Latitude *</label>
              <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})} className="input" required />
            </div>
            <div className="hidden">
              <label className="label">Longitude *</label>
              <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})} className="input" required />
            </div>
            
            <div>
              <label className="label">City</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="text" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Address</label>
              <input type="text" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} className="input" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input" rows={3} />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingPlace(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {places.map((place) => (
              <tr key={place.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{place.name}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`badge ${place.type === 'restaurant' ? 'badge-yellow' : 'bg-blue-100 text-blue-800'}`}>{place.type}</span></td>
                <td className="px-6 py-4 whitespace-nowrap">{place.city}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`badge ${place.verified ? 'badge-green' : 'badge-yellow'}`}>{place.verified ? 'Verified' : 'Pending'}</span></td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button onClick={() => handleToggleVerified(place.id)} className="text-primary-600 hover:text-primary-700 text-sm">Toggle ✓</button>
                  <button onClick={() => handleEdit(place)} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                  <button onClick={() => handleDelete(place.id)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

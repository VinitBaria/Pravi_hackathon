'use client';

import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { useAuth } from '@/app/providers';

function MapEventsHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

export default function MapComponent({ projects = [], bridges = [] }) {
  const { role } = useAuth();
  const [isDrawing, setIsDrawing] = useState(false);
  const [newRoadCoords, setNewRoadCoords] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const RAJKOT_CENTER = [22.3039, 70.8022];
  const MAP_ATTR = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ';
  const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

  const getRciColor = (rci) => {
    if (rci >= 80) return '#22c55e'; // Green
    if (rci >= 50) return '#eab308'; // Yellow
    if (rci >= 25) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const handleMapClick = (latlng) => {
    if (isDrawing) {
      setNewRoadCoords(prev => [...prev, latlng]);
    }
  };

  const saveRoad = () => {
    if (!selectedProjectId) {
      alert("Please select a Project from the dropdown to assign this geometry.");
      return;
    }
    if (newRoadCoords.length < 2) {
      alert("Please map at least two points for a road.");
      return;
    }
    alert(`Successfully mapped geometry for project ${selectedProjectId} with ${newRoadCoords.length} nodes! (Ready for DB insert)`);
    setIsDrawing(false);
    setNewRoadCoords([]);
    setSelectedProjectId('');
  };

  return (
    <div className="relative w-full h-full">
      {/* GIS Tool Panel */}
      {role === 'surveyor' && (
        <div className="absolute top-4 right-4 z-[1000] bg-[var(--bg-card)] p-4 rounded-lg shadow-xl border border-[var(--border)] flex flex-col gap-3 min-w-[280px]">
          <h4 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">GIS Team Mapping Tool</h4>
          
          {!isDrawing ? (
            <button onClick={() => setIsDrawing(true)} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors w-full">
              Start Mapping New Road
            </button>
          ) : (
            <form action={async (formData) => {
              const submitType = formData.get('submitType');
              const isFinal = submitType === 'final';
              const isClear = submitType === 'clear';
              const coordsJSON = JSON.stringify(newRoadCoords);
              const { saveGISMapping } = await import('@/app/actions');
              
              await saveGISMapping(selectedProjectId, coordsJSON, formData, isFinal, isClear);
              
              setIsDrawing(false);
              setNewRoadCoords([]);
              setSelectedProjectId('');
              if (isFinal) alert('Final submission successful! The mapping is locked and the project has been forwarded.');
              else if (isClear) alert('Draft mapping cleared successfully.');
              else alert('Draft mapping saved successfully! You can change it later.');
            }} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Assign to Project (Pending GIS):</label>
                <select 
                  name="projectId"
                  required
                  className="w-full bg-[var(--bg-body)] border border-[var(--border)] text-[var(--text-primary)] text-xs p-2 rounded-md outline-none"
                  value={selectedProjectId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    setSelectedProjectId(pid);
                    const p = projects.find(x => x.id === pid);
                    if (p && p.coordinates) {
                      try {
                        const parsed = JSON.parse(p.coordinates);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          setNewRoadCoords(parsed);
                          return;
                        }
                      } catch (err) {}
                    }
                    setNewRoadCoords([]);
                  }}
                >
                  <option value="">-- Select Project --</option>
                  {projects.filter(p => p.current_step === 2).map(p => (
                    <option key={`select-${p.id}`} value={p.id}>{p.id} - {p.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="text-xs text-blue-500 bg-blue-500/10 p-2 rounded animate-pulse border border-blue-500/20">
                Click on the map to drop coordinate nodes... ({newRoadCoords.length} nodes)
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Upload GIS Document:</label>
                <input type="file" name="document" required className="w-full text-xs text-[var(--text-secondary)] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-600 file:text-white border border-[var(--border)] rounded bg-[var(--bg-body)] p-1" />
              </div>

              <div className="flex flex-col gap-2 mt-1">
                {(() => {
                  const p = projects.find(x => x.id === selectedProjectId);
                  const isBuilding = p?.asset_category === 'Building';
                  const minCoords = isBuilding ? 1 : 2;
                  const isValid = newRoadCoords.length >= minCoords && selectedProjectId;
                  
                  return (
                    <>
                      <button type="submit" name="submitType" value="draft" disabled={!isValid} className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50">
                        Save Draft Mapping
                      </button>
                      <button type="submit" name="submitType" value="final" disabled={!isValid} className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50">
                        Final Submission (Lock & Forward)
                      </button>
                    </>
                  );
                })()}
                <button type="submit" name="submitType" value="clear" disabled={!selectedProjectId} className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 mt-1">
                  Clear / Remove Draft
                </button>
                <button type="button" onClick={() => { setIsDrawing(false); setNewRoadCoords([]); setSelectedProjectId(''); }} className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors mt-1">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <MapContainer center={RAJKOT_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={TILE_URL} attribution={MAP_ATTR} />
        <MapEventsHandler onMapClick={handleMapClick} />
        
        {/* Draw Mode Active */}
        {newRoadCoords.length > 0 && (
          (() => {
            const isBuilding = projects.find(x => x.id === selectedProjectId)?.asset_category === 'Building';
            if (isBuilding) {
              const buildingIcon = new L.DivIcon({
                html: '<div style="font-size: 32px; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5));">🏢</div>',
                className: 'custom-building-icon',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
              });
              return (
                <Marker position={newRoadCoords[newRoadCoords.length - 1]} icon={buildingIcon}>
                  <Popup>New Building Location Draft</Popup>
                </Marker>
              );
            }
            return (
              <Polyline positions={newRoadCoords} color="#a855f7" weight={6} opacity={0.9} dashArray="10, 10">
                <Popup>New Road Draft</Popup>
              </Polyline>
            );
          })()
        )}

        {/* Existing Projects */}
        {projects.map(p => {
          const coords = p.coordinates ? JSON.parse(p.coordinates) : [];
          if (coords.length === 0) return null;
          
          const isBuilding = p.asset_category === 'Building';
          
          if (isBuilding) {
            const buildingIcon = new L.DivIcon({
              html: '<div style="font-size: 32px; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5));">🏢</div>',
              className: 'custom-building-icon',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            });
            return (
              <Marker key={`building-${p.id}`} position={coords[0]} icon={buildingIcon}>
                <Popup className="custom-popup">
                  <div className="min-w-[200px]">
                    <div className="text-xs font-mono text-gray-500 mb-1">{p.id}</div>
                    <strong className="text-base block mb-2">{p.name}</strong>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
                      <div><span className="text-gray-500">Status:</span> <span className="font-semibold uppercase">{p.status}</span></div>
                      <div><span className="text-gray-500">Area:</span> {p.area} sqft</div>
                      <div><span className="text-gray-500">Budget:</span> Rs {p.estimated_cost} L</div>
                      <div><span className="text-gray-500">Paid:</span> Rs {p.spent_cost || 0} L</div>
                      <div className="col-span-2"><span className="text-gray-500">Remaining:</span> Rs {Math.max(0, p.estimated_cost - (p.spent_cost || 0)).toFixed(2)} L</div>
                    </div>
                    <a href={`/projects/${p.id}`} className="block text-center w-full bg-blue-600 text-white text-xs py-2 rounded-md hover:bg-blue-700 transition-colors no-underline">
                      View Full Details
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          }

          return (
            <div key={`project-group-${p.id}`}>
              {/* Main Road Line */}
              <Polyline positions={coords} color={p.status === 'construction' ? '#3b82f6' : getRciColor(p.rci)} weight={6} opacity={0.9}>
                <Popup className="custom-popup">
                  <div className="min-w-[200px]">
                    <div className="text-xs font-mono text-gray-500 mb-1">{p.id}</div>
                    <strong className="text-base block mb-2">{p.name}</strong>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
                      <div><span className="text-gray-500">Status:</span> <span className="font-semibold uppercase">{p.status}</span></div>
                      <div><span className="text-gray-500">Length:</span> {p.length} km</div>
                      <div><span className="text-gray-500">Budget:</span> Rs {p.estimated_cost} L</div>
                      <div><span className="text-gray-500">Paid:</span> Rs {p.spent_cost || 0} L</div>
                      <div className="col-span-2"><span className="text-gray-500">Remaining:</span> Rs {Math.max(0, p.estimated_cost - (p.spent_cost || 0)).toFixed(2)} L</div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Condition (RCI)</span>
                        <span style={{color: getRciColor(p.rci)}} className="font-bold">{p.rci}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div style={{ width: `${p.rci}%`, backgroundColor: getRciColor(p.rci) }} className="h-full"></div>
                      </div>
                    </div>

                    <a href={`/projects/${p.id}`} className="block text-center w-full bg-blue-600 text-white text-xs py-2 rounded-md hover:bg-blue-700 transition-colors no-underline">
                      View Full Details
                    </a>
                  </div>
                </Popup>
              </Polyline>

              {/* Start Marker */}
              <Marker position={coords[0]}>
                <Popup>
                  <strong>Start: {p.name}</strong><br/>
                  <span className="text-xs text-gray-500">Chainage 0+000</span>
                </Popup>
              </Marker>

              {/* End Marker */}
              {coords.length > 1 && (
                <Marker position={coords[coords.length - 1]}>
                  <Popup>
                    <strong>End: {p.name}</strong><br/>
                    <span className="text-xs text-gray-500">Length: {p.length} km</span>
                  </Popup>
                </Marker>
              )}
            </div>
          );
        })}

        {/* Existing Bridges */}
        {bridges.map(b => {
          const parent = projects.find(p => p.id === b.project_id);
          const coords = parent && parent.coordinates ? JSON.parse(parent.coordinates) : [];
          const pos = coords.length > 0 ? coords[0] : null;

          if (!pos) return null;

          return (
            <Marker key={b.id} position={pos}>
              <Popup>
                <strong>Bridge: {b.name}</strong><br/>
                Type: {b.type.toUpperCase()}<br/>
                Status: {b.status}<br/>
                Condition: {b.condition_score}/100
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

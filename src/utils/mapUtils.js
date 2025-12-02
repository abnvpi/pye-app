import * as turf from '@turf/turf';

/**
 * Calculates a curved route between coordinates using Bezier splines.
 * @param {Array} coordinates - Array of [lng, lat] coordinates.
 * @param {number} resolution - Resolution of the spline (default: 10000).
 * @param {number} sharpness - Sharpness of the curve (default: 0.95).
 * @returns {Object} - GeoJSON LineString feature of the curved route.
 */
export const calculateCurvedRoute = (coordinates, resolution = 10000, sharpness = 0.95) => {
  if (!coordinates || coordinates.length < 2) return null;
  const line = turf.lineString(coordinates);
  return turf.bezierSpline(line, { resolution, sharpness });
};

/**
 * Creates the HTML element for a port marker (route stop).
 * @param {number} index - The index of the port (0-based).
 * @returns {HTMLElement} - The constructed DOM element.
 */
export const createPortMarkerElement = (index, name) => {
  const el = document.createElement('div');
  el.className = 'relative group cursor-pointer z-30 hover:z-50';
  el.innerHTML = `
    <div class="w-4 h-4 rounded-full bg-white border-[3px] border-blue-500 shadow-md flex items-center justify-center transform transition-all duration-500 group-hover:scale-150 group-hover:border-blue-600">
    </div>
    <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none">
      ${name || `Port ${index + 1}`}
    </div>
  `;
  return el;
};

/**
 * Creates the HTML element for the current user's profile marker.
 * @param {Object} profile - The user profile object.
 * @returns {HTMLElement} - The constructed DOM element.
 */
export const createProfileMarkerElement = (profile) => {
  const el = document.createElement('div');
  el.className = 'relative cursor-pointer transition-opacity animate-fadeIn z-40';
  el.innerHTML = `
    <div class="flex flex-col items-center">
      <div class="w-12 h-12 rounded-full overflow-hidden border-[3px] border-white shadow-xl ring-2 ring-blue-500 transition-all hover:scale-110">
        <img src="${profile.avatar}" alt="${profile.name}" class="w-full h-full object-cover" />
      </div>
      <div class="absolute -bottom-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-white">
        You
      </div>
    </div>
  `;
  return el;
};

/**
 * Creates the HTML element for the ship icon marker.
 * @param {number} count - Total number of crew members.
 * @returns {HTMLElement} - The constructed DOM element.
 */
export const createShipMarkerElement = (count) => {
  const el = document.createElement('div');
  el.className = 'relative cursor-pointer group z-20';
  el.innerHTML = `
    <div class="w-12 h-12 bg-white rounded-full shadow-lg border-2 border-blue-600 flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
      <div class="absolute inset-0 bg-blue-50"></div>
      <svg class="w-8 h-8 text-blue-600 relative z-10" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    </div>
    <div class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-30">
      <span class="text-white text-xs font-bold">${count}</span>
    </div>
  `;
  return el;
};

/**
 * Calculates deterministic positions for users along the route with collision avoidance.
 * @param {Object} routeGeoJSON - The GeoJSON LineString of the route.
 * @param {Array} users - Array of user objects.
 * @param {Array} portCoordinates - Array of [lng, lat] coordinates for ports.
 * @returns {Object} - Map of userId -> { lng, lat }
 */
export const calculateUserPositions = (routeGeoJSON, users, portCoordinates = []) => {
  if (!routeGeoJSON || !users || users.length === 0) return {};

  const routeLength = turf.length(routeGeoJSON);
  const positions = {};

  // Distribute users evenly along the route (e.g., from 10% to 90%)
  const startPadding = 0.1; // 10% padding at start
  const endPadding = 0.1;   // 10% padding at end
  const availableSpace = 1 - startPadding - endPadding;

  // If only 1 user, place in middle. If multiple, space them out.
  const step = users.length > 1 ? availableSpace / (users.length - 1) : 0;

  users.forEach((user, index) => {
    // Calculate normalized position (0 to 1)
    // If 1 user: 0.5 (middle)
    // If >1 users: start at 0.1, increment by step
    let t;
    if (users.length === 1) {
      t = 0.5;
    } else {
      t = startPadding + (index * step);
    }

    const distanceAlong = t * routeLength;
    const point = turf.along(routeGeoJSON, distanceAlong);

    const coords = point.geometry.coordinates;
    positions[user.id] = { lng: coords[0], lat: coords[1] };
  });

  return positions;
};

/**
 * Calculates the best midpoint on the route for the ship marker.
 * It tries to find a point furthest from any port to ensure the ship is "at sea".
 * @param {Array} coordinates - Array of [lng, lat] coordinates for the route.
 * @returns {Array|null} - [lng, lat] of the calculated midpoint.
 */
export const calculateRouteMidpoint = (coordinates) => {
  if (!coordinates || coordinates.length === 0) return null;

  const curved = calculateCurvedRoute(coordinates);
  if (curved) {
    const length = turf.length(curved);

    // Find a point on the route that is furthest from any port
    let bestPoint = null;
    let maxMinDistance = -1;

    // Sample points from 30% to 70% of the route
    for (let t = 0.3; t <= 0.7; t += 0.05) {
      const candidate = turf.along(curved, length * t);
      const candidateCoords = candidate.geometry.coordinates;

      // Find distance to nearest port
      let minDistanceToPort = Infinity;
      coordinates.forEach(portCoord => {
        const dist = turf.distance(candidate, turf.point(portCoord));
        if (dist < minDistanceToPort) minDistanceToPort = dist;
      });

      if (minDistanceToPort > maxMinDistance) {
        maxMinDistance = minDistanceToPort;
        bestPoint = candidateCoords;
      }
    }

    return bestPoint;
  } else {
    // Fallback to simple average if no route
    const lats = coordinates.map(c => c[1]);
    const lngs = coordinates.map(c => c[0]);
    return [
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
      lats.reduce((a, b) => a + b, 0) / lats.length
    ];
  }
};

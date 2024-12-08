import { writable } from 'svelte/store';

export const messages = writable([]);
export const mapStore = writable({ clearMap: false });
export const waypoints = writable([]);
export const startingLocation = writable({
	longitude: -118.30049006438229,
	latitude: 34.11844295532757,
	altitude: 0
});

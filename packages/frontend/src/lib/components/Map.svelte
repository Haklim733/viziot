<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { messages } from '$lib/store';

	let map;
	let mapContainer;
	let initialState = {
		// lat: 34.1193,
		// lon: -118.3004,
		lon: 11.39085,
		lat: 47.27574,
		zoom: 17
	};

	onMount(() => {
		map = new maplibre.Map({
			center: [initialState.lon, initialState.lat],
			zoom: initialState.zoom,
			container: mapContainer,
			pitch: 15,
			hash: false,
			// style: 'https://tiles.openfreemap.org/styles/liberty',
			attributionControl: false,
			style: {
				version: 8,
				sources: {
					osm: {
						type: 'raster',
						tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
						tileSize: 256,
						attribution: '&copy; OpenStreetMap Contributors',
						maxzoom: 19
					},
					// Use a different source for terrain and hillshade layers, to improve render quality
					terrainSource: {
						type: 'raster-dem',
						url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
						tileSize: 256
					},
					hillshadeSource: {
						type: 'raster-dem',
						url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
						tileSize: 256
					}
				},
				layers: [
					{
						id: 'osm',
						type: 'raster',
						source: 'osm'
					},
					{
						id: 'hills',
						type: 'hillshade',
						source: 'hillshadeSource',
						layout: { visibility: 'visible' },
						paint: { 'hillshade-shadow-color': '#473B24' }
					}
				],
				terrain: {
					source: 'terrainSource',
					exaggeration: 1
				},
				sky: {}
			},
			maxZoom: 18,
			maxPitch: 85
		});

		map.addControl(
			new maplibre.NavigationControl({
				visualizePitch: true,
				showZoom: true,
				showCompass: true
			})
		);

		map.addControl(
			new maplibre.TerrainControl({
				source: 'terrainSource',
				exaggeration: 1
			})
		);

		map.on('mousedown', (e) => {
			if (e.originalEvent.ctrlKey) {
				e.
				const coordinates = e.lngLat;
				const marker = new maplibre.Marker().setLngLat(coordinates).addTo(map);
				console.log(coordinates);
				$messages = [...$messages, coordinates];
			}
		});
	});

	export function clearMap() {
		// Get all the markers on the map
		if (map) {
			const markers = map.getAllMarkers();

			// Remove each marker from the map
			markers.forEach((marker) => {
				marker.remove();
			});
		}
	}

	// export function updateStartLoc(longitude: string, latitude: string) {
	// 	vectorSource.clear();
	// 	startLocation = transform(
	// 		[parseFloat(longitude), parseFloat(latitude)],
	// 		'EPSG:4326',
	// 		'EPSG:3857'
	// 	);
	// 	console.log('start location is' + startLocation);
	// 	const point = new Point(startLocation);
	// }

	$: {
		messages.subscribe((newMessages) => {
			const latest = newMessages[newMessages.length - 1];
			if (latest) {
				const marker = new maplibre.Marker().setLngLat(latest).addTo(map);
			}
		});
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="map-wrap">
	<div class="map" bind:this={mapContainer}></div>
</div>

<style>
	:root {
		font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
		font-size: 16px;
		line-height: 24px;
		font-weight: 400;

		color: #0f0f0f;
		background-color: #f6f6f6;

		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;
	}

	.map-wrap {
		position: relative;
		width: 100%;
		height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
	}

	.map {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			color: #f6f6f6;
			background-color: #2f2f2f;
		}
	}
</style>

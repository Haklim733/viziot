import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import geolib from 'geolib';

const iotClient = new IoTDataPlaneClient({});
export interface DroneTelemetry {
	device: string;
	timestamp: number;
	latitude: number;
	longitude: number;
	altitude: number;
	accelerationX: number;
	accelerationY: number;
	accelerationZ: number;
	roll: number;
	pitch: number;
	yaw: number;
	batteryVoltage: number;
	batteryCurrent: number;
}

interface PathPoint {
	latitude: number;
	longitude: number;
}

interface PathResults {
	paths: PathPoint[];
	totalDistance: number;
}

export interface TelemetryResults {
	totalDistance: number;
	totalTime: number;
}

export async function genDroneTelemetry(
	device: string,
	waypoints: PathPoint[],
	startLocation: PathPoint,
	duration: number, // in seconds
	speed: number,
	altitude: number,
	push: boolean = false,
	topic: string
): Promise<TelemetryResults> {
	let timeElapsed = 0;
	let data: DroneTelemetry[] = [];
	let currentTimestamp;
	waypoints.unshift(startLocation);
	const { paths, totalDistance } = calculatePath(waypoints, speed);

	if (waypoints.length === 0) {
		throw new Error('Waypoints array cannot be empty');
	}
	// const threshold = speed * 0.99;
	let totalTime = 0;

	let i = 0;
	console.log('lenght of paths:' + paths.length);
	while (totalTime < duration && i < paths.length) {
		const path = paths[i];
		i++;
		console.log(path);
		// const waypoint = waypoints[currentWaypointIndex];
		// let distanceToWaypoint = geolib.getDistance(currentLocation, waypoint);
		// let lastDistanceToWaypoint = distanceToWaypoint;

		// while (distanceToWaypoint > threshold && totalTime < duration) {
		let lastTimeStamp = Date.now();
		const randomTimeout = getRandomInt(1000, 1000);
		await new Promise((resolve) => setTimeout(resolve, randomTimeout));
		currentTimestamp = Date.now();
		timeElapsed = (currentTimestamp - lastTimeStamp) / 1000;
		totalTime += timeElapsed;

		// 	// Update current location
		// 	// distanceToWaypoint = geolib.getDistance(currentLocation, waypoint);
		// 	let bearing = geolib.getRhumbLineBearing(currentLocation, waypoint); //first is initial
		// 	let distance = speed * timeElapsed;
		// 	console.log('distance: ' + distance);
		// 	currentLocation = geolib.computeDestinationPoint(currentLocation, distance, bearing);
		// 	console.log(`Time Elapsed: ${timeElapsed}`);
		// 	console.log(`current location: ${JSON.stringify(currentLocation)}`);
		console.log('Total time: ' + totalTime);

		// 	// Update distance to waypoint
		// 	distanceToWaypoint = geolib.getDistance(currentLocation, waypoint);
		// 	if (distanceToWaypoint > lastDistanceToWaypoint) {
		// 		distanceToWaypoint = 0;
		// 		currentLocation = waypoint;
		// 		console.log(`too great of a difference 0`);
		// 	}
		// 	lastDistanceToWaypoint = distanceToWaypoint;
		// 	console.log(`distance to waypoint ${JSON.stringify(waypoint)}: ${distanceToWaypoint}`);

		const telemetryData: DroneTelemetry = {
			device,
			timestamp: currentTimestamp,
			latitude: path.latitude,
			longitude: path.longitude,
			altitude,
			accelerationX: 0,
			accelerationY: 0,
			accelerationZ: 0,
			roll: 0,
			pitch: 0,
			yaw: 0,
			batteryVoltage: 12,
			batteryCurrent: 1
		};

		if (push) {
			let res = await iotClient.send(
				new PublishCommand({
					payload: Buffer.from(JSON.stringify(telemetryData)),
					topic: topic,
					qos: 1
				})
			);
		}

		data.push(telemetryData);

		// Check if current location is close enough to waypoint
		// if (distanceToWaypoint <= threshold) {
		// 	console.log('WAYPOINT INDEX: ' + currentWaypointIndex);
		// 	currentWaypointIndex++;
		// }
	}
	console.log('finished sending telemetry');
	console.log(totalTime);
	return { totalTime: totalTime, totalDistance: totalDistance };
}

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const calculatePath = (waypoints: PathPoint[], droneSpeed: number): PathResults => {
	const path = [];
	let totalDistance = 0;
	for (let i = 0; i < waypoints.length - 1; i++) {
		const currentWaypoint = waypoints[i];
		const nextWaypoint = waypoints[i + 1];
		const distance = geolib.getDistance(currentWaypoint, nextWaypoint);
		totalDistance += distance;
		const bearing = geolib.getRhumbLineBearing(currentWaypoint, nextWaypoint);
		const duration = distance / droneSpeed;
		const numPoints = Math.ceil(duration);
		for (let j = 0; j < numPoints; j++) {
			const point = geolib.computeDestinationPoint(currentWaypoint, j * droneSpeed, bearing);
			path.push(point);
		}
		path.push(nextWaypoint); //assumes first currentWayPoint is starting location
	}
	return { paths: path, totalDistance: totalDistance };
};

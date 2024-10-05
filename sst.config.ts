/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'mockIot',
			removal: input?.stage === 'prod' ? 'retain' : 'remove',
			home: 'aws',
			region: 'us-west-1'
		};
	},
	async run() {
		console.log($app.stage);
		const api = await import('./infra/api');
		const frontend = await import('./infra/frontend');
		// const stream = await import('./infra/kinesis');
		const rtServer = await import('./infra/realtime');
		return {
			app: frontend.site.url,
			rtEndPoint: rtServer.rtServer.endpoint,
			rtAuthorizer: rtServer.rtServer.authorizer
		};
	}
});

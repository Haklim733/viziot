/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'viziot',
			removal: input.stage === 'production' ? 'retain' : 'remove',
			home: 'aws',
			region: 'us-west-1'
		};
	},
	async run() {
		console.log($app.stage);
		const rtServer = await import('./infra/realtime');
		const frontend = await import('./infra/frontend');
		return {
			app: frontend.site.url,
			rtEndPoint: rtServer.rtServer.endpoint,
			rtAuthorizer: rtServer.rtServer.authorizer
		};
	}
});

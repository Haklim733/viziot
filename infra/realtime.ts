export const rtToken = new sst.Secret('RT_TOKEN');
const handler = './packages/core/src/rtAuthorizer.handler';

// const useast1 = new aws.Provider('useast1', { region: 'us-east-1' });

export const rtServer = new sst.aws.Realtime(
	`IotServer`,
	{
		authorizer: { handler, link: [rtToken] }
	}
	// { provider: useast1 }
);
// There is only 1 IoT endpoint per region per AWS account. Messages from all apps and stages are published to the same IoT endpoint. Make sure to prefix the topics by the app and stage name.
// rtServer.subscribe('src/subscriber.handler', {
// 	filter: `${$app.name}/${$app.stage}/iot/test`
// });

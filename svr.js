var
	// used to serve the static page
	connect = require('connect'),
	serveStatic = require('serve-static'),
	ipaddr = require('os').networkInterfaces().en0[1].address,

	// used to handle the page interactions
	ws_svr = require('ws').Server,
	wss = new ws_svr(
		{
			port: 9090
		}
	),

	ws_responder = function(ws) {

		ws.on(
			'message',
			function(message) {
				// console.log('received: %s', message);

        wss.clients.forEach( (client) => {
          if(client.readyState === client.OPEN){
            try {
              client.send(message);
            } catch (e) {
            }
          }
        });
			}
		);
	},


	start = function() {
		wss.on('connection', ws_responder);

		connect().use(serveStatic(".")).listen(8080);
		console.log("WS Listening on:", ipaddr + ":9090");
		console.log("Visit: http://"+ipaddr + ":" + 8080);

	};

start();

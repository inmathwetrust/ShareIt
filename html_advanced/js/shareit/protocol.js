function Conn_init(ws_url, host, onconnect, onsuccess, onerror)
{
	var socket = io.connect(ws_url, {secure: true})
		socket.on('connect', function()
		{
            socket.emit = function()
            {
                var args = Array.prototype.slice.call(arguments, 0);

                socket.send(JSON.stringify(args), function(error)
                {
                    if(error)
                        console.warning(error);
                });
            }

			if(onconnect)
				onconnect(socket);

			// Files list
            socket.fileslist_query = function(socketId)
            {
                socket.emit('fileslist.query', socketId);
            }
            socket.fileslist_send = function(socketId, fileslist)
            {
                socket.emit('fileslist.send', socketId, fileslist);
            }

            // Transfer
            socket.transfer_query = function(socketId, filename, chunk)
            {
                socket.emit('transfer.query', socketId, filename, chunk);
            }
            socket.transfer_send = function(socketId, filename, chunk, data)
            {
                socket.emit('transfer.send', socketId, filename, chunk, data);
            }

            // Files list query
            socket.on('fileslist.query', host.fileslist_query)
            socket.on('fileslist.query.error', host.fileslist_query_error)

            // Files list update
            socket.on('fileslist.send', host.fileslist_send)
//            socket.on('fileslist.send.error', host.fileslist_send_error)

            // Transfer query
            socket.on('transfer.query', host.transfer_query)
//            socket.on('transfer.query.error', host.transfer_query_error)

            // Transfer send
            socket.on('transfer.send', host.transfer_send)
//            socket.on('transfer.send.error', host.transfer_send_error)

			if(onsuccess)
				onsuccess(socket);
		})
}
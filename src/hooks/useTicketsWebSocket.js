import { useEffect, useState } from "react";

export default function useTicketWebSocket(url = "ws://127.0.0.1:8000/ws/tickets/") {

    const [tickets, setTickets] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log("Conectado al WebSocket");
            setConnected(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTickets((prev) => [data.ticket, ...prev]);
        };

        socket.onclose = () => {
            console.log("Desconectado del WebSocket");
            setConnected(false);
        };

        return () => socket.close();
    }, [url]);

    return { tickets, connected };
}
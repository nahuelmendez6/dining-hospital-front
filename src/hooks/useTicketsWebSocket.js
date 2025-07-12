import { useEffect, useState } from "react";



/**
 * Custom hook para conectar a un WebSocket que transmite tickets en tiempo real.
 * 
 * Este hook establece una conexión WebSocket a la URL proporcionada, mantiene
 * un estado con los tickets recibidos y el estado de conexión.
 * 
 * @param {string} [url="ws://127.0.0.1:8000/ws/tickets/"] - URL del WebSocket para conectar.
 * @returns {object} - Un objeto con:
 *   - tickets: arreglo con los tickets recibidos en tiempo real (el más reciente primero),
 *   - connected: boolean que indica si la conexión WebSocket está activa.
 */
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
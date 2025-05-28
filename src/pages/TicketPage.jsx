import { useEffect, useState } from "react";
import { getCurrentShift } from "../services/ticketService";
import TicketForm from '../components/TicketForm';
import NoShift from "./NoShift";


export default function TicketPage() {
    const [shiftData, setShiftData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
   
    useEffect(() => {

        const fetchShift = async () => {

            try {
                const data = await getCurrentShift();
                if (data.type === 'no_shift') {
                    setErrorMsg(data.message);
                } else {
                    setShiftData(data);
                }
            } catch (err) {
                setErrorMsg(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShift();
    }, []);

    if (loading) return <p>Cargando...</p>;

    if (errorMsg) return <NoShift />;

    return <TicketForm shiftData={shiftData} />;


}
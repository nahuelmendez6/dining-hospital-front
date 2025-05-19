import axios from 'axios';

const API_URL = 'http://localhost:8000/';

const ERROR_MESSAGES = {
  'PIN incorrecto': 'El PIN ingresado no es válido. Por favor, intente nuevamente.',
  'No hay turno activo en este momento': 'El comedor no está abierto en este momento. Por favor, intente durante el horario de servicio.',
  'Ya tienes un ticket emitido.': 'Ya has generado un ticket para este turno. No puedes generar más tickets hasta el próximo turno.',
  'Formato de fecha inválido. Usa YYYY-MM-DD.': 'Error en el formato de fecha. Por favor, contacte al administrador.',
  'IntegrityError': 'Error al procesar el ticket. Por favor, intente nuevamente en unos segundos.',
  'Duplicate entry': 'Ya existe un ticket con este código. Por favor, intente nuevamente en unos segundos.',
  'default': 'Ha ocurrido un error al generar el ticket. Por favor, intente nuevamente.'
};

// Función para generar los datos del QR
const generateQRData = (ticketData) => {
  return JSON.stringify({
    ticket_id: ticketData.ticket_id,
    user: ticketData.user,
    shift: ticketData.shift,
    date: ticketData.date,
    status: ticketData.status,
    // Podemos agregar un timestamp para asegurar que el QR sea único
    timestamp: Date.now()
  });
};

export const generateTicket = async (pin) => {
    try {
        console.log('Enviando PIN:', pin); // Log del PIN que enviamos
        const response = await axios.post(
            `${API_URL}tickets/new/`, 
            { pin },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Usamos directamente los datos de la respuesta del POST
        const ticketData = {
            ticket_id: response.data.ticket_id,
            status: response.data.status,
            // Asumimos que estos datos vienen en la respuesta del POST
            user: response.data.user,
            shift: response.data.shift,
            date: response.data.date || new Date().toISOString()
        };

        return {
            ...ticketData,
            qr_data: generateQRData(ticketData)
        };
    } catch (error) {
        // Log detallado del error
        console.error('Error completo:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                data: error.config?.data
            }
        });
        
        // Manejo específico de errores del backend
        if (error.response?.data) {
            // Manejar errores 500
            if (error.response.status === 500) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    if (errorData.includes('IntegrityError')) {
                        if (errorData.includes('Duplicate entry')) {
                            throw new Error(ERROR_MESSAGES['Duplicate entry']);
                        }
                        throw new Error(ERROR_MESSAGES.IntegrityError);
                    }
                }
            }
            
            // Manejar non_field_errors
            if (error.response.data.non_field_errors) {
                console.log('non_field_errors:', error.response.data.non_field_errors);
                const errorMessage = ERROR_MESSAGES[error.response.data.non_field_errors[0]] || ERROR_MESSAGES.default;
                throw new Error(errorMessage);
            }
            
            // Manejar detail error
            if (error.response.data.detail) {
                const errorMessage = ERROR_MESSAGES[error.response.data.detail] || ERROR_MESSAGES.default;
                throw new Error(errorMessage);
            }
        }
        
        // Error de conexión
        if (error.code === 'ECONNREFUSED' || !error.response) {
            throw new Error('No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.');
        }

        // Otros errores
        throw new Error(ERROR_MESSAGES.default);
    }
};
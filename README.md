# TicMeal - Sistema de Gestión de Comedor Hospitalario

TicMeal es una aplicación web frontend desarrollada en React para la gestión integral del servicio de comedor en un hospital. Permite a los empleados generar tickets de comida, al personal de cocina administrar los menús y a los administradores supervisar la operación a través de reportes.

## ✨ Características Principales

*   **🎟️ Autogestión de Tickets:** Los empleados pueden generar sus propios tickets de comida a través de una interfaz simple, usando un PIN personal.
*   **📱 Validación con QR:** Cada ticket genera un código QR único para su validación y canje en el comedor.
*   **👤 Gestión de Usuarios:** Interfaz de administrador para crear, editar, y eliminar usuarios, asignando roles (`admin`, `cocina`, `supervisor`).
*   **🍔 Administración de Menú:** El personal de cocina puede crear platos, gestionar ingredientes y configurar los menús disponibles en cada turno.
*   **📅 Control de Turnos:** Sistema para definir los horarios de los turnos de comida (desayuno, almuerzo, cena).
*   **📊 Reportes y Estadísticas:** Visualización de datos clave como tickets emitidos por turno, consumo por usuario y otros indicadores para la toma de decisiones.
*   **🔐 Rutas Protegidas:** Acceso a las diferentes secciones de la aplicación restringido por roles de usuario.

## 🚀 Tecnologías Utilizadas

*   **[React 18.2.0](https://reactjs.org/)**: Biblioteca principal para la construcción de la interfaz de usuario.
*   **[Vite](https://vitejs.dev/)**: Herramienta de compilación y servidor de desarrollo rápido.
*   **[React Router DOM](https://reactrouter.com/)**: Para el enrutamiento del lado del cliente.
*   **[Bootstrap](https://getbootstrap.com/)**: Framework de CSS para el diseño y la responsividad.
*   **[Axios](https://axios-http.com/)**: Cliente HTTP para la comunicación con la API del backend.
*   **[Chart.js](https://www.chartjs.org/) / [Recharts](https://recharts.org/)**: Bibliotecas para la creación de gráficos y visualización de datos.

## 🏁 Empezando

Para obtener una copia local y poner en marcha el proyecto, sigue estos pasos.

### Prerrequisitos

Asegúrate de tener Node.js y npm instalados en tu máquina.

*   npm
    ```sh
    npm install npm@latest -g
    ```

### Instalación

1.  Clona el repositorio
    ```sh
    git clone https://github.com/tu_usuario/hospital-cafeteria.git
    ```
2.  Navega al directorio del proyecto
    ```sh
    cd hospital-cafeteria
    ```
3.  Instala las dependencias de NPM
    ```sh
    npm install
    ```

## 🔧 Uso

Para iniciar la aplicación en modo de desarrollo, ejecuta:

```sh
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite y abrirá la aplicación en [http://localhost:5173](http://localhost:5173) (o el puerto que tengas configurado).

Para compilar la aplicación para producción, usa:

```sh
npm run build
```

## 📂 Estructura del Proyecto

```
/src
├── assets/         # Imágenes, logos y otros archivos estáticos
├── components/     # Componentes de React reutilizables
├── contexts/       # Contextos de React (ej. AuthContext)
├── hooks/          # Hooks personalizados
├── pages/          # Componentes que representan cada página de la app
├── services/       # Lógica para comunicarse con la API externa
└── main.jsx        # Punto de entrada principal de la aplicación
```

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más información.

## 👤 Autor

**Nahuel**

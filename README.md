# MBC Marketplace

MBC Marketplace es una tienda en línea de buñuelos con un portal de clientes y un panel de administración. Está construida con Next.js (App Router), React, Tailwind CSS y MongoDB.

## Características

- Catálogo de productos con imágenes, precio y descripción.
- Página de producto individual.
- Carrito de compras persistente en `localStorage`.
- Checkout que guarda pedidos en MongoDB.
- Panel de administración para gestionar productos y pedidos.
- Autenticación de administrador basada en cookies seguras.
- Consulta y eliminación de datos personales por número de celular.
- Envío de notificación por correo electrónico al admin cuando se crea un pedido.
- Política de privacidad integrada.

## Tecnologías

- Next.js 16.1.6
- React 19.2.3
- Tailwind CSS 4
- MongoDB
- Nodemailer
- Jest + Testing Library
- ESLint
- TypeScript

## Estructura del proyecto

- `app/` - rutas de interfaz y API.
- `components/` - componentes compartidos (carrito, header, tarjetas, rutas protegidas).
- `lib/` - utilidades y tipos (`mongodb`, `admin-session`, tipos de datos).
- `public/` - activos públicos, incluidas las imágenes de producto.

## Páginas principales

- `/` - Página principal con catálogo de productos.
- `/product/[id]` - Detalle de producto.
- `/admin-login` - Login del administrador.
- `/admin` - Panel de administración (requiere sesión válida).
- `/my-data` - Consulta y eliminación de datos personales por celular.
- `/privacy` - Política de privacidad.

## API disponibles

### Productos
- `GET /api/products` - Lista productos.
- `POST /api/products` - Crea un producto (requiere admin).
- `GET /api/products/:id` - Obtiene un producto por ID.
- `PUT /api/products/:id` - Actualiza un producto (requiere admin).
- `DELETE /api/products/:id` - Elimina un producto (requiere admin).

### Pedidos
- `POST /api/orders` - Crea un pedido y lo guarda en MongoDB.
- `GET /api/orders` - Lista pedidos (requiere admin).
- `PATCH /api/orders/:id` - Actualiza estado de pedido (requiere admin).

### Admin
- `POST /api/admin/login` - Autentica a un administrador y crea cookie de sesión.
- `POST /api/admin/logout` - Cierra sesión de administrador.
- `GET /api/admin/me` - Verifica sesión activa de admin.

### Datos de usuario
- `GET /api/my-data?phone=<celular>` - Consulta pedidos por teléfono.
- `DELETE /api/my-data?phone=<celular>` - Elimina todos los pedidos asociados a ese teléfono.

### Otras
- `GET /api/images` - Lista archivos de imagen disponibles en `public/image/`.

## Requisitos de instalación

1. Clona el repositorio.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env.local` con las variables necesarias.
4. Inicia la aplicación:
   ```bash
   npm run dev
   ```

## Variables de entorno

- `MONGODB_URI` - Cadena de conexión a MongoDB.
- `ADMIN_USERNAME` - Usuario administrador.
- `ADMIN_PASSWORD` - Contraseña administrador.
- `AUTH_SECRET` - Secreto para firmar la cookie de sesión (recomendado).
- `SMTP_HOST` - Host SMTP para notificaciones de pedido.
- `SMTP_PORT` - Puerto SMTP (por defecto `587`).
- `SMTP_USER` - Usuario SMTP.
- `SMTP_PASS` - Contraseña SMTP.
- `ADMIN_EMAIL` - Correo del administrador que recibe notificaciones.

> Nota: `AUTH_SECRET` tiene un valor por defecto interno, pero en producción siempre debe configurarse.

## Comandos disponibles

- `npm run dev` - Ejecuta la app en modo desarrollo.
- `npm run build` - Compila la app para producción.
- `npm run start` - Inicia la app compilada.
- `npm run lint` - Ejecuta ESLint.
- `npm test` - Ejecuta pruebas con Jest.
- `npm run test:watch` - Ejecuta Jest en modo watch.

## Base de datos

La aplicación usa la base de datos MongoDB `mbc_marketplace`.

Colecciones principales:

- `products`
  - `name`
  - `description`
  - `price`
  - `image`

- `orders`
  - `customer`
    - `name`
    - `phone`
    - `address`
    - `neighborhood`
  - `items`
  - `paymentMethod`
  - `total`
  - `status`
  - `createdAt`

## Flujo de usuario

1. El cliente navega en `/` y agrega productos al carrito.
2. En el drawer del carrito completa el formulario de compra.
3. El pedido se guarda en MongoDB y se envía un email al administrador si SMTP está configurado.
4. El administrador puede iniciar sesión en `/admin-login`, ver productos y pedidos, editar/eliminar productos y cambiar el estado de pedidos.
5. El cliente puede consultar y eliminar sus datos desde `/my-data` usando su número de celular.

## Seguridad y privacidad

- La sesión de administrador se valida mediante cookie `admin_session` firmada.
- El checkout solicita consentimiento de tratamiento de datos antes de enviar el pedido.
- La app implementa una política de privacidad visible en `/privacy`.

## Notas adicionales

- El carrito se guarda en `localStorage` con la clave `cart`.
- El panel admin solo es accesible si la sesión de `admin_session` es válida.
- El envío de correo es opcional: si falta SMTP, el pedido se guarda pero no se envía email.

## Consideraciones para producción

- Asegura `NODE_ENV=production` y `secure` cookies.
- Usa un `AUTH_SECRET` fuerte.
- Configura correctamente `MONGODB_URI` y credenciales SMTP.
- Verifica que las imágenes de producto estén en `public/image/` o se carguen desde URLs válidas.

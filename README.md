# Mercado IQ

Aplicación web para **inteligencia de mercado** en compraventa de segunda mano (equipamiento voluminoso: bicicletas de spinning, máquinas de remo, etc.). No es un marketplace: es una herramienta personal para registrar precios observados, fijar objetivos de compra y estimar rentabilidad con logística y reacondicionamiento.

## Funcionalidad

### Inteligencia de precios

- **Categorías** con nombre y slug único automático.
- **Productos**: categoría, marca, modelo, precio nuevo de referencia (opcional), **precio objetivo de compra** (opcional), notas, **URL de imagen** (opcional; compatible con enlaces públicos de Cloudinary u otro CDN).
- **Historial de precios observados**: importe, estado (nuevo / usado / reacondicionado), fuente, fecha.
- **Estadísticas calculadas** por producto: mínimo, máximo y media de las observaciones; comparación contextual con el precio objetivo.

### Operaciones

- **Calculadora de rentabilidad** en cliente: precio de compra, venta estimada, coste de transporte, número de portes (1 o 2), coste de reparación/limpieza.
- Modos **reventa directa** (sin coste de reparación considerado) y **con reacondicionamiento** (campo de reparación activo).

### UX

- Interfaz minimalista, búsqueda de productos por GET (`/products?q=`), formularios cortos y flujo pensado para introducir datos en pocos segundos.

## Stack técnico

| Capa        | Tecnología                                      |
|------------|--------------------------------------------------|
| Framework  | Next.js 16 (App Router, React 19)               |
| ORM        | Prisma 7 + adaptador oficial PostgreSQL (`pg`) |
| Base datos | PostgreSQL                                      |
| Validación | Zod                                              |
| Estilos    | Tailwind CSS 4                                   |

## Estructura del proyecto

```
src/
├── app/                    # Rutas App Router
│   ├── page.tsx            # Inicio / resumen
│   ├── categories/         # CRUD categorías
│   ├── products/           # Lista, detalle, alta
│   └── calculator/         # Rentabilidad
├── components/
│   ├── layout/             # AppShell (navegación)
│   ├── products/
│   ├── categories/
│   └── calculator/
├── generated/prisma/       # Cliente Prisma generado (no editar)
├── lib/                    # Utilidades: prisma, din formato, estadísticas, validación
└── server/actions/         # Server Actions (mutaciones)
prisma/
└── schema.prisma
```

## Decisiones de arquitectura

1. **Prisma 7 y PostgreSQL**  
   El cliente requiere el **driver adapter** `@prisma/adapter-pg`. La URL vive en `DATABASE_URL` y se consume desde `prisma.config.ts` y desde `src/lib/prisma.ts` (runtime).

2. **Separación de dominio**  
   Categorías, productos y observaciones están modelados de forma explícita en el esquema. La lógica de agregación (media / min / max) está en `src/lib/price-stats.ts`, desacoplada de la UI para poder reutilizarla o sustituirla por consultas SQL agregadas si el volumen crece.

3. **Server Actions**  
   Las mutaciones van en `src/server/actions/*` con `revalidatePath` para mantener la UI coherente sin capa API REST intermedia. Esto reduce código y latencia para una herramienta de uso personal.

4. **Imágenes**  
   Solo se guarda una **URL** por producto. Así puedes pegar un enlace HTTPS de Cloudinary (u otro) sin acoplar la app a un SDK obligatorio. Un flujo futuro de subida directa podría reutilizar el mismo campo.

5. **Escalabilidad futura (IA, scraping)**  
   Los puntos naturales de extensión son: jobs que inserten filas en `price_observations`, servicios en `src/server/` o workers externos que llamen a endpoints que aún no existen. El modelo de datos ya separa “ficha de producto” y “muestra de mercado” (observación).

## Requisitos

- Node.js 20+ (recomendado alinear con el runtime de Vercel).
- PostgreSQL accesible (p. ej. instancia en **Railway**).

## Desarrollo local

1. Clonar o copiar el proyecto y entrar en la carpeta.

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Copiar variables de entorno:

   ```bash
   cp .env.example .env
   ```

   Edita `.env` y asigna una `DATABASE_URL` válida (PostgreSQL local o Railway).

4. Sincronizar el esquema con la base de datos (este proyecto usa **`db push`**, sin carpeta `migrations`):

   ```bash
   npx prisma db push
   ```

5. Arrancar la app:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Despliegue: Vercel + Railway

1. **Railway**  
   Crea un servicio **PostgreSQL** y copia la cadena de conexión (formato `postgresql://...`). Con `DATABASE_URL` apuntando a Railway, ejecuta `npx prisma db push` cuando cambies `schema.prisma`.

2. **Vercel**  
   Importa el repositorio, define la variable de entorno `DATABASE_URL` con la misma URL. El script `postinstall` ejecuta `prisma generate` durante el build.

3. **Cambios de esquema**  
   Tras modificar `schema.prisma`, ejecuta `npx prisma db push` contra la URL de producción (o automatízalo en CI si lo prefieres). Si más adiante necesitas historial versionado de SQL, puedes introducir `prisma migrate dev` desde una base limpia.

## Scripts npm

| Script        | Descripción                          |
|---------------|--------------------------------------|
| `npm run dev` | Servidor de desarrollo Next.js       |
| `npm run build` | Build de producción               |
| `npm run start` | Servidor Node tras `build`       |
| `npm run lint` | ESLint                              |
| `postinstall` | `prisma generate`                   |

## Licencia y uso

Proyecto pensado como herramienta personal. Ajusta licencia y despliegue según tu caso.

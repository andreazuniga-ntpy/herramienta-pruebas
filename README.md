# Prueba de usabilidad

Aplicación React para presentar dos tareas con sus prototipos embebidos y recopilar feedback sin salir de la misma página.

## Configuración

Edita el arreglo `TASKS` al inicio de `src/main.tsx` para agregar las URLs públicas de los prototipos y el texto definitivo de la segunda tarea.

## Desarrollo local

```bash
npm install
npm run dev
```

## Publicación en Vercel

Importa este repositorio en Vercel. La plataforma detectará Vite automáticamente y utilizará `npm run build` para generar la carpeta `dist`.

> El servidor que aloja cada prototipo debe permitir ser mostrado dentro de un iframe. Si envía encabezados `X-Frame-Options` o una política CSP restrictiva, el navegador puede bloquearlo.

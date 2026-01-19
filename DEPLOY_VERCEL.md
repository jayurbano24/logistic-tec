# Guía de Despliegue en Vercel

## Opción 1: Despliegue Automático (Recomendado - Vía GitHub)

Esta es la forma más fácil y robusta. Cada vez que hagas un cambio y lo subas a GitHub, Vercel actualizará tu sitio automáticamente.

### Pasos:

1.  **Sube tu código a GitHub:**
    *   Crea un repositorio en GitHub.
    *   Sube tu proyecto actual:
        ```bash
        git add .
        git commit -m "Preparando despliegue"
        git branch -M main
        git remote add origin <URL_DE_TU_REPO>
        git push -u origin main
        ```

2.  **Conecta con Vercel:**
    *   Ve a [Vercel.com](https://vercel.com) e inicia sesión.
    *   Haz clic en **"Add New..."** -> **"Project"**.
    *   Selecciona tu repositorio de GitHub e impórtalo.

3.  **Configura las Variables de Entorno:**
    *   En la pantalla de configuración de Vercel ("Configure Project"), busca la sección **"Environment Variables"**.
    *   Añade las mismas variables que tienes en tu archivo `.env.local`:
        *   `NEXT_PUBLIC_SUPABASE_URL`: (Tu URL de Supabase)
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Tu Key de Supabase)
        *   `SUPABASE_SERVICE_ROLE_KEY`: (Si la usas para tareas administrativas)

4.  **Desplegar:**
    *   Haz clic en **"Deploy"**.
    *   Espera unos minutos y tu sitio estará en línea (ej. `logistic-tec.vercel.app`).

---

## Opción 2: Despliegue Manual (Vía CLI)

Si prefieres hacerlo desde tu terminal sin usar GitHub.

1.  **Iniciar Sesión:**
    Ejecuta el siguiente comando y sigue las instrucciones en el navegador:
    ```bash
    vercel login
    ```

2.  **Desplegar:**
    Ejecuta:
    ```bash
    vercel
    ```
    *   Responde "Yes" a las preguntas de configuración (puedes dejar todo por defecto).

3.  **Configurar Variables (Producción):**
    Para que funcione en producción, debes agregar las variables de entorno en el panel de Vercel (Project Settings -> Environment Variables) o usar el comando:
    ```bash
    vercel env add NEXT_PUBLIC_SUPABASE_URL
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
    ```
    Y luego volver a desplegar con:
    ```bash
    vercel --prod
    ```

## Notas Importantes

*   **Base de Datos:** Asegúrate de que tu base de datos Supabase acepte conexiones desde cualquier IP (normalmente es así por defecto) o configúrala si tienes restricciones.
*   **Auth:** En Supabase (Authentication -> URL Configuration), asegúrate de agregar tu nuevo dominio de Vercel (ej. `https://tu-proyecto.vercel.app`) en **"Site URL"** y **"Redirect URLs"** para que el login funcione correctamente.

# Supabase: Configuración y Esquema de Base de Datos para LinkOut

## 1. Variables de entorno necesarias

Copia y renombra `.env.example` a `.env` y añade tus claves:

```
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

---

## 2. Configuración de URLs en Supabase

- **Site URL:**
  - `http://localhost:5173` (desarrollo)
  - Tu dominio de producción
- **Redirect URLs:**
  - `http://localhost:5173/*`
  - Tu dominio de producción con `/*`

---

## 3. Esquema de tablas recomendado

### Tabla: desahogos
```sql
create table desahogos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  texto text not null,
  created_at timestamp with time zone default now()
);
```

### Tabla: candidaturas
```sql
create table candidaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  empresa text not null,
  puesto text not null,
  estado text not null, -- ejemplo: pendiente, rechazada, entrevista...
  created_at timestamp with time zone default now()
);
```

### Tabla: retos
```sql
create table retos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  tipo text not null, -- ejemplo: fisico, animo
  descripcion text not null,
  completado boolean default false,
  created_at timestamp with time zone default now()
);
```

---

## 4. Policies recomendadas (Row Level Security)

Activa RLS en cada tabla y añade una policy básica:

```sql
-- Permitir a cada usuario ver y modificar solo sus propios registros
create policy "Usuarios pueden gestionar sus propios registros"
  on desahogos for all
  using (auth.uid() = user_id);

create policy "Usuarios pueden gestionar sus propios registros"
  on candidaturas for all
  using (auth.uid() = user_id);

create policy "Usuarios pueden gestionar sus propios registros"
  on retos for all
  using (auth.uid() = user_id);
```

---

## 5. Personalización de emails

- Edita las plantillas de confirmación y recuperación en el panel de Supabase.
- Usa `{{ .ConfirmationURL }}` y `{{ .Email }}` en los mensajes.

---

## 6. Notas
- Puedes extender el esquema según las necesidades de la app.
- Si necesitas lógica backend personalizada, puedes crear un backend propio y comunicarlo con Supabase. 
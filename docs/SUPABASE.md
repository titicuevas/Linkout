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

### Tabla: candidaturas (ESQUEMA COMPLETO)
```sql
create table candidaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  empresa text not null,
  empresa_url text, -- URL de la empresa para obtener logos
  puesto text not null,
  estado text not null, -- entrevista_contacto, prueba_tecnica, segunda_entrevista, entrevista_final, contratacion, rechazado
  fecha date not null, -- fecha de inscripción
  fecha_actualizacion date default current_date, -- fecha de última actualización
  salario_anual integer, -- salario anual en euros
  franja_salarial text, -- rango salarial
  tipo_trabajo text, -- Presencial, Remoto, Híbrido
  ubicacion text, -- ciudad, país
  origen text, -- linkedin, infojobs, joppy, tecnoempleo, correo_directo, otro
  feedback text, -- feedback del reclutador
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

## 4. Actualización de la tabla candidaturas existente

Si ya tienes la tabla candidaturas creada, ejecuta estos comandos para añadir los campos nuevos:

```sql
-- Añadir campo para URL de empresa
ALTER TABLE candidaturas ADD COLUMN IF NOT EXISTS empresa_url text;

-- Añadir campo para fecha de actualización
ALTER TABLE candidaturas ADD COLUMN IF NOT EXISTS fecha_actualizacion date DEFAULT current_date;

-- Añadir campo para salario anual
ALTER TABLE candidaturas ADD COLUMN IF NOT EXISTS salario_anual integer;

-- Añadir campo para franja salarial
ALTER TABLE candidaturas ADD COLUMN IF NOT EXISTS franja_salarial text;

-- Añadir campo para tipo de trabajo
ALTER TABLE candidaturas ADD COLUMN IF NOT EXISTS tipo_trabajo text;

-- Añadir campo para ubicación
ALTER TABLE candidaturas ADD COLUMN IF NOT EXISTS ubicacion text;

-- Añadir campo para origen
ALTER TABLE candidaturas ADD COLUMN IF NOT EXISTS origen text;

-- Añadir campo para feedback
ALTER TABLE candidaturas ADD COLUMN IF NOT EXISTS feedback text;

-- Actualizar registros existentes para que tengan fecha_actualizacion
UPDATE candidaturas SET fecha_actualizacion = fecha WHERE fecha_actualizacion IS NULL;
```

---

## 5. Policies recomendadas (Row Level Security)

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

## 6. Personalización de emails

- Edita las plantillas de confirmación y recuperación en el panel de Supabase.
- Usa `{{ .ConfirmationURL }}` y `{{ .Email }}` en los mensajes.

---

## 7. Notas
- Puedes extender el esquema según las necesidades de la app.
- Si necesitas lógica backend personalizada, puedes crear un backend propio y comunicarlo con Supabase.
- Los logos de empresas se obtienen automáticamente desde Clearbit usando la URL de la empresa. 
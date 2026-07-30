import { test, expect } from '@playwright/test';

const email = process.env.E2E_EMAIL || 'demo@demo.es';
const password = process.env.E2E_PASSWORD || '12345678';

async function login(page) {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();

  // Compat: toast automático (nuevo) o botón OK (despliegue antiguo)
  const ok = page.getByRole('button', { name: /^OK$/i });
  try {
    await ok.click({ timeout: 2_500 });
  } catch {
    // timer toast: no requiere click
  }

  await expect(page.getByText(/centro de control/i)).toBeVisible({ timeout: 20_000 });
}

test.describe('Smoke LinkOut', () => {
  test('home pública carga', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /gestiona tu búsqueda/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /comienza/i })).toBeVisible();
  });

  test('login demo y panel', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/centro de control/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /diario de candidaturas/i })).toBeVisible();
  });

  test('navegación a módulos autenticados', async ({ page }) => {
    await login(page);

    await page.goto('/candidaturas');
    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible();

    await page.goto('/desahogate');
    await expect(page.getByRole('heading', { name: /diario de reflexiones/i })).toBeVisible();

    await page.goto('/animoia');
    await expect(page.getByRole('heading', { name: /motivación/i })).toBeVisible();

    await page.goto('/retos/fisico');
    await expect(page.getByRole('heading', { name: /retos de bienestar/i })).toBeVisible();

    await page.goto('/candidaturas/estadisticas');
    await expect(page.getByRole('heading', { name: /estadísticas/i })).toBeVisible();
  });

  test('crear candidatura abre formulario', async ({ page }) => {
    await login(page);
    await page.goto('/candidaturas/create');
    await expect(page.getByRole('heading', { name: /registrar nueva candidatura/i })).toBeVisible();
    await expect(page.getByText(/^puesto$/i)).toBeVisible();
    await expect(page.getByText(/notas \(opcional\)/i)).toBeVisible();
  });
});

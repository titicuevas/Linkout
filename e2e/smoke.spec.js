import { test, expect } from '@playwright/test';

const email = process.env.E2E_EMAIL || 'demo@demo.es';
const password = process.env.E2E_PASSWORD || '12345678';

async function dismissOptionalOk(page) {
  const ok = page.getByRole('button', { name: /^OK$/i });
  try {
    await ok.click({ timeout: 2_500 });
  } catch {
    // toast automático o sin diálogo
  }
}

async function login(page) {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
  await dismissOptionalOk(page);
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

  test('crear, buscar y borrar candidatura', async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    await login(page);

    const stamp = Date.now();
    const puesto = `E2E QA ${stamp}`;
    const empresa = `Acme Test ${stamp}`;
    const today = new Date().toISOString().slice(0, 10);

    await page.goto('/candidaturas/create');
    await expect(page.getByRole('heading', { name: /registrar nueva candidatura/i })).toBeVisible();

    const control = async (id, labelRegex) => {
      const byId = page.locator(`#${id}`);
      if (await byId.count()) return byId;
      return page.locator('label', { hasText: labelRegex }).locator('xpath=following-sibling::*[1]');
    };

    await (await control('cand-puesto', /^puesto$/i)).fill(puesto);
    await (await control('cand-empresa', /^empresa$/i)).fill(empresa);
    await (await control('cand-fecha', /^fecha$/i)).fill(today);
    await (await control('cand-tipo', /^tipo de trabajo$/i)).selectOption({ label: 'Remoto' });
    await (await control('cand-ubicacion', /^ubicaci[oó]n$/i)).fill('Madrid');
    await (await control('cand-origen', /^origen de la candidatura$/i)).selectOption({ label: 'LinkedIn' });
    await (await control('cand-notas', /^notas/i)).fill('Creada por smoke E2E; se borrará al finalizar.');

    await page.getByRole('button', { name: /crear candidatura/i }).click();
    await dismissOptionalOk(page);

    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible({ timeout: 20_000 });

    const search = page.getByPlaceholder(/buscar por puesto/i);
    await search.fill(empresa);
    await expect(page.locator('table').getByText(empresa)).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('table').getByText(puesto)).toBeVisible();

    const row = page.locator('table tbody tr').filter({ hasText: empresa });
    await row.getByRole('button', { name: /^borrar$/i }).click();
    await page.getByRole('button', { name: /sí, borrar/i }).click();
    await dismissOptionalOk(page);

    await expect(page.locator('table').getByText(empresa)).toHaveCount(0, { timeout: 15_000 });
  });

  test('crear reflexión, Motivación y limpiar', async ({ page }) => {
    test.setTimeout(90_000);
    await login(page);

    const stamp = Date.now();
    const texto = `E2E reflexión ${stamp} — se borrará al finalizar.`;

    await page.goto('/desahogate/create');
    await expect(page.getByRole('heading', { name: /nueva entrada en mi diario/i })).toBeVisible();
    await page.locator('#desahogo-mensaje, textarea').first().fill(texto);
    await page.getByRole('button', { name: /guardar entrada/i }).click();

    await expect(page.getByRole('button', { name: /sí, motivarme/i })).toBeVisible({ timeout: 12_000 });
    await page.getByRole('button', { name: /sí, motivarme/i }).click();

    await expect(page.getByRole('heading', { name: /^motivación$/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(texto)).toBeVisible();

    const card = page.locator('[id^="animo-"]').filter({ hasText: texto });
    await card.getByRole('button', { name: /recibir motivación/i }).click();
    await expect(card.getByText(/¡tú puedes!/i)).toBeVisible({ timeout: 15_000 });

    await page.goto('/desahogate');
    await expect(page.getByRole('heading', { name: /diario de reflexiones/i })).toBeVisible();
    const entry = page.locator('div.group').filter({ hasText: texto });
    await entry.getByRole('button', { name: /eliminar reflexión/i }).click();
    await page.getByRole('button', { name: /sí, eliminar/i }).click();
    await dismissOptionalOk(page);
    await expect(page.getByText(texto)).toHaveCount(0, { timeout: 15_000 });
  });

  test('saludo del panel no muestra el email completo', async ({ page }) => {
    await login(page);
    const greeting = page.getByText(/¡hola,/i);
    await expect(greeting).toBeVisible();
    await expect(greeting).not.toContainText(email);
  });
});

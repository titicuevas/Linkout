import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const email = process.env.E2E_EMAIL || 'demo@demo.es';
const password = process.env.E2E_PASSWORD || '12345678';

/** Reglas ruidosas en tema oscuro / gráficos; el resto sí se audita. */
const AXE_DISABLE = ['color-contrast'];

async function expectNoSeriousA11yViolations(page, label = 'page') {
  const results = await new AxeBuilder({ page })
    .disableRules(AXE_DISABLE)
    .analyze();
  const bad = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(bad, `${label}: ${JSON.stringify(bad, null, 2)}`).toEqual([]);
}

async function dismissOptionalOk(page) {
  const ok = page.getByRole('button', { name: /^OK$/i });
  try {
    await ok.click({ timeout: 2_500 });
  } catch {
    // toast automático o sin diálogo
  }
}

async function clearRetoCompletadoKeys(page) {
  await page.evaluate(() => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('linkout_reto_completado_') || key.startsWith('reto_completado_'))
      .forEach((key) => localStorage.removeItem(key));
  });
}

function followUpFilterButton(page) {
  return page.locator('button[aria-pressed]').filter({ hasText: /seguimiento pendiente/i });
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
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('link', { name: /saltar al contenido/i })).toHaveCount(1);
    await expectNoSeriousA11yViolations(page, 'home');
  });

  test('login demo y panel', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/centro de control/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /diario de candidaturas/i })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expectNoSeriousA11yViolations(page, 'panel');
  });

  test('menú de usuario cierra con Escape', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: /abrir menú de usuario/i }).click();
    await expect(page.locator('#user-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#user-menu')).toHaveCount(0);
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

  test('reto libre: generar, alternativa y completar', async ({ page }) => {
    test.setTimeout(90_000);
    await login(page);

    await page.goto('/retos/fisico');
    await expect(page.getByRole('heading', { name: /retos de bienestar/i })).toBeVisible();
    await clearRetoCompletadoKeys(page);
    await page.reload();
    await expect(page.getByRole('heading', { name: /retos de bienestar/i })).toBeVisible();

    await page.getByRole('button', { name: /reto libre de hoy/i }).click();
    await expect(page.getByRole('heading', { name: /reto libre de hoy/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/reto fácil/i)).toBeVisible();
    await expect(page.getByText(/reto medio/i)).toBeVisible();
    await expect(page.getByText(/reto difícil/i)).toBeVisible();

    await page.getByRole('button', { name: /no puedes hacer este ejercicio/i }).first().click();
    await expect(page.getByText(/alternativa:/i).first()).toBeVisible();

    await page.getByRole('button', { name: /marcar como completado/i }).first().click();
    await expect(page.getByText(/¡reto completado!/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /retos de bienestar/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: /reto libre de hoy/i })).toBeDisabled();

    await clearRetoCompletadoKeys(page);
  });

  test('guardar vista, exportar CSV y limpiar vista', async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    await login(page);

    const stamp = Date.now();
    const viewName = `E2E Vista ${stamp}`;

    await page.goto('/candidaturas');
    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible();
    await page.evaluate(() => localStorage.removeItem('linkout_candidaturas_saved_views'));
    await page.reload();
    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible();

    await followUpFilterButton(page).click();
    await page.getByRole('button', { name: /guardar vista actual/i }).click();
    await page.locator('.swal2-input').fill(viewName);
    await page.locator('.swal2-popup').getByRole('button', { name: /^guardar$/i }).click();
    await expect(page.getByText(/vista guardada/i)).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: /limpiar filtros/i }).click();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /exportar csv/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^linkout-candidaturas-\d{4}-\d{2}-\d{2}\.csv$/);
    await expect(page.getByText(/csv exportado/i)).toBeVisible({ timeout: 8_000 });

    await page.getByRole('button', { name: viewName, exact: true }).click();
    await expect(followUpFilterButton(page)).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: `Eliminar vista ${viewName}` }).click();
    await page.getByRole('button', { name: /sí, eliminar/i }).click();
    await expect(page.getByRole('button', { name: viewName, exact: true })).toHaveCount(0);
  });

  test('crear candidatura antigua, marcar seguimiento y borrar', async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    await login(page);

    const stamp = Date.now();
    const puesto = `E2E Seguimiento ${stamp}`;
    const empresa = `FollowUp Co ${stamp}`;
    const old = new Date();
    old.setDate(old.getDate() - 20);
    const fecha = old.toISOString().slice(0, 10);

    await page.goto('/candidaturas/create');
    await expect(page.getByRole('heading', { name: /registrar nueva candidatura/i })).toBeVisible();

    const control = async (id, labelRegex) => {
      const byId = page.locator(`#${id}`);
      if (await byId.count()) return byId;
      return page.locator('label', { hasText: labelRegex }).locator('xpath=following-sibling::*[1]');
    };

    await (await control('cand-puesto', /^puesto$/i)).fill(puesto);
    await (await control('cand-empresa', /^empresa$/i)).fill(empresa);
    await (await control('cand-fecha', /^fecha$/i)).fill(fecha);
    await (await control('cand-tipo', /^tipo de trabajo$/i)).selectOption({ label: 'Remoto' });
    await (await control('cand-ubicacion', /^ubicaci[oó]n$/i)).fill('Madrid');
    await (await control('cand-origen', /^origen de la candidatura$/i)).selectOption({ label: 'LinkedIn' });
    await (await control('cand-notas', /^notas/i)).fill('E2E seguimiento; se borrará.');

    await page.getByRole('button', { name: /crear candidatura/i }).click();
    await dismissOptionalOk(page);
    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible({ timeout: 20_000 });

    await page.goto('/index');
    await expect(page.getByText(/seguimientos a mano/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: /abrir el más urgente|ver seguimientos/i })).toBeVisible();
    // Puede no entrar en el top 5 si el demo tiene otros más antiguos
    const onPanel = page.getByText(empresa);
    if (await onPanel.count()) {
      await expect(onPanel.first()).toBeVisible();
    }

    await page.goto('/candidaturas?seguimiento=1');
    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible();
    const search = page.getByPlaceholder(/buscar por puesto/i);
    await search.fill(empresa);
    await expect(page.locator('table').getByText(empresa)).toBeVisible({ timeout: 15_000 });

    const row = page.locator('table tbody tr').filter({ hasText: empresa });
    await row.getByRole('button', { name: /he hecho seguimiento/i }).click();
    await expect(page.getByText(/seguimiento marcado/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('table').getByText(empresa)).toHaveCount(0, { timeout: 15_000 });

    await page.evaluate(() => localStorage.removeItem('linkout_candidaturas_prefs'));
    await page.goto('/candidaturas');
    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible();
    await page.getByPlaceholder(/buscar por puesto/i).fill(empresa);
    await expect(page.locator('table').getByText(empresa)).toBeVisible({ timeout: 15_000 });
    await page.locator('table tbody tr').filter({ hasText: empresa }).getByRole('button', { name: /^borrar$/i }).click();
    await page.getByRole('button', { name: /sí, borrar/i }).click();
    await dismissOptionalOk(page);
    await expect(page.locator('table').getByText(empresa)).toHaveCount(0, { timeout: 15_000 });
  });

  test('banner de borrador de candidatura', async ({ page }) => {
    test.setTimeout(60_000);
    await login(page);

    await page.evaluate(() => localStorage.removeItem('linkout_candidatura_draft'));
    await page.goto('/candidaturas/create');
    await expect(page.getByRole('heading', { name: /registrar nueva candidatura/i })).toBeVisible();
    await page.locator('#cand-puesto').fill('E2E Borrador QA');
    await page.locator('#cand-empresa').fill('Draft Co');
    await page.waitForFunction(() => {
      try {
        const raw = localStorage.getItem('linkout_candidatura_draft');
        if (!raw) return false;
        const draft = JSON.parse(raw);
        return draft.puesto === 'E2E Borrador QA' && draft.empresa === 'Draft Co';
      } catch {
        return false;
      }
    });

    await page.goto('/candidaturas');
    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible();
    await expect(page.getByText(/borrador pendiente/i)).toBeVisible();
    await page.getByRole('button', { name: /borrador pendiente/i }).click();
    await expect(page.getByRole('heading', { name: /registrar nueva candidatura/i })).toBeVisible();
    await expect(page.locator('#cand-puesto')).toHaveValue('E2E Borrador QA');
    await expect(page.locator('#cand-empresa')).toHaveValue('Draft Co');

    await page.evaluate(() => localStorage.removeItem('linkout_candidatura_draft'));
  });

  test('ordenación móvil persiste en prefs', async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page);

    await page.evaluate(() => localStorage.removeItem('linkout_candidaturas_prefs'));
    await page.goto('/candidaturas');
    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible();
    await expect(page.locator('#candidaturas-sort-by')).toBeVisible();

    await page.locator('#candidaturas-sort-by').selectOption('empresa');
    await page.locator('#candidaturas-sort-dir').selectOption('asc');
    await page.reload();
    await expect(page.locator('#candidaturas-sort-by')).toHaveValue('empresa');
    await expect(page.locator('#candidaturas-sort-dir')).toHaveValue('asc');
  });

  test('modal de edición se cierra con Escape', async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    await login(page);

    const stamp = Date.now();
    const empresa = `Modal Esc ${stamp}`;
    const today = new Date().toISOString().slice(0, 10);

    await page.goto('/candidaturas/create');
    const control = async (id, labelRegex) => {
      const byId = page.locator(`#${id}`);
      if (await byId.count()) return byId;
      return page.locator('label', { hasText: labelRegex }).locator('xpath=following-sibling::*[1]');
    };
    await (await control('cand-puesto', /^puesto$/i)).fill(`E2E Modal ${stamp}`);
    await (await control('cand-empresa', /^empresa$/i)).fill(empresa);
    await (await control('cand-fecha', /^fecha$/i)).fill(today);
    await (await control('cand-tipo', /^tipo de trabajo$/i)).selectOption({ label: 'Remoto' });
    await (await control('cand-ubicacion', /^ubicaci[oó]n$/i)).fill('Sevilla');
    await (await control('cand-origen', /^origen de la candidatura$/i)).selectOption({ label: 'LinkedIn' });
    await page.getByRole('button', { name: /crear candidatura/i }).click();
    await dismissOptionalOk(page);
    await expect(page.getByRole('heading', { name: /diario de candidaturas/i })).toBeVisible({ timeout: 20_000 });

    await page.getByPlaceholder(/buscar por puesto/i).fill(empresa);
    await expect(page.locator('table').getByText(empresa)).toBeVisible({ timeout: 15_000 });
    await page.locator('table tbody tr').filter({ hasText: empresa }).getByRole('button', { name: /^editar$/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.locator('table tbody tr').filter({ hasText: empresa }).getByRole('button', { name: /^borrar$/i }).click();
    await page.getByRole('button', { name: /sí, borrar/i }).click();
    await dismissOptionalOk(page);
    await expect(page.locator('table').getByText(empresa)).toHaveCount(0, { timeout: 15_000 });
  });
});

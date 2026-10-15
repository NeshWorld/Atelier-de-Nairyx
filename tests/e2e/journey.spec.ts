import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { lessons } from "../../src/content/lessons";

test("cours neurone complet, clavier, évaluation, rechargement et reprise", async ({
  page,
  context,
}) => {
  const external: string[] = [];
  await context.route("**/*", async (route) => {
    if (!route.request().url().startsWith("http://127.0.0.1:1420")) {
      external.push(route.request().url());
      await route.abort();
    } else await route.continue();
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Les idées prennent racine." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Le neurone/i })
    .first()
    .click();
  await page.getByRole("button", { name: /Commencer l’exploration/ }).click();
  await page.getByRole("button", { name: /02.*Manipuler/ }).click();
  await expect(page.getByRole("slider").first()).toBeVisible();
  const slider = page.getByRole("slider").first();
  const before = await slider.inputValue();
  await slider.focus();
  await slider.press("ArrowRight");
  expect(await slider.inputValue()).not.toBe(before);
  await page.getByRole("button", { name: /03.*Mémoriser/ }).click();
  const flip = page.getByRole("button", { name: /Retourner la carte/ });
  await flip.focus();
  await flip.press("Enter");
  await expect(
    page.getByText(lessons.neuron.flashcards[0].back, { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /04.*S’entraîner/ }).click();
  await page.getByLabel("Votre résultat").fill("0,8");
  await page.getByRole("button", { name: "Vérifier mon calcul" }).click();
  await expect(page.getByText(/Exercice réussi/)).toBeVisible();
  await page.getByRole("button", { name: /05.*Se tester/ }).click();
  for (const q of lessons.neuron.questions)
    await page
      .getByRole("radio", { name: q.options[q.correctIndex], exact: true })
      .check();
  await page.getByRole("button", { name: "Vérifier mes réponses" }).click();
  await expect(page.getByText("UNE NOUVELLE CONNEXION")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Mon carnet" }).click();
  await expect(page.getByText("TERMINÉ", { exact: true })).toBeVisible();
  expect(external).toEqual([]);
});

test("cours utilisables après coupure réseau, préférences et brouillon restaurés", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await context.setOffline(true);
  await page.getByRole("button", { name: /Commencer l’exploration/ }).click();
  await page.getByRole("button", { name: /03.*Mémoriser/ }).click();
  await page.getByRole("button", { name: /Retourner la carte/ }).click();
  await expect(
    page.getByText(lessons.tokenization.flashcards[0].back, { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Atelier Python" }).click();
  await page.getByLabel("Brouillon Python").fill('print("hors ligne")');
  await page.getByRole("button", { name: "Préférences", exact: true }).click();
  await page.getByLabel("Réduire les animations").check();
  await page.getByLabel("Taille du texte").selectOption("1.3");
  await context.setOffline(false);
  await page.reload();
  await page.getByRole("button", { name: "Préférences", exact: true }).click();
  await expect(page.getByLabel("Réduire les animations")).toBeChecked();
  await expect(page.getByLabel("Taille du texte")).toHaveValue("1.3");
  await page.getByRole("button", { name: "Atelier Python" }).click();
  await expect(page.getByLabel("Brouillon Python")).toHaveValue(
    'print("hors ligne")',
  );
  await expect(
    page.getByRole("button", { name: "Exécuter l’exemple" }),
  ).toBeDisabled();
});

test("accessibilité et captures à 1440, 1000 et 800 pixels", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [1440, 1000, 800]) {
    await page.setViewportSize({ width, height: width === 800 ? 600 : 960 });
    await expect(
      page.getByRole("heading", { name: "Les idées prennent racine." }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `evidence/arbre-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1440, height: 960 });
  let audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.getByRole("button", { name: /Commencer l’exploration/ }).click();
  await page.getByRole("button", { name: /02.*Manipuler/ }).click();
  await page.screenshot({ path: "evidence/tokenisation.png", fullPage: true });
  audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test("tokenisation complète : découpage, vocabulaire, évaluation et reprise", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Commencer l’exploration/ }).click();
  await page.getByRole("button", { name: /02.*Manipuler/ }).click();
  const cut = page.getByRole("button", {
    name: "Retirer une séparation après le caractère 2",
    exact: true,
  });
  await cut.focus();
  await cut.press("Enter");
  await expect(
    page.getByRole("button", {
      name: "Ajouter une séparation après le caractère 2",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: /04.*S’entraîner/ }).click();
  const unique = await page.locator(".token-chip code").allTextContents();
  await page
    .getByLabel("Taille du vocabulaire de cette séquence")
    .fill(String(new Set(unique).size));
  await page.getByRole("button", { name: "Vérifier", exact: true }).click();
  await expect(page.getByText(/Exercice réussi/)).toBeVisible();
  await page.getByRole("button", { name: /05.*Se tester/ }).click();
  for (const q of lessons.tokenization.questions)
    await page
      .getByRole("radio", { name: q.options[q.correctIndex], exact: true })
      .check();
  await page.getByRole("button", { name: "Vérifier mes réponses" }).click();
  await expect(page.getByText("UNE NOUVELLE CONNEXION")).toBeVisible();
  await page.screenshot({ path: "evidence/cours-termine.png", fullPage: true });
  await page.reload();
  await expect(
    page.getByRole("button", { name: /Revoir le cours/ }),
  ).toBeVisible();
});

test("vue approfondie, texte agrandi et autres écrans accessibles", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Déployer l’arbre/ }).click();
  await expect(page.locator(".concept-node")).toHaveCount(12);
  await page.screenshot({
    path: "evidence/arbre-approfondi.png",
    fullPage: true,
  });
  for (const title of ["Atelier Python", "Préférences"]) {
    await page.getByRole("button", { name: title, exact: true }).click();
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  }
  await page.getByLabel("Taille du texte").selectOption("1.3");
  await page.setViewportSize({ width: 800, height: 600 });
  await page.getByRole("button", { name: "Arbre des savoirs" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: /Revenir aux essentiels/ }).click();
  const canvas = await page.locator(".concept-canvas").boundingBox();
  for (const node of await page.locator(".concept-node").all()) {
    const box = await node.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(canvas!.x - 1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(
      canvas!.x + canvas!.width + 1,
    );
  }
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.scrollTop = 0;
  });
  await page.screenshot({
    path: "evidence/arbre-800-texte-grand.png",
    fullPage: true,
  });
});

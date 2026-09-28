# DUGOLBI Project Rules

## 1. Existing project is the source of truth

Before implementing or modifying a page, inspect the existing DUGOLBI HTML, CSS and JavaScript.

The existing completed PC pages are the coding reference for this project.

Follow the existing project structure and coding patterns instead of creating a new architecture.

Do not refactor unrelated existing code.

---

## 2. AI working files

The `/ai` directory contains reference materials for AI-assisted implementation.

### `/ai/reference`
Contains final design reference images exported from Figma.

These images are the visual source of truth.

### `/ai/assets`
Contains original images, SVGs and other assets exported from Figma for implementation.

Files inside `/ai` are working/reference files.

Final production HTML must not directly reference files inside `/ai`.

If an asset is required by the actual website, copy it into the appropriate production asset directory such as `/images`.

---

## 3. Design implementation

Reproduce the supplied PC design as accurately as possible.

Do not invent new UI.

Do not add visual elements that are not present in the design.

Do not arbitrarily change:

- typography
- spacing
- colors
- borders
- shadows
- border radius
- image proportions
- section order

Reuse existing DUGOLBI styles whenever applicable.

---

## 4. Desktop only

Unless specifically requested otherwise, current implementation work is for PC desktop only.

Do not create a new mobile or tablet design.

Do not add responsive CSS unless explicitly requested.

However, structure HTML and CSS so responsive work can be added later.

Avoid unnecessary fixed positioning and excessive absolute positioning.

---

## 5. Layout

Inspect and reuse the existing project layout rules.

Reuse existing:

- `.inner`
- grid systems
- section structures
- typography patterns
- buttons
- common classes

Do not create another layout system if an existing one can be reused.

---

## 6. HTML / CSS

Follow existing class naming conventions.

Reuse common styles before creating page-specific duplicates.

Avoid inline styles.

Do not rename existing classes unless absolutely necessary.

Do not modify unrelated completed pages.

Page-specific CSS should only contain styles required for that page.

---

## 7. JavaScript

Follow the existing JavaScript structure.

Reuse existing libraries and plugins.

Do not install a new framework or library unless explicitly requested.

If Swiper or another library already exists, reuse it.

Do not rewrite unrelated existing JavaScript.

---

## 8. Header / Footer / Common UI

Reuse existing common header and footer implementations.

Do not recreate them for individual pages unless explicitly requested.

Do not unnecessarily modify working common components.

---

## 9. Modification scope

Only modify files necessary for the requested task.

Before changing an existing common file, confirm that the change is actually required.

Do not perform unrelated cleanup or refactoring.

When an existing project convention conflicts with your preferred implementation, follow the existing project convention.
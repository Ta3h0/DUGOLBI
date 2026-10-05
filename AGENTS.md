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

The existing `.container` is the primary common width/container system.

`.inner` is not a universal width class.
Use it only when it matches the existing section structure.

Reuse existing:

- `.container`
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

All production page styles are currently merged into `css/common.css`.
Keep the existing page sections and their media-query order together.
Scope page-specific selectors using the existing `:where(body.page)` pattern.
Do not recreate the deleted page CSS files or undo the CSS merge.

---

## 7. JavaScript

Follow the existing JavaScript structure.

Reuse existing libraries and plugins.

Do not install a new framework or library unless explicitly requested.

If Swiper or another library already exists, reuse it.

Do not rewrite unrelated existing JavaScript.

---

## 8. Header / Footer / Common UI

Reuse the existing header, mega menu, responsive menu and footer markup,
styles and JavaScript patterns for new pages.

Do not redesign or independently reimplement these common components.

Production `.html` pages execute PHP and include `header.html`/`footer.html` using `__DIR__`.
Use the same includes for new pages; do not duplicate the common markup.
`router.php` is for the local PHP built-in server. Production hosting must execute PHP in `.html` files.

Do not unnecessarily modify working common components.

---

## 9. Modification scope

Only modify files necessary for the requested task.

Before changing an existing common file,
verify that the change is strictly required for the requested page.

Prefer page-specific files whenever possible.

Do not perform unrelated cleanup or refactoring.

When an existing project convention conflicts with your preferred implementation, follow the existing project convention.


# New Page Implementation Workflow

When the user asks to implement a new page, follow this workflow automatically.

## Page paths

If the requested page slug is `{page}`:

Design references:
`ai/reference/{page}/`

Source assets:
`ai/assets/{page}/`

Production HTML:
`{page}.html`

Page CSS:
The corresponding page section inside `css/common.css` (no separate page CSS file).

Production assets:
`images/{page}/`

Do not reference files inside `/ai` from production HTML or CSS.
Copy only required assets into the production asset directory.

---

## Implementation references

Before implementing a new subpage, inspect:

- AGENTS.md
- index.html
- css/common.css
- introduce.html
- the INTRODUCE page section inside css/common.css

`introduce.html` and the INTRODUCE section in `css/common.css` are the primary examples
for how DUGOLBI subpages should be implemented.

Reuse the existing:

- header
- mega menu
- responsive menu
- footer
- container system
- typography
- buttons
- CSS variables
- JavaScript patterns

Do not unnecessarily modify completed pages or common files.

---

## Design implementation

The files inside:

`ai/reference/{page}/`

are the final visual source of truth.

Use the full-page reference for overall composition
and section references for detailed implementation.

The files inside:

`ai/assets/{page}/`

are implementation source assets.

Do not insert reference screenshots directly into the webpage.

Reproduce the supplied design as accurately as possible.

Do not invent UI, animation, hover effects, shadows,
border radius or other visual elements that are not in the reference.

---

## Current responsive policy

Unless the user explicitly requests otherwise,
new page implementation is DESKTOP PC ONLY.

Use the 1920px reference as the primary visual target.

Do not create new responsive layouts.

However, use normal document flow, Grid and Flex
so responsive CSS can be added later.

Avoid unnecessary absolute positioning.

---

## Asset naming

When moving files from `/ai/assets` to production:

- use lowercase English filenames
- use kebab-case
- do not use Korean filenames
- do not use spaces
- do not use special characters

Update HTML/CSS paths accordingly.

Copy assets from `/ai/assets`.
Do not move, rename or delete the original files inside `/ai`.

---

## Default workflow

For normal static subpages:

1. inspect existing project rules
2. inspect references and assets
3. determine section structure
4. implement immediately
5. compare against references
6. correct obvious discrepancies
7. report results

Do not stop after analysis unless the user explicitly asks for analysis only.

For complex pages involving significant interaction, animation,
sticky sections, tabs, sliders or unusual JavaScript,
explain the implementation plan before making large structural changes.

---

## Completion report

After implementation, report only:

1. created files
2. modified existing files
3. copied/renamed assets
4. parts that require human visual review

Keep the report concise.
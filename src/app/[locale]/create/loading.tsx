// The three wizard steps (type / details / cover) each have their own
// layout, so a single shared loading skeleton would flash a mismatched screen
// on every step navigation (previously it showed the old book-details split
// panel before every step). Render nothing — Next keeps the previous content
// until the next step is ready, which is smoother than a wrong skeleton.
export default function Loading() {
  return null;
}

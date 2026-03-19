import { useMemo } from "react";
import { SHORTCUT_REFERENCE } from "./shortcuts";

interface ShortcutHelpModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORY_ORDER = ["Tools", "Edit", "Project", "View", "Panels"] as const;

export function ShortcutHelpModal({ open, onClose }: ShortcutHelpModalProps) {
  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: SHORTCUT_REFERENCE.filter((entry) => entry.category === category),
    })).filter((group) => group.items.length > 0);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className="shortcut-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="shortcut-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="shortcut-modal__header">
          <div>
            <h2>Keyboard Shortcuts</h2>
            <p>Core editor actions, grouped for quick lookup.</p>
          </div>
          <button type="button" className="button button--ghost" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="shortcut-modal__body">
          {grouped.map((group) => (
            <section key={group.category} className="shortcut-group">
              <h3>{group.category}</h3>
              <div className="shortcut-grid">
                {group.items.map((entry) => (
                  <div key={`${entry.category}-${entry.combo}-${entry.description}`} className="shortcut-grid__row">
                    <kbd>{entry.combo}</kbd>
                    <span>{entry.description}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

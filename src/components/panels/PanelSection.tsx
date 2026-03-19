import type { PropsWithChildren } from "react";

interface PanelSectionProps extends PropsWithChildren {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
}

export function PanelSection({ title, collapsed, onToggle, children }: PanelSectionProps) {
  return (
    <section className="panel-section">
      <header className="panel-section__header">
        <h2>{title}</h2>
        <button
          type="button"
          className="button button--ghost panel-section__toggle"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? "Expand" : "Collapse"} ${title}`}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </header>
      {!collapsed ? <div className="panel-section__body">{children}</div> : null}
    </section>
  );
}

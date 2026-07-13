const icons = {
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.75a9.25 9.25 0 0 0-2.93 18.03c.46.08.63-.2.63-.45v-1.8c-2.57.56-3.11-1.09-3.11-1.09-.42-1.07-1.03-1.35-1.03-1.35-.84-.58.07-.57.07-.57.93.07 1.42.96 1.42.96.83 1.41 2.17 1 2.7.77.08-.6.32-1 .59-1.23-2.05-.23-4.21-1.03-4.21-4.57 0-1.01.36-1.84.95-2.49-.1-.23-.41-1.18.09-2.45 0 0 .78-.25 2.54.95A8.8 8.8 0 0 1 12 7.1a8.8 8.8 0 0 1 2.31.31c1.76-1.2 2.53-.95 2.53-.95.51 1.27.19 2.22.1 2.45.59.65.95 1.48.95 2.49 0 3.55-2.17 4.33-4.23 4.56.33.29.63.85.63 1.72v2.65c0 .25.17.54.64.45A9.25 9.25 0 0 0 12 2.75Z"></path></svg>',
  external: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9"></path></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"></circle><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.28 5.28l1.42 1.42M17.3 17.3l1.42 1.42M18.72 5.28 17.3 6.7M6.7 17.3l-1.42 1.42"></path></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.2 15.1A8.8 8.8 0 0 1 8.9 3.8 8.8 8.8 0 1 0 20.2 15.1Z"></path></svg>',
  system: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path></svg>',
};

export function icon(name) {
  return icons[name] || "";
}

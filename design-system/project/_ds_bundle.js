/* @ds-bundle: {"format":3,"namespace":"MellowbrowDesignSystem_20fe7e","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Accordion","sourcePath":"components/marketing/Accordion.jsx"},{"name":"ServiceCard","sourcePath":"components/marketing/ServiceCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"38030657613d","components/core/Button.jsx":"09bc9912dbc4","components/core/Card.jsx":"f4da4e05407f","components/core/Logo.jsx":"951f218642e5","components/forms/Checkbox.jsx":"7a20ae47eb17","components/forms/Input.jsx":"83ca374c53fd","components/forms/Select.jsx":"cbf3c6a7e2cc","components/marketing/Accordion.jsx":"b4471612df04","components/marketing/ServiceCard.jsx":"99b704e5dbe8","ui_kits/website/Booking.jsx":"f9d3fdcd0bde","ui_kits/website/Chrome.jsx":"bde3823c5592","ui_kits/website/Gallery.jsx":"d83e8524b9b1","ui_kits/website/Home.jsx":"9f095faaa158","ui_kits/website/Services.jsx":"a447ca0805ee"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MellowbrowDesignSystem_20fe7e = window.MellowbrowDesignSystem_20fe7e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mellowbrow Badge — small status / category label.
 */
function Badge({
  tone = "neutral",
  soft = true,
  children,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: "var(--surface-fill)",
      fg: "var(--text-secondary)",
      solidBg: "var(--mocha-700)"
    },
    brand: {
      bg: "var(--primary-soft)",
      fg: "var(--mocha-800)",
      solidBg: "var(--mocha-700)"
    },
    accent: {
      bg: "var(--accent-soft)",
      fg: "var(--blush-700)",
      solidBg: "var(--blush-500)"
    },
    success: {
      bg: "var(--success-soft)",
      fg: "#4F5C39",
      solidBg: "var(--success)"
    },
    error: {
      bg: "var(--error-soft)",
      fg: "#8E3C32",
      solidBg: "var(--error)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "var(--font-sans)",
      fontSize: "11.5px",
      fontWeight: 600,
      letterSpacing: "0.02em",
      lineHeight: 1,
      whiteSpace: "nowrap",
      padding: "5px 11px",
      borderRadius: "var(--radius-pill)",
      background: soft ? t.bg : t.solidBg,
      color: soft ? t.fg : "var(--paper)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mellowbrow Button — the primary call-to-action.
 * Soft pill by default; warm mocha fill for primary.
 */
function Button({
  variant = "primary",
  size = "md",
  pill = true,
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: "13px",
      height: 36,
      gap: 7
    },
    md: {
      padding: "11px 22px",
      fontSize: "14px",
      height: 44,
      gap: 8
    },
    lg: {
      padding: "15px 30px",
      fontSize: "15px",
      height: 54,
      gap: 10
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--primary)",
      color: "var(--on-primary)",
      border: "1px solid transparent"
    },
    secondary: {
      background: "var(--surface-card)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--primary)",
      border: "1px solid transparent"
    },
    quiet: {
      background: "var(--primary-soft)",
      color: "var(--mocha-800)",
      border: "1px solid transparent"
    }
  };
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: s.fontSize,
      letterSpacing: "0.01em",
      lineHeight: 1,
      whiteSpace: "nowrap",
      padding: s.padding,
      minHeight: s.height,
      width: full ? "100%" : "auto",
      borderRadius: pill ? "var(--radius-pill)" : "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur) var(--ease-out)",
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.975)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mellowbrow Card — warm surface container with soft elevation.
 */
function Card({
  elevation = "sm",
  padded = true,
  interactive = false,
  children,
  style = {},
  ...rest
}) {
  const shadows = {
    none: "none",
    xs: "var(--shadow-xs)",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-soft)",
      borderRadius: "var(--radius-card)",
      boxShadow: shadows[elevation] || shadows.sm,
      padding: padded ? "var(--space-5)" : 0,
      transition: "box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)",
      cursor: interactive ? "pointer" : "default",
      ...style
    },
    onMouseEnter: e => {
      if (interactive) {
        e.currentTarget.style.boxShadow = shadows.md;
        e.currentTarget.style.transform = "translateY(-2px)";
      }
    },
    onMouseLeave: e => {
      if (interactive) {
        e.currentTarget.style.boxShadow = shadows[elevation] || shadows.sm;
        e.currentTarget.style.transform = "translateY(0)";
      }
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mellowbrow wordmark logo (typographic). Renders in the brand serif.
 */
function Logo({
  variant = "full",
  size = 28,
  color = "var(--text-primary)",
  tagline = false,
  style = {},
  ...rest
}) {
  const wrap = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: variant === "stacked" ? "center" : "flex-start",
    gap: 3,
    lineHeight: 1,
    ...style
  };
  const word = {
    fontFamily: "var(--font-display)",
    fontWeight: 500,
    fontSize: size,
    letterSpacing: "0.01em",
    color
  };
  const em = {
    fontStyle: "italic",
    color: "var(--mocha-600)"
  };
  const tag = {
    fontFamily: "var(--font-sans)",
    fontSize: Math.max(8, size * 0.26),
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "var(--text-muted)"
  };
  if (variant === "mono") {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        width: size,
        height: size,
        borderRadius: "999px",
        background: "var(--primary)",
        color: "var(--paper)",
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: size * 0.56,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style
      }
    }, rest), "m");
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: wrap
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: word
  }, "mellow", /*#__PURE__*/React.createElement("span", {
    style: em
  }, "brow")), (tagline || variant === "stacked") && /*#__PURE__*/React.createElement("span", {
    style: tag
  }, "Brow Atelier"));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mellowbrow Checkbox — soft square check with warm fill.
 */
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: "var(--text-primary)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", _extends({
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 22,
      height: 22,
      borderRadius: "var(--radius-xs)",
      border: `1.5px solid ${checked ? "var(--primary)" : "var(--border-strong)"}`,
      background: checked ? "var(--primary)" : "var(--surface-card)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all var(--dur-fast) var(--ease-out)",
      flexShrink: 0
    }
  }, rest), checked && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--paper)",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mellowbrow Input — labeled text field with warm styling.
 */
function Input({
  label,
  hint,
  error,
  prefix = null,
  size = "md",
  style = {},
  id,
  ...rest
}) {
  const fieldId = id || (label ? `in-${label}` : undefined);
  const pad = size === "lg" ? "14px 16px" : "11px 14px";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      fontFamily: "var(--font-sans)"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-secondary)",
      letterSpacing: "0.01em"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "var(--surface-card)",
      border: `1px solid ${error ? "var(--error)" : "var(--border-default)"}`,
      borderRadius: "var(--radius-md)",
      padding: pad,
      transition: "border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)"
    },
    onFocus: e => {
      if (!error) {
        e.currentTarget.style.borderColor = "var(--mocha-500)";
        e.currentTarget.style.boxShadow = "var(--shadow-focus)";
      }
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = error ? "var(--error)" : "var(--border-default)";
      e.currentTarget.style.boxShadow = "none";
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontSize: 14
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "inherit",
      fontSize: 15,
      color: "var(--text-primary)",
      minWidth: 0,
      ...style
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? "var(--error)" : "var(--text-muted)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mellowbrow Select — labeled native dropdown with warm chevron.
 */
function Select({
  label,
  hint,
  options = [],
  value,
  onChange,
  placeholder,
  style = {},
  id,
  ...rest
}) {
  const fieldId = id || (label ? `sel-${label}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      fontFamily: "var(--font-sans)"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    value: value,
    onChange: onChange,
    style: {
      appearance: "none",
      width: "100%",
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: "12px 40px 12px 14px",
      fontFamily: "inherit",
      fontSize: 15,
      color: value ? "var(--text-primary)" : "var(--text-placeholder)",
      cursor: "pointer",
      outline: "none",
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const val = typeof o === "string" ? o : o.value;
    const lab = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lab);
  })), /*#__PURE__*/React.createElement("svg", {
    style: {
      position: "absolute",
      right: 14,
      pointerEvents: "none"
    },
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/marketing/Accordion.jsx
try { (() => {
/**
 * Mellowbrow Accordion — quiet FAQ list with soft expand.
 * items: [{ q, a }]
 */
function Accordion({
  items = [],
  defaultOpen = 0,
  style = {}
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, items.map((it, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderBottom: "1px solid var(--border-default)"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      style: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "20px 4px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        fontSize: 16,
        fontWeight: 600,
        color: "var(--text-primary)"
      }
    }, /*#__PURE__*/React.createElement("span", null, it.q), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 26,
        height: 26,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--mocha-600)",
        transform: isOpen ? "rotate(45deg)" : "rotate(0)",
        transition: "transform var(--dur) var(--ease-out)",
        fontSize: 22,
        fontWeight: 300
      }
    }, "+")), /*#__PURE__*/React.createElement("div", {
      style: {
        maxHeight: isOpen ? 320 : 0,
        overflow: "hidden",
        transition: "max-height var(--dur-slow) var(--ease-out), opacity var(--dur) var(--ease-out)",
        opacity: isOpen ? 1 : 0
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        padding: "0 4px 22px",
        fontSize: 14.5,
        lineHeight: 1.7,
        color: "var(--text-secondary)"
      }
    }, it.a)));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/marketing/ServiceCard.jsx
try { (() => {
/**
 * Mellowbrow ServiceCard — a menu item for a brow service.
 * Uses an image-area placeholder; pass `image` to supply a real photo URL.
 */
function ServiceCard({
  titleKo,
  titleEn,
  description,
  price,
  duration,
  tag,
  image = null,
  onSelect,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onSelect,
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-soft)",
      borderRadius: "var(--radius-card)",
      overflow: "hidden",
      boxShadow: "var(--shadow-sm)",
      cursor: onSelect ? "pointer" : "default",
      transition: "box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)",
      fontFamily: "var(--font-sans)",
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
      e.currentTarget.style.transform = "translateY(-3px)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      e.currentTarget.style.transform = "translateY(0)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "4 / 3",
      background: image ? `center/cover url(${image})` : "linear-gradient(135deg, #EEDFD0, #E0C5B2)",
      position: "relative"
    }
  }, tag && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 12,
      left: 12,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.02em",
      padding: "5px 10px",
      borderRadius: "var(--radius-pill)",
      background: "rgba(251,247,241,0.92)",
      color: "var(--mocha-800)",
      backdropFilter: "blur(4px)",
      whiteSpace: "nowrap"
    }
  }, tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 24,
      fontWeight: 500,
      color: "var(--text-primary)"
    }
  }, titleKo), titleEn && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, titleEn)), description && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 1.6,
      color: "var(--text-secondary)"
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: "1px solid var(--border-soft)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      color: "var(--text-primary)"
    }
  }, price), duration && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      whiteSpace: "nowrap",
      flexShrink: 0,
      marginLeft: 10
    }
  }, duration))));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Booking.jsx
try { (() => {
/* global React */
// Mellowbrow website — Booking form

function Booking({
  onNavigate
}) {
  const {
    Input,
    Select,
    Checkbox,
    Button,
    Card
  } = window.MellowbrowDesignSystem_20fe7e;
  const {
    Section,
    Icon
  } = window;
  const [done, setDone] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  const [svc, setSvc] = React.useState("");
  const [time, setTime] = React.useState("");
  if (done) {
    return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Card, {
      elevation: "md",
      style: {
        maxWidth: 520,
        margin: "40px auto",
        textAlign: "center",
        padding: "48px 40px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        width: 56,
        height: 56,
        borderRadius: "999px",
        background: "var(--success-soft)",
        color: "var(--success)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 28
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 30
      }
    }, "\uC608\uC57D \uC2E0\uCCAD \uC644\uB8CC"), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: 14,
        fontSize: 15,
        lineHeight: 1.7,
        color: "var(--text-secondary)"
      }
    }, "\uC2E0\uCCAD\uD574 \uC8FC\uC154\uC11C \uAC10\uC0AC\uD569\uB2C8\uB2E4. \uD655\uC778 \uD6C4 \uB0A8\uACA8\uC8FC\uC2E0 \uC5F0\uB77D\uCC98\uB85C \uC608\uC57D \uAC00\uB2A5 \uC77C\uC815\uC744 \uC548\uB0B4\uB4DC\uB9B4\uAC8C\uC694."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 28,
        display: "flex",
        gap: 12,
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => onNavigate("home")
    }, "\uD648\uC73C\uB85C"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => setDone(false)
    }, "\uB2E4\uC2DC \uC2E0\uCCAD"))));
  }
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      maxWidth: 560,
      margin: "0 auto 44px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow"
  }, "Booking"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--fs-display-md)",
      marginTop: 16
    }
  }, "\uC608\uC57D \uC2E0\uCCAD"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      fontSize: 16,
      color: "var(--text-secondary)"
    }
  }, "\uC544\uB798 \uB0B4\uC6A9\uC744 \uB0A8\uACA8\uC8FC\uC2DC\uBA74 \uBE60\uB974\uAC8C \uD655\uC778 \uD6C4 \uC5F0\uB77D\uB4DC\uB9B4\uAC8C\uC694. (100% \uC608\uC57D\uC81C)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 0.9fr",
      gap: 32,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    elevation: "sm",
    style: {
      padding: "32px 32px 36px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\uC131\uD568",
    placeholder: "\uD64D\uAE38\uB3D9"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\uC5F0\uB77D\uCC98",
    prefix: "+82",
    placeholder: "010-0000-0000"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "\uC2DC\uC220 \uC120\uD0DD",
    placeholder: "\uBA54\uB274\uB97C \uACE8\uB77C\uC8FC\uC138\uC694",
    options: ["자연눈썹", "콤보눈썹", "섀도우눈썹", "남자눈썹", "입술 (물광)", "리터치"],
    value: svc,
    onChange: e => setSvc(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\uD76C\uB9DD \uB0A0\uC9DC",
    type: "date"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-secondary)",
      display: "block",
      marginBottom: 10
    }
  }, "\uD76C\uB9DD \uC2DC\uAC04\uB300"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap"
    }
  }, ["오전 11:00", "오후 1:00", "오후 3:00", "오후 5:00", "오후 7:00"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTime(t),
    style: {
      padding: "9px 16px",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 13.5,
      fontWeight: 500,
      border: "1px solid " + (time === t ? "transparent" : "var(--border-strong)"),
      background: time === t ? "var(--primary-soft)" : "transparent",
      color: time === t ? "var(--mocha-800)" : "var(--text-secondary)"
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-secondary)",
      display: "block",
      marginBottom: 7
    }
  }, "\uC694\uCCAD \uC0AC\uD56D (\uC120\uD0DD)"), /*#__PURE__*/React.createElement("textarea", {
    placeholder: "\uC6D0\uD558\uC2DC\uB294 \uB208\uC379 \uC2A4\uD0C0\uC77C\uC774\uB098 \uAD81\uAE08\uD55C \uC810\uC744 \uC801\uC5B4\uC8FC\uC138\uC694.",
    rows: 3,
    style: {
      width: "100%",
      boxSizing: "border-box",
      resize: "vertical",
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: "12px 14px",
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      color: "var(--text-primary)",
      outline: "none"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: agree,
    onChange: setAgree,
    label: "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Button, {
    full: true,
    size: "lg",
    disabled: !agree,
    onClick: () => agree && setDone(true)
  }, "\uC608\uC57D \uC2E0\uCCAD\uD558\uAE30")))), /*#__PURE__*/React.createElement(Card, {
    elevation: "none",
    style: {
      background: "var(--surface-sunken)",
      border: "1px solid var(--border-soft)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 20
    }
  }, "\uC774\uC6A9 \uC548\uB0B4"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "18px 0 0",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, [["clock", "영업 시간", "평일 11:00–20:00\n주말 예약 문의"], ["map-pin", "위치", "서울 강남구\n예약 확정 시 상세 주소 안내"], ["calendar-check", "예약제", "100% 예약제 운영\n방문 전 꼭 예약해 주세요"], ["instagram", "문의", "@mellowbrow DM"]].map(([ic, t, d]) => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mocha-600)",
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)",
      whiteSpace: "pre-line",
      lineHeight: 1.6
    }
  }, d))))))));
}
window.Booking = Booking;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Booking.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Chrome.jsx
try { (() => {
/* global React */
// Mellowbrow website — shared chrome: Icon (Lucide), Header, Footer, Section helpers

function Icon({
  name,
  size = 20,
  color = "currentColor",
  style = {}
}) {
  // Lucide replaces <i data-lucide> with an <svg class="lucide">; size via font-size.
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size,
      lineHeight: 0,
      color,
      display: "inline-flex",
      ...style
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": name
  }));
}
function useLucide(dep) {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
}
const NAV = [{
  id: "home",
  label: "홈"
}, {
  id: "services",
  label: "시술 안내"
}, {
  id: "gallery",
  label: "갤러리"
}, {
  id: "booking",
  label: "예약"
}];
function Header({
  route,
  onNavigate
}) {
  const {
    Logo,
    Button
  } = window.MellowbrowDesignSystem_20fe7e;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "color-mix(in oklab, var(--paper) 86%, transparent)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "16px var(--gutter)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate("home"),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "full",
    size: 24
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 30,
      alignItems: "center"
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    onClick: () => onNavigate(n.id),
    style: {
      cursor: "pointer",
      fontSize: 14.5,
      fontWeight: 500,
      whiteSpace: "nowrap",
      color: route === n.id ? "var(--text-primary)" : "var(--text-secondary)",
      borderBottom: route === n.id ? "1.5px solid var(--mocha-600)" : "1.5px solid transparent",
      paddingBottom: 3,
      transition: "color var(--dur) var(--ease-out)"
    }
  }, n.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/mellowbrow/",
    target: "_blank",
    rel: "noreferrer",
    style: {
      color: "var(--text-secondary)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "instagram",
    size: 20
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onNavigate("booking")
  }, "\uC608\uC57D\uD558\uAE30"))));
}
function Footer({
  onNavigate
}) {
  const {
    Logo
  } = window.MellowbrowDesignSystem_20fe7e;
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-dark)",
      color: "var(--text-on-dark)",
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "64px var(--gutter) 40px",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    variant: "full",
    size: 26,
    color: "var(--paper)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      maxWidth: 280,
      fontSize: 14,
      lineHeight: 1.7,
      color: "var(--mocha-300)"
    }
  }, "\uACB0\uC744 \uC0B4\uB9B0 \uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uB208\uC379. 1:1 \uB9DE\uCDA4 \uB514\uC790\uC778, 100% \uC608\uC57D\uC81C\uB85C \uC6B4\uC601\uD569\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow",
    style: {
      color: "var(--mocha-400)"
    }
  }, "\uB458\uB7EC\uBCF4\uAE30"), NAV.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    onClick: () => onNavigate(n.id),
    style: {
      cursor: "pointer",
      fontSize: 14,
      color: "var(--mocha-300)"
    }
  }, n.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow",
    style: {
      color: "var(--mocha-400)"
    }
  }, "\uCC3E\uC544\uC624\uC2DC\uB294 \uAE38"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--mocha-300)",
      lineHeight: 1.7
    }
  }, "\uC11C\uC6B8 \uAC15\uB0A8\uAD6C \xB7 \uC608\uC57D \uC2DC \uC548\uB0B4", /*#__PURE__*/React.createElement("br", null), "\uD3C9\uC77C 11:00\u201320:00", /*#__PURE__*/React.createElement("br", null), "\uC8FC\uB9D0 \uC608\uC57D \uBB38\uC758"), /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/mellowbrow/",
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontSize: 14,
      color: "var(--paper)",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "instagram",
    size: 16
  }), " @mellowbrow"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--mocha-800)",
      padding: "18px var(--gutter)",
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      fontSize: 12,
      color: "var(--mocha-400)"
    }
  }, "\xA9 2026 mellowbrow. All rights reserved."));
}
function Section({
  children,
  bg = "var(--surface-page)",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: bg,
      padding: "var(--space-9) 0",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--gutter)"
    }
  }, children));
}

// Warm gradient placeholder standing in for real photography
function Photo({
  ratio = "4 / 3",
  variant = "a",
  label,
  radius = "var(--radius-lg)",
  style = {}
}) {
  const grads = {
    a: "linear-gradient(135deg, #EEDFD0, #E0C5B2)",
    b: "linear-gradient(135deg, #F3E7E1, #E3C7B9)",
    c: "linear-gradient(135deg, #EAE0D2, #D4C0A6)",
    d: "linear-gradient(160deg, #E7D6C4, #C9B49A)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: ratio,
      background: grads[variant],
      borderRadius: radius,
      position: "relative",
      overflow: "hidden",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 12,
      left: 14,
      fontSize: 11,
      letterSpacing: "0.06em",
      color: "var(--mocha-700)",
      opacity: 0.7
    }
  }, label));
}
Object.assign(window, {
  Icon,
  useLucide,
  Header,
  Footer,
  Section,
  Photo,
  MB_NAV: NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Gallery.jsx
try { (() => {
/* global React */
// Mellowbrow website — Before/After gallery

function Gallery({
  onNavigate
}) {
  const {
    Badge,
    Button
  } = window.MellowbrowDesignSystem_20fe7e;
  const {
    Section,
    Photo
  } = window;
  const [filter, setFilter] = React.useState("전체");
  const tabs = ["전체", "자연눈썹", "콤보", "섀도우", "입술"];
  const items = [["자연눈썹", "a", "5 / 6"], ["콤보", "b", "5 / 6"], ["섀도우", "c", "5 / 6"], ["입술", "b", "5 / 6"], ["자연눈썹", "d", "5 / 6"], ["콤보", "a", "5 / 6"], ["섀도우", "c", "5 / 6"], ["자연눈썹", "b", "5 / 6"]];
  const shown = filter === "전체" ? items : items.filter(i => i[0].includes(filter));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      maxWidth: 620,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow"
  }, "Gallery"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--fs-display-md)",
      marginTop: 16
    }
  }, "\uC804\uD6C4 \uAC24\uB7EC\uB9AC"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 16,
      lineHeight: 1.8,
      color: "var(--text-secondary)"
    }
  }, "\uC2E4\uC81C \uC2DC\uC220 \uC804\uD6C4 \uC0AC\uC9C4\uC785\uB2C8\uB2E4. \uBAA8\uB4E0 \uC0AC\uC9C4\uC740 \uACE0\uAC1D \uB3D9\uC758 \uD6C4 \uAC8C\uC2DC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 10,
      marginTop: 36,
      flexWrap: "wrap"
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setFilter(t),
    style: {
      padding: "8px 18px",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      whiteSpace: "nowrap",
      fontFamily: "var(--font-sans)",
      fontSize: 13.5,
      fontWeight: 600,
      border: "1px solid " + (filter === t ? "transparent" : "var(--border-strong)"),
      background: filter === t ? "var(--primary)" : "transparent",
      color: filter === t ? "var(--on-primary)" : "var(--text-secondary)",
      transition: "all var(--dur) var(--ease-out)"
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 18,
      marginTop: 36
    }
  }, shown.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    ratio: it[2],
    variant: it[1],
    radius: "var(--radius-lg)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand"
  }, it[0])), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "center",
      padding: "6px 0",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--paper)",
      background: "color-mix(in oklab, var(--mocha-900) 55%, transparent)",
      borderRadius: "0 0 0 var(--radius-lg)"
    }
  }, "BEFORE"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "center",
      padding: "6px 0",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--paper)",
      background: "color-mix(in oklab, var(--mocha-700) 55%, transparent)",
      borderRadius: "0 0 var(--radius-lg) 0"
    }
  }, "AFTER"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onNavigate("booking")
  }, "\uB098\uB3C4 \uC608\uC57D\uD558\uAE30"))));
}
window.Gallery = Gallery;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Gallery.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
/* global React */
// Mellowbrow website — Home screen

function Home({
  onNavigate
}) {
  const {
    Button,
    Badge,
    Card,
    ServiceCard
  } = window.MellowbrowDesignSystem_20fe7e;
  const {
    Section,
    Photo,
    Icon
  } = window;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-9) var(--gutter)",
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      gap: 56,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow"
  }, "Brow Atelier \xB7 Seoul"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "clamp(2.5rem, 1.4rem + 2.8vw, 3.4rem)",
      marginTop: 18,
      color: "var(--text-primary)"
    }
  }, "\uACB0\uC744 \uC0B4\uB9B0,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic",
      color: "var(--mocha-600)"
    }
  }, "\uC790\uC5F0\uC2A4\uB7EC\uC6B4"), " \uB208\uC379"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 22,
      fontSize: 17,
      lineHeight: 1.75,
      color: "var(--text-secondary)",
      maxWidth: 440
    }
  }, "\uC5BC\uAD74\uD615\uACFC \uBD84\uC704\uAE30\uC5D0 \uAF2D \uB9DE\uB294 1:1 \uB9DE\uCDA4 \uB514\uC790\uC778. \uACFC\uD558\uC9C0 \uC54A\uAC8C, \uC624\uB798 \uB450\uACE0 \uBD10\uB3C4 \uD3B8\uC548\uD55C \uB208\uC379\uC744 \uADF8\uB824\uB4DC\uB824\uC694."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onNavigate("booking")
  }, "\uC608\uC57D\uD558\uAE30"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => onNavigate("services")
  }, "\uC2DC\uC220 \uB458\uB7EC\uBCF4\uAE30")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: "flex",
      gap: 36
    }
  }, [["8년+", "브로우 경력"], ["1:1", "맞춤 디자인"], ["100%", "예약제"]].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 30,
      color: "var(--text-primary)"
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    ratio: "4 / 5",
    variant: "b",
    radius: "var(--radius-xl)",
    label: "hero \xB7 brow close-up",
    style: {
      boxShadow: "var(--shadow-lg)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: -22,
      left: -22,
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      color: "var(--blush-500)"
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Icon, {
    key: i,
    name: "star",
    size: 15
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--text-primary)"
    }
  }, "4.9"), " \xB7 \uD6C4\uAE30 320+"))))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--surface-sunken)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "0.9fr 1.1fr",
      gap: 56,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    ratio: "5 / 4",
    variant: "c",
    radius: "var(--radius-xl)",
    label: "studio mood"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow"
  }, "Our Philosophy"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--fs-display-md)",
      marginTop: 16
    }
  }, "\uB35C\uC5B4\uB0B4\uB294 \uB514\uC790\uC778"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      fontSize: 16,
      lineHeight: 1.8,
      color: "var(--text-secondary)"
    }
  }, "\uBA5C\uB85C\uBE0C\uB85C\uC6B0\uB294 \u2018\uB208\uC379\uC744 \uADF8\uB9B0 \uB4EF \uC548 \uADF8\uB9B0 \uB4EF\u2019 \uC790\uC5F0\uC2A4\uB7EC\uC6C0\uC744 \uAC00\uC7A5 \uC911\uC694\uD558\uAC8C \uC0DD\uAC01\uD574\uC694. \uC720\uD589\uC744 \uB530\uB974\uAE30\uBCF4\uB2E4 \uC5BC\uAD74\uC758 \uADE0\uD615\uC744 \uBA3C\uC800 \uBCF4\uACE0, \uD55C \uC62C \uD55C \uC62C \uACB0\uC744 \uC0B4\uB824 \uB610\uB837\uD558\uC9C0\uB9CC \uBD80\uB2F4\uC2A4\uB7FD\uC9C0 \uC54A\uC740 \uB208\uC379\uC744 \uC644\uC131\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("ul", {
    style: {
      marginTop: 24,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      listStyle: "none",
      padding: 0
    }
  }, ["충분한 상담 후 디자인을 함께 결정해요", "피부 톤에 맞춘 색소 조색", "첫 시술 후 리터치 1회 포함"].map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontSize: 15,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mocha-600)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18
  })), t)))))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow"
  }, "Signature Menu"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--fs-display-md)",
      marginTop: 14
    }
  }, "\uC2DC\uADF8\uB2C8\uCC98 \uC2DC\uC220")), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => onNavigate("services")
  }, "\uC804\uCCB4 \uBCF4\uAE30 \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(ServiceCard, {
    titleKo: "\uC790\uC5F0\uB208\uC379",
    titleEn: "Natural",
    tag: "\uC2DC\uADF8\uB2C8\uCC98",
    description: "\uACB0\uC744 \uD55C \uC62C\uC529 \uC0B4\uB9B0 \uAC00\uC7A5 \uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uB514\uC790\uC778.",
    price: "\u20A9250,000",
    duration: "\uC57D 2\uC2DC\uAC04",
    onSelect: () => onNavigate("booking")
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    titleKo: "\uCF64\uBCF4\uB208\uC379",
    titleEn: "Combo",
    description: "\uC790\uC5F0\uACB0 + \uC74C\uC601\uC73C\uB85C \uB610\uB837\uD558\uAC8C \uCC44\uC6B4 \uC2A4\uD0C0\uC77C.",
    price: "\u20A9290,000",
    duration: "\uC57D 2\uC2DC\uAC04",
    onSelect: () => onNavigate("booking")
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    titleKo: "\uC100\uB3C4\uC6B0\uB208\uC379",
    titleEn: "Shadow",
    description: "\uD654\uC7A5\uD55C \uB4EF \uC740\uC740\uD55C \uADF8\uB77C\uB370\uC774\uC158 \uB208\uC379.",
    price: "\u20A9270,000",
    duration: "\uC57D 2\uC2DC\uAC04",
    onSelect: () => onNavigate("booking")
  }))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--surface-sunken)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow"
  }, "Reviews"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--fs-display-md)",
      marginTop: 14
    }
  }, "\uACE0\uAC1D \uD6C4\uAE30")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, [["“알아서 자연스럽게 해주세요 했는데 딱 제 얼굴에 맞게 그려주셨어요. 주변에서 눈썹 어디서 했냐고 물어봐요.”", "김OO · 자연눈썹"], ["“상담을 정말 꼼꼼히 해주셔서 믿고 맡겼어요. 과하지 않고 화장 안 해도 인상이 또렷해졌어요.”", "이OO · 콤보눈썹"], ["“처음 눈썹문신이라 걱정했는데 시술 내내 편안했어요. 리터치까지 받고 완전 만족합니다.”", "박OO · 섀도우눈썹"]].map(([quote, who]) => /*#__PURE__*/React.createElement(Card, {
    key: who,
    elevation: "sm"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      color: "var(--blush-500)",
      marginBottom: 12
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Icon, {
    key: i,
    name: "star",
    size: 14
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-serif-ko)",
      fontSize: 16,
      lineHeight: 1.7,
      color: "var(--text-primary)"
    }
  }, quote), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, who))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-dark)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-9) var(--gutter)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow",
    style: {
      color: "var(--mocha-400)"
    }
  }, "Booking"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--fs-display-md)",
      marginTop: 16,
      color: "var(--text-on-dark)"
    }
  }, "\uC624\uB298\uC758 \uB208\uC379, \uBA5C\uB85C\uBE0C\uB85C\uC6B0\uC5D0\uC11C"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 16,
      color: "var(--mocha-300)",
      maxWidth: 480,
      marginLeft: "auto",
      marginRight: "auto"
    }
  }, "100% \uC608\uC57D\uC81C\uB85C \uC6B4\uC601\uB429\uB2C8\uB2E4. \uC6D0\uD558\uC2DC\uB294 \uB0A0\uC9DC\uC640 \uC2DC\uC220\uC744 \uB0A8\uACA8\uC8FC\uC2DC\uBA74 \uBE60\uB974\uAC8C \uC548\uB0B4\uB4DC\uB9B4\uAC8C\uC694."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onNavigate("booking")
  }, "\uC608\uC57D \uC2E0\uCCAD\uD558\uAE30")))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
/* global React */
// Mellowbrow website — Services & pricing

function Services({
  onNavigate
}) {
  const {
    ServiceCard,
    Accordion,
    Button
  } = window.MellowbrowDesignSystem_20fe7e;
  const {
    Section
  } = window;
  const services = [["자연눈썹", "Natural", "시그니처", "결을 한 올씩 살린 가장 자연스러운 디자인.", "₩250,000", "약 2시간 · 리터치 포함", "a"], ["콤보눈썹", "Combo", null, "자연결 위에 음영을 더해 또렷하게.", "₩290,000", "약 2시간 · 리터치 포함", "b"], ["섀도우눈썹", "Shadow", null, "화장한 듯 은은한 그라데이션 눈썹.", "₩270,000", "약 2시간 · 리터치 포함", "c"], ["남자눈썹", "Men's", null, "자연스러운 결로 인상을 또렷하게.", "₩260,000", "약 2시간 · 리터치 포함", "d"], ["입술 (물광)", "Lip", "인기", "혈색을 더해 화사하고 또렷한 입술로.", "₩350,000", "약 2.5시간 · 리터치 포함", "b"], ["리터치", "Retouch", null, "타 샵 시술 후 결을 다시 살리는 보정.", "₩150,000", "약 1.5시간", "c"]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      maxWidth: 620,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow"
  }, "Service & Pricing"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--fs-display-md)",
      marginTop: 16
    }
  }, "\uC2DC\uC220 \uC548\uB0B4"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 16,
      lineHeight: 1.8,
      color: "var(--text-secondary)"
    }
  }, "\uBAA8\uB4E0 \uC2DC\uC220\uC740 \uCDA9\uBD84\uD55C \uC0C1\uB2F4 \uD6C4 1:1 \uB9DE\uCDA4\uC73C\uB85C \uC9C4\uD589\uB418\uBA70, \uCCAB \uC2DC\uC220 \uD6C4 4~6\uC8FC \uB0B4 1\uD68C \uB9AC\uD130\uCE58\uAC00 \uD3EC\uD568\uB429\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24,
      marginTop: 48
    }
  }, services.map(s => /*#__PURE__*/React.createElement(ServiceCard, {
    key: s[0],
    titleKo: s[0],
    titleEn: s[1],
    tag: s[2],
    description: s[3],
    price: s[4],
    duration: s[5],
    onSelect: () => onNavigate("booking")
  })))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--surface-sunken)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "0.8fr 1.2fr",
      gap: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "mb-eyebrow"
  }, "FAQ"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--fs-display-md)",
      marginTop: 14
    }
  }, "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--text-secondary)"
    }
  }, "\uAD81\uAE08\uD55C \uC810\uC774 \uB354 \uC788\uB2E4\uBA74 \uC778\uC2A4\uD0C0\uADF8\uB7A8 DM\uC73C\uB85C \uD3B8\uD558\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => onNavigate("booking")
  }, "\uC608\uC57D \uBB38\uC758"))), /*#__PURE__*/React.createElement(Accordion, {
    items: [{
      q: "시술은 얼마나 걸리나요?",
      a: "디자인 상담을 포함해 약 2시간 소요됩니다. 충분히 상의한 뒤 진행하니 시간을 여유 있게 잡아주세요."
    }, {
      q: "통증은 어느 정도인가요?",
      a: "마취 연고를 충분히 도포한 뒤 진행해 대부분 견딜 만한 정도입니다. 개인차가 있을 수 있어요."
    }, {
      q: "리터치는 꼭 받아야 하나요?",
      a: "첫 시술 후 색이 자리잡는 과정에서 균일하게 보정하기 위해 1회 리터치를 권장하며, 가격에 포함되어 있습니다."
    }, {
      q: "지속 기간은 얼마나 되나요?",
      a: "피부 타입과 관리에 따라 보통 1~2년 정도 유지됩니다."
    }, {
      q: "예약은 어떻게 하나요?",
      a: "100% 예약제로 운영합니다. 홈페이지 예약 또는 인스타그램 DM으로 신청해 주세요."
    }]
  }))));
}
window.Services = Services;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

})();

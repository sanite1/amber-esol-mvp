/**
 * PasswordInput — a drop-in replacement for `<input type="password">`
 * that adds a show/hide eye toggle.
 *
 * Use anywhere the platform asks for a password. The component owns
 * its own show/hide state, so callers don't need to manage it.
 *
 * Design choices
 * ==============
 *
 *   - Behaves exactly like a native <input> via React.forwardRef so
 *     it composes with react-hook-form's `{...register("password")}`
 *     spread without any wrapping helpers.
 *   - The eye button is absolutely positioned INSIDE a wrapping span
 *     so the underlying input keeps its natural placement in the
 *     form — no parent layout changes required.
 *   - Padding-right is bumped on the input to keep the entered text
 *     from sliding under the icon. Callers can override via the
 *     `style` / `className` props on the input itself; the wrapper
 *     just provides positioning context.
 *   - When toggled to visible, the type flips to `"text"` and the
 *     icon flips. The icon's accessible label reflects the action
 *     ("Show password" when hidden, "Hide password" when visible).
 *   - `aria-pressed` on the button announces the toggle state to
 *     screen readers without a visual indicator.
 *
 * A11y notes
 * ==========
 *
 *   - The eye button is `type="button"` so it never submits the
 *     surrounding form by accident.
 *   - It carries `tabIndex={-1}` by default — keyboard users move
 *     past the input via Tab and reveal the password manually only
 *     if they need to. Set `revealButtonTabbable` to true to opt in
 *     to focus traversal (e.g. on a password-reset page where the
 *     user is more likely to want to verify input).
 */

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Allows the eye button to receive focus via Tab. Defaults to
   * false — most password fields are part of a tight signin flow
   * where Tab should move to the submit button next, not to the
   * eye toggle.
   */
  revealButtonTabbable?: boolean;
  /**
   * Override the icon size. Defaults to 16 — matches the platform's
   * existing form icons (lucide-react default for inline form chrome).
   */
  iconSize?: number;
  /**
   * Wrapper class — applied to the `<span>` that positions the eye
   * button. The wrapper has `display: inline-block` + `position:
   * relative` baked in so the absolute child anchors correctly.
   */
  wrapperClassName?: string;
  /**
   * Wrapper inline style — merged with the defaults. Useful when
   * the caller needs `width: 100%` to make the input fill its
   * column (the default wrapper is inline-block which shrink-wraps).
   */
  wrapperStyle?: React.CSSProperties;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      revealButtonTabbable = false,
      iconSize = 16,
      wrapperClassName,
      wrapperStyle,
      style,
      ...inputProps
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);

    // Bake in:
    //  - `width: 100%` + `box-sizing: border-box` so the input fills
    //    the wrapper. Without this, an unstyled `<input>` falls back
    //    to its intrinsic size (~200px from the default `size="20"`
    //    attribute) and the eye button lands way to the right of the
    //    visual textfield. Common gotcha when the parent container
    //    is `display: flex` — wrapping the input in a span moves it
    //    out of the flex-stretch flow.
    //  - `paddingRight: 38` so the icon doesn't overlap typed text.
    //
    // Caller's `style` wins if it explicitly sets any of these
    // properties.
    const mergedStyle: React.CSSProperties = {
      width: "100%",
      boxSizing: "border-box",
      paddingRight: 38,
      ...style,
    };

    const mergedWrapperStyle: React.CSSProperties = {
      position: "relative",
      // Block (not inline-block) so the wrapper behaves identically
      // to the original input in flex / grid / block layouts. An
      // inline-block element doesn't always stretch to fill its
      // parent in cross-axis contexts; block reliably does.
      display: "block",
      width: "100%",
      ...wrapperStyle,
    };

    return (
      <span className={wrapperClassName} style={mergedWrapperStyle}>
        <input
          {...inputProps}
          ref={ref}
          type={visible ? "text" : "password"}
          style={mergedStyle}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          tabIndex={revealButtonTabbable ? 0 : -1}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: 0,
            padding: 4,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "inherit",
            opacity: 0.55,
            // Subtle hover; matches the focus ring used elsewhere
            // on auth forms without depending on the global CSS.
            transition: "opacity 120ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.55";
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.55";
          }}
        >
          {visible ? (
            <EyeOff size={iconSize} aria-hidden="true" />
          ) : (
            <Eye size={iconSize} aria-hidden="true" />
          )}
        </button>
      </span>
    );
  },
);

export default PasswordInput;

# UI Code Review TODO (`src/ui`)

Code-implementation review only (animations and hardcoded px values are tracked separately).

## 1. Bug: `animate-slide-up` is never defined
- [ ] Add `--animate-slide-up` to `@theme` and its `@keyframes` in `src/index.css`. `BottomSheet.tsx` uses the class, but nothing defines it, so it does nothing.
- [ ] Keep `BottomSheet` mounted and drive it with `data-state`. It currently returns `null` when closed, so it can't play an exit animation.

## 2. Add tokens to `index.css`
The `@theme` block only has text, background and border colours. Components also use raw palette values.

- [ ] `--color-gain` for `emerald-500/600/700` (chart gain, ring, copied state, restore note)
- [ ] `--color-principal` for `slate-400` (chart principal and its legend)
- [ ] `--color-warning` for `amber-500` (withdrawal marker)
- [ ] `--color-danger` and `--color-danger-surface` for `red-500/600` and `red-50` (error, delete)
- [ ] `--color-bg-pressed` for the `hover:bg-gray-300` used by the 4 grey buttons
- [ ] Replace `gray-400/500/600/900` (InfoButton, BottomSheet, chart) with the existing `text-muted`, `text-secondary` and `text-primary`
- [ ] `BottomSheet`: `bg-white` → `bg-bg-surface`
- [ ] `BottomSheet`: `text-[14px] font-semibold leading-[20px]` → existing `text-body-14-semibold`
- [ ] Add `text-caption-10` for the chart's `text-[10px]` (used twice). Use `text-caption-12` for the `InputField` error (`text-xs`).
- [ ] Define the chart bar colours once (tokens or a `CHART_COLORS` constant). They are duplicated between the bars and the legend.
- [ ] Add a `.card` / `.surface` utility for `bg-bg-surface border border-border-subtle rounded-*` (InputCard, WithdrawalList, ReturnRateInfoSheet)

## 3. Extract shared components
- [ ] **`Button`** with `secondary` and `ghost-danger` variants. The same long class string is copy-pasted in `ShareButton`, `AddWithdrawalButton` and the `WithdrawalSheet` submit button. The delete button there is a fourth variant.
- [ ] **`IconButton`** for `InfoButton`, the `BottomSheet` close button, the `ResultCardCollapsed` arrow and the `ResultDetailsSheet` prev/next buttons
- [ ] **`LabeledField`** (`label`, optional `onInfo`, `unit`, `value`, `onChange`). The `<div><label/><InputField/></div>` pattern appears about 13 times, including the label plus optional `InfoButton` form.
- [ ] **`FormSection`** (`title`, optional info button). It should also own the `border-b border-border-subtle pb-4` wrapper that `InputCard` adds to three sections.
- [ ] **`SegmentedControl`** to replace `AccountSelector`'s two mirrored buttons and the bucket picker in `WithdrawalSheet`
- [ ] **`TipListSheet`** (`title`, `tips`) to replace `YearsInfoSheet` and `PurchaseSettingsInfoSheet`, which differ only in `TIPS` and title
- [ ] **`TextInput`** to replace the hand-rolled label field in `WithdrawalSheet`, which copies `InputField`'s container styling
- [ ] **`StatCell` / `StatSection`** in `ResultDetailsSheet`. The `h4` plus grid plus `label / value / sub` triple repeats about 8 times.

## 4. Merge the update handlers
- [ ] `InitialHoldingsSection`: replace the 4 near-identical handlers with one `update(bucket, field, val)`, or render the fields from a `[{bucket, field, label}]` config array
- [ ] `InputCard`: replace the per-field wrapper closures `(x) => onPlanUpdate({ x })` with a `bind(key)` helper or a `usePlanField(key)` hook
- [ ] `InputCard`: pass `plan` and `onPlanUpdate` to the sections instead of 3 to 6 individual props each
- [ ] `WithdrawalSheet`: replace the 4 `useState`s with a single `draft` built by `toDraft(withdrawal, maxYears)`. Alternatively split the form into an inner component that mounts only while the sheet is open, which removes the sync `useEffect`. The defaults are currently written twice.
- [ ] Move the magic defaults `10` and `1_000_000` from `WithdrawalSheet` to `core/engine/constants.ts`
- [ ] `App.tsx`: replace the 6 open/close `useState`s with a `useDisclosure()` hook or a single `activeSheet` union state
- [ ] `App.tsx`: move `handleSaveWithdrawal` and the add/edit handlers into the withdrawal sheet's container

## 5. Duplicated or desynced logic
- [ ] **Sticky/collapse values live in two places.** `App.tsx` hardcodes `272`, `100`, `16` and `12` in its scroll handler. `ResultCard` separately measures its real heights, and its initial state values are the same `272` and `100`. Move this into one `useStickyCollapse` hook, or into `ResultCard`, using the measured heights.
- [ ] `ResultCard`: the `+ 22` "padding + border" is coupled to the Tailwind classes. Use `ResizeObserver` or border-box measurement.
- [ ] `ResultCard`: remove the unused `forwardRef` / `useImperativeHandle`, or pass `headerRef` through it
- [ ] Add `sumHoldings(holdings) → { marketValue, principal, gain }`. Totals are computed separately in `BarChartPreview`, `ResultDetailsSheet`, `ResultCard` and `InputCard` (`hasExistingHoldings`).
- [ ] `ResultDetailsSheet` filters withdrawals three times by bucket and does `proportional / 2` itself. That is domain logic copied into the UI. Check whether it can read `YearlyRecord.withdrawals.{tsumitate,growth}`, which `BarChartPreview` already uses. If so, drop the `withdrawals` prop.
- [ ] `ResultDetailsSheet`: drop the redundant `horizonYears` prop, since it equals `yearlyRecords.length`
- [ ] Merge `BUCKET_LABEL_MAP` (`WithdrawalList`) and `BUCKET_OPTIONS` (`WithdrawalSheet`) into one `BUCKET_LABELS` constant and derive the options from it
- [ ] `PurchaseSettingsInfoSheet` hardcodes "360万円" and "1,800万円" even though `STATUTORY_LIMITS` exists. Build them with `formatYen`.
- [ ] `ReturnRateInfoSheet`: derive the title's "3.0%" from `rate` with `formatPercent` (currently unused). Name the `< 0.001` tolerance.
- [ ] Add a shared `YEN_PER_MAN` for the `10_000` written in both `formatters.ts` and `unitConversion.ts`
- [ ] Add an `APP_TITLE` constant for the title shared by `Header` and the `ShareButton` share payload

## 6. Smaller items
- [ ] `WithdrawalHeader`: use one chevron with a rotate class instead of swapping `ChevronUp` / `ChevronDown`
- [ ] `ShareButton`: clear the `setTimeout` on unmount (extract `useCopyFeedback` / `useTimedFlag`) and drop the unused `catch (err)` variable
- [ ] `ResultCardCollapsed`: make the whole card one `button`. Currently a clickable `div` and an inner `button` both call `onOpenDetails`, which needs `stopPropagation`.
- [ ] `BarChartPreview`: fix the nested click handlers and add `onKeyDown` to the `role="button"` div
- [ ] `ResultCard`: replace the repeated fade `cn(...)` on the collapsed and expanded wrappers with a `fadeClass(visible)` helper
- [ ] `Footer`: replace the placeholder `https://github.com` link with the real repo URL, in a constant
- [ ] Drop `className` props that nothing passes

## Suggested order
1. Fix `animate-slide-up` and add the colour tokens.
2. Extract `Button`, `LabeledField` and `FormSection`.
3. Add the `sumHoldings` helper and shared bucket constants.
4. Refactor the App state and the sticky/collapse hook.

Labeled dropdown — service, time-slot, branch selection.

```jsx
<Select label="시술 선택" placeholder="메뉴를 골라주세요"
  options={["자연눈썹", "콤보눈썹", "섀도우눈썹", "입술"]}
  value={v} onChange={e => setV(e.target.value)} />
```

`options` accepts strings or `{value,label}`. Optional `placeholder`, `hint`.

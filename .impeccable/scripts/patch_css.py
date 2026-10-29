import io

p = 'src/styles/global.css'
s = open(p).read()
pairs = []

pairs.append(("""*,
*::before,
*::after {
  box-sizing: border-box;
}""", """*,
*::before,
*::after {
  box-sizing: border-box;
}

[hidden] {
  display: none !important;
}"""))

pairs.append(("""  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.4;
  letter-spacing: 0.045em;
  font-weight: 550;
  color: #454545;
  text-transform: uppercase;""", """  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.4;
  letter-spacing: 0.04em;
  font-weight: 600;
  color: #3f3f3f;
  text-transform: uppercase;"""))

pairs.append(("""  text-transform: none;
  letter-spacing: 0.015em;
  font-size: 12px;
}""", """  text-transform: none;
  letter-spacing: 0.015em;
  font-size: 12.5px;
}"""))

pairs.append(("""  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--graphite);
  letter-spacing: 0.03em;
  line-height: 1;
  padding-left: 12px;
  margin-left: 2px;
  border-left: 1px solid var(--border);
  text-transform: none;
}""", """  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--graphite);
  letter-spacing: 0.01em;
  line-height: 1;
  padding-left: 12px;
  margin-left: 2px;
  border-left: 1px solid var(--border);
  text-transform: none;
}"""))

pairs.append((""".hero__facts .mono {
  font-size: 10.5px;
  letter-spacing: 0.06em;
}""", """.hero__facts .mono {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.055em;
  color: #3a3a3a;
}"""))

pairs.append((""".dest__title {
  display: block;
  font-size: 12.5px;
  line-height: 17px;
  letter-spacing: -0.01em;
  color: var(--ink);
}""", """.dest__title {
  display: block;
  font-size: 12.5px;
  line-height: 17px;
  letter-spacing: -0.01em;
  color: var(--ink);
  text-wrap: pretty;
}"""))

pairs.append((""".step__n {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--blue);
  letter-spacing: 0.04em;
}""", """.step__n {
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--blue);
  letter-spacing: 0.04em;
}"""))

pairs.append(("""  background: var(--muted);
  font-family: var(--font-mono);
  font-size: 10.5px;
  line-height: 1.35;
  color: var(--ink);""", """  background: var(--muted);
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1.4;
  color: #1a1a1a;"""))

pairs.append((""".diff {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.9;""", """.diff {
  font-family: var(--font-mono);
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.9;"""))

pairs.append((""".diff .diff__label {
  color: var(--border-strong);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}""", """.diff .diff__label {
  color: #8f8f8f;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}"""))

pairs.append(("""  font-family: var(--font-mono);
  font-size: 9.5px;
  color: var(--graphite);
  text-transform: none;
}

/* ---------- demo""", """  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--graphite);
  text-transform: none;
}

/* ---------- demo"""))

pairs.append((""".demo__article .demo-link,
.demo__article .demo-suggest,
.demo__article [data-autolink] {
  color: var(--blue);
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  background: var(--blue-wash);
  border-radius: 2px;
  padding: 1px 1px 2px;
  animation: link-in 420ms var(--ease-out) both;
}

.demo__article .demo-suggest,
.demo__article span[data-autolink] {
  text-decoration-style: dashed;
  color: var(--blue-deep);
}""", """.demo__article .demo-link,
.demo__article [data-autolink] {
  color: var(--blue);
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  animation: link-in 420ms var(--ease-out) both;
}

.demo__article span[data-autolink] {
  text-decoration-style: dashed;
  color: var(--blue-deep);
  background: var(--blue-wash);
  border-radius: 2px;
  padding: 1px 2px 2px;
}"""))

pairs.append((""".corpus__url {
  grid-column: 1;
  font-family: var(--font-mono);
  font-size: 9.5px;""", """.corpus__url {
  grid-column: 1;
  font-family: var(--font-mono);
  font-size: 10px;"""))

pairs.append((""".demo__pane-head .mono {
  font-size: 9.5px;
  letter-spacing: 0.08em;
}""", """.demo__pane-head .mono {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.075em;
}"""))

pairs.append((""".demo__result-head .mono {
  font-size: 9.5px;
  letter-spacing: 0.08em;
}""", """.demo__result-head .mono {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.075em;
}"""))

pairs.append((""".demo__stats .mono {
  font-size: 9.5px;
  letter-spacing: 0.04em;
}""", """.demo__stats .mono {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
}"""))

pairs.append(("""  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--ink);
  margin-left: 5px;
  text-transform: none;
  letter-spacing: 0.01em;
}""", """  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 11.5px;
  color: var(--ink);
  margin-left: 5px;
  text-transform: none;
  letter-spacing: 0.01em;
}"""))

pairs.append((""".demo__diag {
  padding: 0 14px 12px;
  color: var(--graphite);
  text-transform: none;
  letter-spacing: 0.01em;
  font-size: 10px;
  line-height: 16px;
}""", """.demo__diag {
  padding: 0 14px 12px;
  color: #555555;
  text-transform: none;
  letter-spacing: 0.01em;
  font-size: 10.5px;
  line-height: 16px;
}"""))

pairs.append(("""  display: block;
  font-size: 11.5px;
  line-height: 16px;
  color: var(--graphite);
  margin-top: 2px;""", """  display: block;
  font-size: 12px;
  line-height: 16px;
  color: var(--graphite);
  margin-top: 2px;"""))

pairs.append((""".code-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--muted);
}""", """.code-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--muted);
  min-width: 0;
  max-width: 100%;
}

.code-card > div {
  min-width: 0;
  overflow: hidden;
}"""))

pairs.append(("""  padding: 20px 18px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.95;
  letter-spacing: 0.01em;
  tab-size: 2;""", """  padding: 20px 18px;
  overflow-x: auto;
  max-width: 100%;
  font-family: var(--font-mono);
  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.9;
  letter-spacing: 0.01em;
  tab-size: 2;"""))

pairs.append((""".pkg__row .mono {
  font-size: 9.5px;
  letter-spacing: 0.06em;
}""", """.pkg__row .mono {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
}"""))

pairs.append((""".pkg__row span:last-child {
  font-family: var(--font-mono);
  font-size: 11.5px;""", """.pkg__row span:last-child {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;"""))

pairs.append((""".inv__id {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--graphite);
  letter-spacing: 0.03em;
}""", """.inv__id {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  color: #555555;
  letter-spacing: 0.03em;
}"""))

pairs.append((""".inv__by {
  font-family: var(--font-mono);
  font-size: 9.5px;""", """.inv__by {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;"""))

pairs.append((""".scope__version {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 9.5px;""", """.scope__version {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;"""))

pairs.append((""".dod__item svg {
  width: 14px;
  height: 14px;
  flex: none;
  margin-top: 3px;
  color: var(--border-strong);
}""", """.dod__item svg {
  width: 14px;
  height: 14px;
  flex: none;
  margin-top: 3px;
  color: #adadad;
}"""))

pairs.append((""".close p {
  margin-top: 18px;
  color: rgb(255 255 255 / 0.78);""", """.close p {
  margin-top: 18px;
  color: rgb(255 255 255 / 0.92);"""))

pairs.append((""".close__meta .mono {
  color: rgb(255 255 255 / 0.62);
  font-size: 9.5px;
  text-transform: none;
  letter-spacing: 0.03em;
}""", """.close__meta .mono {
  color: rgb(255 255 255 / 0.85);
  font-size: 10.5px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.03em;
}"""))

pairs.append((""".manual li .time {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--graphite);
  white-space: nowrap;
  text-transform: none;
}""", """.manual li .time {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  color: #666666;
  white-space: nowrap;
  text-transform: none;
}"""))

pairs.append((""".weight__value {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--graphite);
  text-align: right;
}""", """.weight__value {
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 600;
  color: #555555;
  text-align: right;
}"""))

pairs.append((""".formula__expr {
  margin-top: 22px;
  font-family: var(--font-mono);
  font-size: 12.5px;""", """.formula__expr {
  margin-top: 22px;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;"""))

pairs.append((""".formula p {
  margin-top: 18px;
  font-size: 13px;""", """.formula p {
  margin-top: 18px;
  font-size: 13.5px;"""))

for i, (old, new) in enumerate(pairs):
    if old not in s:
        print(f'MISS {i}: {old[:60]!r}')
        continue
    s = s.replace(old, new, 1)

open(p, 'w').write(s)
print('done')

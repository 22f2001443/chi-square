// Chi-square density curves for k = 1…6 degrees of freedom, the curves on the
// Chi-Square badge. Points were computed from the density f(x; k) for x in
// [0, 12], clipped at 0.5, and scaled into a 580×300 box.
const CURVES = [
  { k: 1, color: "#F2C230", d: "M42 20 L55 20 L67 90 L80 139 L92 169 L105 189 L117 204 L130 215 L142 224 L154 231 L167 236 L179 240 L192 244 L204 247 L217 249 L229 251 L241 252 L254 254 L266 255 L279 255 L291 256 L304 257 L316 257 L329 258 L341 258 L353 258 L366 259 L378 259 L391 259 L403 259 L416 259 L428 259 L440 259 L453 260 L465 260 L478 260 L490 260 L503 260 L515 260 L528 260 L540 260" },
  { k: 2, color: "#3DCB6B", d: "M40 20 L52 53 L65 82 L78 107 L90 128 L102 147 L115 162 L128 176 L140 188 L152 198 L165 206 L177 214 L190 220 L202 226 L215 231 L228 235 L240 238 L252 241 L265 244 L278 246 L290 248 L302 250 L315 251 L328 252 L340 253 L352 254 L365 255 L377 256 L390 256 L402 257 L415 257 L428 258 L440 258 L453 258 L465 259 L478 259 L490 259 L502 259 L515 259 L528 259 L540 259" },
  { k: 3, color: "#3CC4E0", d: "M40 260 L52 170 L65 150 L78 144 L90 145 L102 149 L115 156 L128 163 L140 171 L152 178 L165 186 L177 193 L190 200 L202 206 L215 212 L228 217 L240 222 L252 226 L265 230 L278 234 L290 237 L302 239 L315 242 L328 244 L340 246 L352 248 L365 249 L377 251 L390 252 L402 253 L415 254 L428 254 L440 255 L453 256 L465 256 L478 257 L490 257 L502 258 L515 258 L528 258 L540 258" },
  { k: 4, color: "#6E86FF", d: "M40 260 L52 229 L65 207 L78 191 L90 181 L102 175 L115 172 L128 172 L140 173 L152 176 L165 180 L177 184 L190 189 L202 193 L215 198 L228 203 L240 208 L252 212 L265 216 L278 220 L290 224 L302 228 L315 231 L328 234 L340 236 L352 239 L365 241 L377 243 L390 245 L402 247 L415 248 L428 249 L440 251 L453 252 L465 253 L478 253 L490 254 L502 255 L515 255 L528 256 L540 256" },
  { k: 5, color: "#B07CF0", d: "M40 260 L52 251 L65 238 L78 225 L90 214 L102 205 L115 197 L128 192 L140 189 L152 187 L165 186 L177 187 L190 188 L202 190 L215 193 L228 196 L240 199 L252 203 L265 206 L278 210 L290 213 L302 217 L315 220 L328 223 L340 226 L352 229 L365 232 L377 234 L390 237 L402 239 L415 241 L428 243 L440 244 L453 246 L465 247 L478 249 L490 250 L502 251 L515 252 L528 253 L540 253" },
  { k: 6, color: "#F26B55", d: "M40 260 L52 258 L65 252 L78 245 L90 236 L102 228 L115 220 L128 214 L140 208 L152 203 L165 200 L177 197 L190 196 L202 195 L215 195 L228 196 L240 197 L252 199 L265 201 L278 204 L290 206 L302 209 L315 212 L328 215 L340 218 L352 220 L365 223 L377 226 L390 228 L402 231 L415 233 L428 235 L440 237 L453 239 L465 241 L478 243 L490 244 L502 246 L515 247 L528 248 L540 249" },
];

const TICKS = [
  { x: 40, label: "0" },
  { x: 207, label: "4" },
  { x: 373, label: "8" },
  { x: 540, label: "12" },
];

export default function ChiCurves({ className = "" }) {
  return (
    <figure className={`flex min-w-0 flex-col gap-4 ${className}`}>
      <svg
        viewBox="0 0 580 300"
        role="img"
        aria-label="Chi-square probability density curves for 1 to 6 degrees of freedom, the curves on the Chi-Square badge"
        className="block h-auto w-full"
      >
        <path d="M40 20 L40 260 L552 260" fill="none" stroke="#3A3F4A" strokeWidth="1.5" />
        {TICKS.map((t) => (
          <g key={t.label}>
            <path d={`M${t.x} 260 L${t.x} 266`} stroke="#3A3F4A" strokeWidth="1.5" />
            <text x={t.x} y="288" fill="#8D93A1" fontFamily="IBM Plex Mono, monospace" fontSize="12" textAnchor="middle">
              {t.label}
            </text>
          </g>
        ))}
        {CURVES.map((c) => (
          <path
            key={c.k}
            d={c.d}
            fill="none"
            stroke={c.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <figcaption className="flex flex-wrap items-center gap-x-[18px] gap-y-2 font-mono text-xs text-on-ink-muted">
        <span>χ²(k) density, k =</span>
        {CURVES.map((c) => (
          <span key={c.k} className="inline-flex items-center gap-1.5">
            <span className="h-[3px] w-4 rounded-sm" style={{ background: c.color }} />
            {c.k}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

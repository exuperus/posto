// src/lib/serialize.ts
export function toPlain<T extends Record<string, any>>(row: T): any {
    const out: any = {};
    for (const [k, v] of Object.entries(row)) {
        if (v == null) out[k] = v;
        else if (typeof v === "bigint") out[k] = v.toString();
        else if (typeof v === "object") {
            // Prisma Decimal
            if (typeof (v as any).toNumber === "function") {
                const n = (v as any).toNumber();
                out[k] = Number.isFinite(n) ? n : null;
            }
            // Date
            else if (v instanceof Date) {
                out[k] = v.toISOString();
            }
            // Arrays/objetos aninhados
            else if (Array.isArray(v)) {
                out[k] = v.map((el) => (typeof el === "object" ? toPlain(el as any) : el));
            } else {
                out[k] = toPlain(v as any);
            }
        } else {
            out[k] = v;
        }
    }
    return out;
}

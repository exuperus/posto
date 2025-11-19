// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("[AdminLogin] Requisição POST recebida.");

    let body: { key?: string } = {};
    try {
        body = await req.json();
        console.log("[AdminLogin] JSON recebido:", body);
    } catch (err) {
        console.error("[AdminLogin] Erro ao fazer parse do JSON:", err);
        return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
    }

    const key = body?.key ?? "";
    const envKey = process.env.ADMIN_KEY;

    console.log("[AdminLogin] Chave recebida:", key ? "(fornecida)" : "Vazia");
    console.log(
        "AdminLogin] ADMIN_KEY definida no ambiente:",
        envKey ? "Sim" : "Não"
    );

    if (!key || key !== envKey) {
        console.warn("[AdminLogin] Chave inválida recebida. Acesso negado.");
        return NextResponse.json(
            { ok: false, error: "Chave inválida" },
            { status: 401 }
        );
    }

    console.log("[AdminLogin] Chave válida. A gerar cookie...");

    const res = NextResponse.json({ ok: true });
    const cookieOptions = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production", // HTTPS em produção
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: "/",
    };

    res.cookies.set("ak", key, cookieOptions);
    console.log("[AdminLogin] Cookie 'ak' definido:", cookieOptions);

    console.log("[AdminLogin] Resposta enviada com sucesso.\n");
    return res;
}

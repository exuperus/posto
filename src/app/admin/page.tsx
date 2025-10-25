// src/app/admin/page.tsx
import { redirect } from "next/navigation";

export default function AdminIndex() {
    console.log("[AdminIndex] Página /admin acedida → a redirecionar para /admin/login...");

    try {
        redirect("/admin/login");
    } catch (err) {
        console.error("[AdminIndex] Falha ao redirecionar:", err);
        // Em caso extremo (p.ex. erro no ambiente serverless), devolve fallback
        return (
            <div className="p-8 text-red-600 font-medium">
                Erro ao redirecionar. <a href="/admin/login">Clique aqui</a> para aceder.
            </div>
        );
    }

    console.log("[AdminIndex] Redirecionamento concluído.\n");
    return null;
}

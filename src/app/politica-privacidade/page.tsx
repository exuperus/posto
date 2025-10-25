// src/app/politica-privacidade/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidade — Sandrina & Mário, LDA",
    description:
        "Informação sobre tratamento de dados pessoais, cookies e direitos dos titulares (RGPD).",
};

// 🔍 DEBUG a nível de módulo (executa no load)
console.log("[/politica-privacidade] Módulo carregado.");
console.log("   - NODE_ENV:", process.env.NODE_ENV);
console.log("   - VERCEL:", !!process.env.VERCEL);
console.log("   - metadata.title:", metadata.title);
console.log("   - metadata.description:", metadata.description);

const COMPANY_NAME = "Sandrina & Mário, LDA";
const COMPANY_EMAIL = "geralsandrinaemario@hotmail.com";
const COMPANY_ADDR = "Estrada Nacional 221, 5225-131 Sendim";

console.log("[/politica-privacidade] Constantes:");
console.log("   - COMPANY_NAME:", COMPANY_NAME);
console.log("   - COMPANY_EMAIL:", COMPANY_EMAIL);
console.log("   - COMPANY_ADDR:", COMPANY_ADDR);

export default function PoliticaPrivacidadePage() {
    console.log("[/politica-privacidade] Render iniciado.");
    const today = new Date().toLocaleDateString("pt-PT");
    console.log("[/politica-privacidade] Data de atualização (render):", today);

    const mailHref = `mailto:${COMPANY_EMAIL}`;
    console.log("[/politica-privacidade] mailHref:", mailHref);

    return (
        <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
            <header className="space-y-2 text-center">
                <p className="text-sm font-medium text-gray-500">Informação legal</p>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Política de Privacidade
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Esta política explica como tratamos os seus dados pessoais, em
                    conformidade com o Regulamento (UE) 2016/679 (RGPD) e legislação
                    nacional aplicável.
                </p>
            </header>

            {/* 1. Responsável */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">1. Responsável pelo tratamento</h2>
                <p className="text-gray-700">
                    O responsável pelo tratamento é <strong>{COMPANY_NAME}</strong>, com
                    sede em {COMPANY_ADDR}. Para qualquer questão relacionada com
                    privacidade, contacte-nos em{" "}
                    <a
                        href={mailHref}
                        className="text-emerald-700 font-medium hover:underline"
                        onClick={() =>
                            console.log("[/politica-privacidade] click mailto:", mailHref)
                        }
                    >
                        {COMPANY_EMAIL}
                    </a>
                    .
                </p>
            </section>

            {/* 2. Dados recolhidos */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">2. Dados pessoais que podemos recolher</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>
                        <strong>Contactos:</strong> nome, telefone e e-mail quando nos liga
                        ou envia mensagens.
                    </li>
                    <li>
                        <strong>Dados transacionais mínimos:</strong> notas internas de
                        atendimento (ex.: pedido de transporte ao domicílio, data e hora).
                    </li>
                    <li>
                        <strong>Dados técnicos básicos do website:</strong> logs de servidor
                        (IP, user-agent) para segurança e diagnóstico.
                    </li>
                    <li>
                        <strong>Cookies essenciais:</strong> os estritamente necessários ao
                        funcionamento do site.
                    </li>
                </ul>
                <p className="text-sm text-gray-500">
                    Não recolhemos categorias especiais de dados nem fazemos perfis
                    automáticos (“profiling”) com efeitos jurídicos.
                </p>
            </section>

            {/* 3. Finalidades e bases legais */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">3. Finalidades e bases legais</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>
                        <strong>Atendimento e resposta a pedidos</strong> (telefone/e-mail) —{" "}
                        <em>interesse legítimo</em> e/ou <em>diligências pré-contratuais</em>.
                    </li>
                    <li>
                        <strong>Cumprimento de obrigações legais</strong> (ex.: faturação,
                        respostas a autoridades) — <em>obrigação legal</em>.
                    </li>
                    <li>
                        <strong>Segurança e melhoria do website</strong> (logs, prevenção de
                        abuso) — <em>interesse legítimo</em>.
                    </li>
                </ul>
            </section>

            {/* 4. Prazos de conservação */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">4. Prazos de conservação</h2>
                <p className="text-gray-700">
                    Conservamos os dados apenas pelo período necessário às finalidades
                    indicadas ou pelo prazo legal aplicável (ex.: documentação fiscal).
                    Após esse prazo, os dados são eliminados ou anonimizados de forma
                    segura.
                </p>
            </section>

            {/* 5. Partilha de dados */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">5. Partilha de dados</h2>
                <p className="text-gray-700">
                    Podemos partilhar dados com prestadores de serviços que atuam em nosso
                    nome (ex.: alojamento do website), vinculados por contrato e
                    obrigações de confidencialidade. Apenas transferimos dados fora do EEE
                    quando existam garantias adequadas (ex.: cláusulas-tipo da UE).
                </p>
            </section>

            {/* 6. Direitos dos titulares */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">6. Direitos dos titulares</h2>
                <p className="text-gray-700">
                    Tem direito de <strong>acesso</strong>, <strong>retificação</strong>,{" "}
                    <strong>apagamento</strong>, <strong>limitação</strong>,{" "}
                    <strong>oposição</strong> e <strong>portabilidade</strong> dos seus
                    dados. Para exercer, contacte{" "}
                    <a
                        href={mailHref}
                        className="text-emerald-700 font-medium hover:underline"
                        onClick={() =>
                            console.log("[/politica-privacidade] click mailto:", mailHref)
                        }
                    >
                        {COMPANY_EMAIL}
                    </a>
                    .
                </p>
                <p className="text-gray-700">
                    Pode igualmente apresentar reclamação à{" "}
                    <a
                        href="https://www.cnpd.pt/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-medium hover:underline"
                        onClick={() =>
                            console.log("[/politica-privacidade] click CNPD:", "https://www.cnpd.pt/")
                        }
                    >
                        CNPD — Comissão Nacional de Proteção de Dados
                    </a>
                    .
                </p>
            </section>

            {/* 7. Cookies */}
            <section id="cookies" className="space-y-3">
                <h2 className="text-xl font-semibold">7. Cookies</h2>
                <p className="text-gray-700">
                    Este website utiliza apenas <strong>cookies estritamente necessários</strong>{" "}
                    ao seu funcionamento (ex.: equilíbrio de carga, preferências essenciais).
                    Não usamos cookies de marketing nem de análise. Caso venhamos a utilizar
                    cookies opcionais, pediremos o seu consentimento prévio e disponibilizaremos
                    um gestor de preferências.
                </p>
            </section>

            {/* 8. Segurança */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">8. Segurança</h2>
                <p className="text-gray-700">
                    Implementamos medidas técnicas e organizativas adequadas para proteger os
                    dados pessoais contra acessos não autorizados, perda ou alteração.
                    Nenhuma transmissão por Internet é totalmente segura; recomendamos que
                    mantenha os seus dispositivos atualizados e nos contacte se detetar
                    alguma anomalia.
                </p>
            </section>

            {/* 9. Alterações */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">9. Alterações a esta política</h2>
                <p className="text-gray-700">
                    Poderemos atualizar esta política para refletir alterações legais ou
                    operacionais. A versão atualizada será publicada nesta página, com a
                    respetiva data de revisão.
                </p>
            </section>

            {/* 10. Contactos */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">10. Contactos</h2>
                <p className="text-gray-700">
                    Para qualquer questão sobre privacidade ou para exercer direitos, contacte:
                </p>
                <ul className="list-none pl-0 text-gray-700">
                    <li>
                        <strong>{COMPANY_NAME}</strong>
                    </li>
                    <li>{COMPANY_ADDR}</li>
                    <li>
                        E-mail:{" "}
                        <a
                            href={mailHref}
                            className="text-emerald-700 font-medium hover:underline"
                            onClick={() =>
                                console.log("[/politica-privacidade] click mailto:", mailHref)
                            }
                        >
                            {COMPANY_EMAIL}
                        </a>
                    </li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">Última atualização: {today}</p>
            </section>
        </main>
    );
}

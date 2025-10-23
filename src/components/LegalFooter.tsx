// src/components/LegalFooter.tsx
import Link from "next/link";

const COMPANY_NAME = "Sandrina & Mário, LDA";
const COMPANY_NIF = "513999221";
const COMPANY_ADDR = "Estrada Nacional 221, 5225-131 Sendim.";

export default function LegalFooter() {
    return (
        <footer className="mt-16 border-t border-gray-200 py-6 text-center text-sm text-gray-600 space-y-2">
            {/* Nome e NIF */}
            <div>
                <div className="font-semibold text-gray-900 text-base">{COMPANY_NAME}</div>
                <div className="text-gray-700 text-sm">
                    <span className="font-semibold">NIF</span> — {COMPANY_NIF}
                </div>
            </div>

            {/* Morada centralizada (sem email) */}
            <p className="text-gray-700 text-sm text-center">{COMPANY_ADDR}</p>

            {/* Ligações legais na mesma linha */}
            <p className="flex flex-wrap justify-center gap-2 text-emerald-700 font-medium">
                <a
                    href="https://www.livroreclamacoes.pt/inicio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    Livro de Reclamações Eletrónico
                </a>
                <span className="text-gray-400">|</span>
                <a
                    href="https://www.cniacc.pt/pt/rede-centros-de-arbitragem"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    DGPJ
                </a>
                <span className="text-gray-400">|</span>
                <Link href="/politica-privacidade" className="hover:underline">
                    Política de Privacidade
                </Link>
            </p>

            {/* Direitos reservados */}
            <p className="text-xs text-gray-400 mt-2">
                © {new Date().getFullYear()} {COMPANY_NAME}. Todos os direitos reservados.
            </p>
        </footer>
    );
}

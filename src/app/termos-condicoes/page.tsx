// src/app/termos-condicoes/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termos & Condições — Sandrina & Mário, LDA",
    description:
        "Informações legais, termos de utilização, variação de preços e condições de acesso ao website.",
};

const COMPANY_NAME = "Sandrina & Mário, LDA";
const COMPANY_ADDR = "Estrada Nacional 221, 5225-131 Sendim";
const COMPANY_EMAIL = "geralsandrinaemario@hotmail.com";
const COMPANY_PHONE = "273 739 700";

export default function TermosCondicoesPage() {
    return (
        <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
            <header className="text-center space-y-2">
                <p className="text-sm font-medium text-gray-500">Informação legal</p>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Termos & Condições de Utilização
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Estes Termos regulam o acesso e utilização do website da{" "}
                    <strong>{COMPANY_NAME}</strong>, bem como as informações e conteúdos
                    nele disponibilizados.
                </p>
            </header>

            {/* 1. Identificação */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">1. Identificação do prestador</h2>
                <ul className="list-none pl-0 text-gray-700">
                    <li>
                        <strong>{COMPANY_NAME}</strong>
                    </li>
                    <li>{COMPANY_ADDR}</li>
                    <li>Telefone: {COMPANY_PHONE}</li>
                    <li>
                        E-mail:{" "}
                        <a
                            href={`mailto:${COMPANY_EMAIL}`}
                            className="text-emerald-700 font-medium hover:underline"
                        >
                            {COMPANY_EMAIL}
                        </a>
                    </li>
                </ul>
            </section>

            {/* 2. Objeto */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">2. Objeto e âmbito</h2>
                <p className="text-gray-700">
                    O website tem carácter informativo e destina-se a divulgar os serviços
                    e produtos comercializados pela <strong>{COMPANY_NAME}</strong>,
                    incluindo preços indicativos de combustíveis e serviços de apoio ao
                    cliente.
                </p>
                <p className="text-gray-700">
                    A utilização deste website implica a aceitação integral dos presentes
                    Termos & Condições.
                </p>
            </section>

            {/* 3. Informação e preços */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    3. Informação, preços e promoções
                </h2>
                <p className="text-gray-700">
                    Os preços de combustíveis apresentados no website são meramente
                    informativos e refletem os valores praticados no posto{" "}
                    <strong>{COMPANY_NAME}</strong> na data da última atualização.
                    Reservamo-nos o direito de alterar os preços a qualquer momento sem
                    aviso prévio.
                </p>
                <p className="text-gray-700">
                    Todas as <strong>sextas-feiras</strong>, aplica-se uma{" "}
                    <strong>redução promocional de 0,06 €/L</strong> em todos os
                    combustíveis, exceto <em>Gasóleo Agrícola</em>, válida apenas para
                    pagamentos presenciais no posto.
                </p>
                <p className="text-sm text-gray-500">
                    A promoção poderá ser suspensa ou alterada sem aviso prévio por motivos
                    operacionais, de mercado ou força maior.
                </p>
            </section>

            {/* 4. Direitos de propriedade */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">4. Direitos de propriedade intelectual</h2>
                <p className="text-gray-700">
                    Todos os conteúdos deste website (textos, logótipos, imagens e código)
                    são propriedade exclusiva da <strong>{COMPANY_NAME}</strong> ou
                    utilizados com autorização dos respetivos titulares, encontrando-se
                    protegidos por legislação nacional e internacional de direitos de
                    autor e propriedade industrial.
                </p>
                <p className="text-gray-700">
                    É proibida a reprodução, modificação ou distribuição, total ou
                    parcial, de qualquer conteúdo sem consentimento prévio escrito.
                </p>
            </section>

            {/* 5. Responsabilidade */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">5. Responsabilidade</h2>
                <p className="text-gray-700">
                    A <strong>{COMPANY_NAME}</strong> procura assegurar que toda a
                    informação publicada é correta e atualizada, mas não garante ausência
                    de erros tipográficos ou técnicos. Não se responsabiliza por perdas ou
                    danos decorrentes do uso do website ou da interpretação dos seus
                    conteúdos.
                </p>
            </section>

            {/* 6. Ligações externas */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">6. Ligações a sites de terceiros</h2>
                <p className="text-gray-700">
                    O website pode conter ligações para páginas externas geridas por
                    terceiros. A <strong>{COMPANY_NAME}</strong> não controla nem assume
                    responsabilidade pelos conteúdos ou políticas de privacidade desses
                    websites.
                </p>
            </section>

            {/* 7. Utilização aceitável */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">7. Utilização aceitável</h2>
                <p className="text-gray-700">
                    O utilizador compromete-se a não utilizar este website para fins
                    ilegais, ofensivos ou que possam danificar a imagem da{" "}
                    <strong>{COMPANY_NAME}</strong> ou interferir com o seu normal
                    funcionamento (ex.: envio automatizado de mensagens ou tentativas de
                    acesso não autorizado).
                </p>
            </section>

            {/* 8. Alterações */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">8. Alterações aos Termos</h2>
                <p className="text-gray-700">
                    A <strong>{COMPANY_NAME}</strong> reserva-se o direito de modificar ou
                    atualizar os presentes Termos & Condições a qualquer momento. As
                    alterações produzem efeitos a partir da sua publicação online.
                </p>
            </section>

            {/* 9. Lei aplicável */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">9. Lei aplicável e foro</h2>
                <p className="text-gray-700">
                    Estes Termos regem-se pela legislação portuguesa. Em caso de litígio,
                    é competente o foro da comarca de <strong>Porto</strong>, com
                    exclusão de qualquer outro.
                </p>
            </section>

            <footer className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    Última atualização: {new Date().toLocaleDateString("pt-PT")}
                </p>
            </footer>
        </main>
    );
}

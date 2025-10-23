import Image from "next/image";

const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "938452320";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "geralsandrinaemario@hotmail.com";

export const revalidate = 900;

export default function ContactosPage() {
    return (
        <div className="relative">
            {/* HERO */}
            <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden rounded-b-3xl">
                <Image
                    src="/contactos-hero.jpg"
                    alt="Contacte-nos"
                    fill
                    priority
                    className="object-cover"
                />
            </section>

            {/* TEXTO ABAIXO DA FOTO */}
            <section className="max-w-6xl mx-auto px-6 mt-10 text-center">
                <p className="text-sm font-medium text-gray-500">Contactos</p>
                <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">
                    Como o podemos ajudar?
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Partilhamos todos os contactos de que necessita.
                </p>
            </section>

            {/* INFO */}
            <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
                <div className="grid gap-6 sm:grid-cols-2">
                    {/* Telefone */}
                    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
                        <h3 className="text-lg font-semibold text-ink">Linha de atendimento</h3>
                        <p className="mt-1 text-sm text-gray-500">Dias úteis, 08h–22h</p>

                        <a
                            href={`tel:${PHONE.replace(/\s+/g, "")}`}
                            className="mt-4 inline-flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 6.75c0 7.004 5.996 13 13 13h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.23a1.5 1.5 0 0 0-1.03-1.423l-3.12-1.04a1.5 1.5 0 0 0-1.78.63l-.6.96a10.5 10.5 0 0 1-5.62-5.62l.96-.6a1.5 1.5 0 0 0 .63-1.78l-1.04-3.12A1.5 1.5 0 0 0 6.72 3H5.25A2.25 2.25 0 0 0 3 5.25v1.5z"/>
                            </svg>
                            {PHONE}
                        </a>

                        {/* 🔹 Frase legal obrigatória */}
                        <p className="mt-2 text-xs text-gray-500">
                            Chamada para a rede móvel nacional.
                        </p>
                    </article>

                    {/* Email */}
                    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
                        <h3 className="text-lg font-semibold text-ink">E-mail</h3>
                        <p className="mt-1 text-sm text-gray-500">Responderemos com a maior brevidade.</p>
                        <a
                            href={`mailto:${EMAIL}`}
                            className="mt-4 inline-flex items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 font-semibold text-cyan-700 hover:bg-cyan-100 transition-colors break-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M1.5 6.75A2.25 2.25 0 0 1 3.75 4.5h16.5A2.25 2.25 0 0 1 22.5 6.75v10.5A2.25 2.25 0 0 1 20.25 19.5H3.75A2.25 2.25 0 0 1 1.5 17.25V6.75zm3.03-.75l7.23 5.42a.75.75 0 0 0 .9 0l7.23-5.42H4.53z"/>
                            </svg>
                            {EMAIL}
                        </a>
                    </article>
                </div>
            </section>
        </div>
    );
}

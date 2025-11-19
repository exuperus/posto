// src/app/admin/page.tsx
import Link from "next/link";
import { DollarSign, Gift } from "lucide-react";

export default function AdminIndex() {
    return (
        <div className="container-pro py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Administração</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    <Link
                        href="/admin/precos"
                        className="rounded-xl border-2 border-gray-200 bg-white p-6 hover:border-green-500 hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Preços</h2>
                                <p className="text-sm text-gray-600">
                                    Gerir preços dos combustíveis
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/vouchers"
                        className="rounded-xl border-2 border-gray-200 bg-white p-6 hover:border-green-500 hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                                <Gift className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Vouchers</h2>
                                <p className="text-sm text-gray-600">
                                    Validar vouchers de promoção
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

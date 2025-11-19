"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Gift, CheckCircle, XCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Função para obter deviceId
function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("voucher_deviceId") || "";
}

type Voucher = {
  id: string;
  codigo: string;
  valorAbastecimento: string | null;
  numeroRecibo: string | null;
  usado: boolean;
  usadoEm: string | null;
  expiraEm: string;
  criadoEm: string;
};

export default function MeusVouchersPage() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVouchers();
  }, []);

  async function loadVouchers() {
    const deviceId = getDeviceId();
    if (!deviceId) {
      setError("Não foi possível identificar o dispositivo");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/vouchers?deviceId=${encodeURIComponent(deviceId)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao carregar vouchers");
        setLoading(false);
        return;
      }

      setVouchers(data.vouchers || []);
      setLoading(false);
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
      console.error("[Meus Vouchers] Erro:", err);
    }
  }

  function getStatus(voucher: Voucher) {
    const agora = new Date();
    const expiraEm = new Date(voucher.expiraEm);

    if (voucher.usado) {
      return {
        tipo: "usado",
        label: "Usado",
        cor: "bg-gray-100 text-gray-700 border-gray-300",
        icon: <CheckCircle className="w-5 h-5" />,
      };
    }

    if (expiraEm < agora) {
      return {
        tipo: "expirado",
        label: "Expirado",
        cor: "bg-red-50 text-red-700 border-red-300",
        icon: <XCircle className="w-5 h-5" />,
      };
    }

    return {
      tipo: "valido",
      label: "Válido",
      cor: "bg-green-50 text-green-700 border-green-300",
      icon: <Clock className="w-5 h-5" />,
    };
  }

  if (loading) {
    return (
      <div className="container-pro py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gray-600">A carregar vouchers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-pro py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-pro py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/promocoes"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Meus Vouchers</h1>
            <p className="text-gray-600">Histórico dos seus vouchers gerados</p>
          </div>
        </div>

        {vouchers.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center space-y-4">
            <Gift className="w-16 h-16 text-gray-400 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-700">
              Ainda não gerou nenhum voucher
            </h2>
            <p className="text-gray-600">
              Abasteça 50€ ou mais e gere o seu primeiro voucher!
            </p>
            <Link
              href="/promocoes"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Gerar Voucher
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {vouchers.map((voucher) => {
              const status = getStatus(voucher);
              return (
                <div
                  key={voucher.id}
                  className={`rounded-xl border-2 ${status.cor} p-6 space-y-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {status.icon}
                      <div>
                        <p className="text-2xl font-mono font-bold">{voucher.codigo}</p>
                        <p className="text-sm opacity-75">{status.label}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status.tipo === "valido"
                          ? "bg-green-200 text-green-800"
                          : status.tipo === "usado"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {status.label.toUpperCase()}
                    </span>
                  </div>

                  {voucher.numeroRecibo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-700 font-medium mb-1">Número da Fatura:</p>
                      <p className="text-lg font-mono font-bold text-blue-900">
                        {voucher.numeroRecibo}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Mostre este número ao admin para validação rápida
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-current border-opacity-20">
                    {voucher.valorAbastecimento && (
                      <div>
                        <p className="opacity-75">Valor abastecido</p>
                        <p className="font-semibold">
                          {Number(voucher.valorAbastecimento).toFixed(2)}€
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="opacity-75">Criado em</p>
                      <p className="font-semibold">
                        {new Date(voucher.criadoEm).toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                    {voucher.usadoEm && (
                      <div>
                        <p className="opacity-75">Usado em</p>
                        <p className="font-semibold">
                          {new Date(voucher.usadoEm).toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="opacity-75">Expira em</p>
                      <p className="font-semibold">
                        {new Date(voucher.expiraEm).toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {status.tipo === "valido" && (
                    <div className="pt-4 border-t border-current border-opacity-20">
                      <p className="text-sm font-medium">
                        Mostre este código no posto para usufruir do serviço gratuito
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/promocoes"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Gerar Novo Voucher
          </Link>
        </div>
      </div>
    </div>
  );
}


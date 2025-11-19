"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Gift, CheckCircle, ArrowRight } from "lucide-react";

// Função para gerar/obter deviceId
function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";
  
  let deviceId = localStorage.getItem("voucher_deviceId");
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("voucher_deviceId", deviceId);
  }
  return deviceId;
}

const PREFIXO_FATURA = "CA23/";

export default function PromocoesPage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState<string>("");
  const [valor, setValor] = useState("");
  const [numeroRecibo, setNumeroRecibo] = useState(PREFIXO_FATURA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voucherGerado, setVoucherGerado] = useState<{
    codigo: string;
    expiraEm: string;
  } | null>(null);

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  async function handleGerarVoucher(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVoucherGerado(null);

    const valorNum = parseFloat(valor.replace(",", "."));
    if (isNaN(valorNum) || valorNum < 50) {
      setError("O valor mínimo é 50€ para gerar um voucher");
      return;
    }

    // Validar número de fatura
    if (!numeroRecibo.trim()) {
      setError("Número de fatura é obrigatório");
      return;
    }

    // Validar formato: CA23/XXXXX
    const faturaRegex = /^CA\d{2}\/\d{5,}$/i;
    if (!faturaRegex.test(numeroRecibo.trim())) {
      setError("Formato de fatura inválido. Use: CA23/12345");
      return;
    }

    setLoading(true);

    try {
      // Gerar voucher
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          valorAbastecimento: valorNum,
          numeroRecibo: numeroRecibo.trim().toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao gerar voucher");
        setLoading(false);
        return;
      }

      setVoucherGerado(data.voucher);
      setValor("");
      setNumeroRecibo(PREFIXO_FATURA);
      setLoading(false);
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
      console.error("[Promoções] Erro:", err);
    }
  }

  if (voucherGerado) {
    return (
      <div className="container-pro py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Voucher Gerado com Sucesso!</h1>
            <p className="text-gray-600">
              Mostre este código no posto para usufruir do seu voucher
            </p>
          </div>

          <div className="rounded-2xl border-4 border-green-500 bg-white p-8 text-center space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Seu código:</p>
              <p className="text-5xl font-mono font-bold text-green-600 tracking-wider">
                {voucherGerado.codigo}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p>
                <strong>Válido até:</strong>{" "}
                {new Date(voucherGerado.expiraEm).toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setVoucherGerado(null);
                  setError(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Gerar Outro
              </button>
              <button
                onClick={() => router.push("/promocoes/meus-vouchers")}
                className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Ver Meus Vouchers
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-pro py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100">
            <Gift className="w-12 h-12 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold">Promoção Especial</h1>
          <p className="text-xl text-gray-600">
            Abasteça 50€ ou mais e ganhe um voucher para{" "}
            <strong>lavagem grátis!</strong>
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-8 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Como funciona:</strong>
            </p>
            <ol className="text-sm text-blue-800 mt-2 ml-4 list-decimal space-y-1">
              <li><strong>Abasteça</strong> 50€ ou mais no posto</li>
              <li><strong>Insira o valor</strong> que acabou de abastecer</li>
              <li><strong>Insira o número da fatura</strong> (formato: CA23/12345)</li>
              <li><strong>Gere o voucher</strong> imediatamente</li>
              <li><strong>Use quando quiser:</strong> mostre o código no posto para lavagem grátis</li>
            </ol>
            <p className="text-xs text-blue-700 mt-3 italic">
              Pode gerar o voucher logo após abastecer e usar na mesma visita ou numa próxima (válido 1 mês)
            </p>
          </div>

          <form onSubmit={handleGerarVoucher} className="space-y-6">
            <div>
              <label
                htmlFor="valor"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Valor Abastecido (€)
              </label>
              <input
                id="valor"
                type="text"
                value={valor}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9,.]/g, "");
                  setValor(v);
                  setError(null);
                }}
                placeholder="50.00"
                inputMode="decimal"
                className="w-full text-2xl text-center rounded-lg border-2 px-4 py-4 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Valor mínimo: 50€
              </p>
            </div>

                        <div>
                          <label
                            htmlFor="numeroRecibo"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Número da Fatura *
                          </label>
                          <input
                            id="numeroRecibo"
                            type="text"
                            value={numeroRecibo}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase();
                              // Garantir que sempre começa com o prefixo
                              if (!value.startsWith(PREFIXO_FATURA)) {
                                // Se o usuário apagar tudo, restaurar o prefixo
                                if (value.length < PREFIXO_FATURA.length) {
                                  setNumeroRecibo(PREFIXO_FATURA);
                                } else {
                                  // Se tentar mudar o prefixo, forçar o prefixo correto
                                  setNumeroRecibo(PREFIXO_FATURA + value.replace(/^CA\d{2}\//i, "").replace(/[^0-9]/g, ""));
                                }
                              } else {
                                // Permitir apenas números após o prefixo
                                const parteNumerica = value.slice(PREFIXO_FATURA.length).replace(/[^0-9]/g, "");
                                setNumeroRecibo(PREFIXO_FATURA + parteNumerica);
                              }
                              setError(null);
                            }}
                            onFocus={(e) => {
                              // Mover cursor para depois do prefixo
                              const prefixLength = PREFIXO_FATURA.length;
                              if (e.target.selectionStart < prefixLength) {
                                setTimeout(() => {
                                  e.target.setSelectionRange(prefixLength, prefixLength);
                                }, 0);
                              }
                            }}
                            placeholder="CA23/12345"
                            className="w-full text-lg text-center rounded-lg border-2 px-4 py-3 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none uppercase font-mono"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Digite apenas os números após CA23/
                          </p>
                        </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !valor.trim()}
              className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "A gerar voucher..." : "Gerar Voucher"}
            </button>
          </form>

          <div className="pt-4 border-t">
            <button
              onClick={() => router.push("/promocoes/meus-vouchers")}
              className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium py-2"
            >
              Ver os meus vouchers →
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-sm text-gray-600 space-y-2">
          <p className="font-medium text-gray-800">Condições:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Valor mínimo de abastecimento: 50€</li>
            <li>Excepto gasóleo agrícola</li>
            <li>Número de fatura obrigatório (formato: CA23/12345)</li>
            <li>Voucher válido por 1 mês (30 dias)</li>
            <li>Voucher válido para 1 lavagem</li>
            <li>Voucher pode ser usado apenas uma vez</li>
            <li>Promoção válida apenas para clientes pessoais</li>
            <li>Promoção válida apenas através do site</li>
            <li>Promoção temporária - válida durante o período da campanha</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


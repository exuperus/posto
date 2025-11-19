"use client";

import { useState } from "react";

type VoucherStatus = "idle" | "loading" | "valid" | "invalid" | "used" | "expired";
type ModoBusca = "codigo" | "fatura";

const PREFIXO_FATURA = "CA23/";

export default function AdminVouchersPage() {
  const [modoBusca, setModoBusca] = useState<ModoBusca>("codigo");
  const [codigo, setCodigo] = useState("");
  const [numeroFatura, setNumeroFatura] = useState(PREFIXO_FATURA);
  const [status, setStatus] = useState<VoucherStatus>("idle");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [voucherInfo, setVoucherInfo] = useState<{
    codigo?: string;
    valorAbastecimento: string | null;
    numeroRecibo: string | null;
    usadoEm: string | null;
    expiraEm: string;
    criadoEm: string;
  } | null>(null);

  async function handleValidar() {
    if (modoBusca === "codigo" && !codigo.trim()) {
      setMensagem("Por favor, insira um código");
      setStatus("invalid");
      return;
    }

    if (modoBusca === "fatura" && !numeroFatura.trim()) {
      setMensagem("Por favor, insira o número da fatura");
      setStatus("invalid");
      return;
    }

    setStatus("loading");
    setMensagem(null);
    setVoucherInfo(null);

    try {
      let res;
      if (modoBusca === "codigo") {
        // Buscar por código
        res = await fetch(`/api/admin/vouchers/${codigo.trim().toUpperCase()}`, {
          cache: 'no-store',
        });
      } else {
        // Buscar por número de fatura
        const numeroFaturaEncoded = encodeURIComponent(numeroFatura.trim().toUpperCase());
        res = await fetch(`/api/admin/vouchers/por-fatura/${numeroFaturaEncoded}`, {
          cache: 'no-store',
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setStatus("invalid");
        setMensagem(data.error || "Erro ao buscar voucher");
        // Limpar após 10 segundos
        setTimeout(() => {
          if (modoBusca === "codigo") setCodigo("");
          else setNumeroFatura(PREFIXO_FATURA);
          setStatus("idle");
          setMensagem(null);
          setVoucherInfo(null);
        }, 10000);
        return;
      }

      const voucher = data.voucher;

      // Se buscar por fatura, validar valor mínimo de 50€
      if (modoBusca === "fatura") {
        const valor = voucher.valorAbastecimento ? Number(voucher.valorAbastecimento) : 0;
        if (valor < 50) {
          setStatus("invalid");
          setMensagem(`❌ Valor abastecido insuficiente: ${valor.toFixed(2)}€. Mínimo necessário: 50€`);
          setVoucherInfo({
            codigo: voucher.codigo,
            valorAbastecimento: voucher.valorAbastecimento,
            numeroRecibo: voucher.numeroRecibo,
            usadoEm: voucher.usadoEm,
            expiraEm: voucher.expiraEm,
            criadoEm: voucher.criadoEm,
          });
          setTimeout(() => {
            setNumeroFatura(PREFIXO_FATURA);
            setStatus("idle");
            setMensagem(null);
            setVoucherInfo(null);
          }, 10000);
          return;
        }
      }

      // Verificar se já foi usado
      if (voucher.usado) {
        setStatus("used");
        setMensagem("❌ Este voucher já foi utilizado");
        setVoucherInfo({
          codigo: voucher.codigo,
          valorAbastecimento: voucher.valorAbastecimento,
          numeroRecibo: voucher.numeroRecibo,
          usadoEm: voucher.usadoEm,
          expiraEm: voucher.expiraEm,
          criadoEm: voucher.criadoEm,
        });
        // Limpar após 10 segundos
        setTimeout(() => {
          if (modoBusca === "codigo") setCodigo("");
          else setNumeroFatura(PREFIXO_FATURA);
          setStatus("idle");
          setMensagem(null);
          setVoucherInfo(null);
        }, 10000);
        return;
      }

      // Verificar se expirou
      if (voucher.expirado) {
        setStatus("expired");
        setMensagem("❌ Este voucher expirou");
        setVoucherInfo({
          codigo: voucher.codigo,
          valorAbastecimento: voucher.valorAbastecimento,
          numeroRecibo: voucher.numeroRecibo,
          usadoEm: voucher.usadoEm,
          expiraEm: voucher.expiraEm,
          criadoEm: voucher.criadoEm,
        });
        // Limpar após 10 segundos
        setTimeout(() => {
          if (modoBusca === "codigo") setCodigo("");
          else setNumeroFatura(PREFIXO_FATURA);
          setStatus("idle");
          setMensagem(null);
          setVoucherInfo(null);
        }, 10000);
        return;
      }

      // Se está válido, marcar como usado (sem cache)
      const resPost = await fetch(`/api/admin/vouchers/${voucher.codigo}`, {
        method: "POST",
        cache: 'no-store',
      });

      const dataPost = await resPost.json();

      if (!resPost.ok) {
        setStatus("invalid");
        setMensagem(dataPost.error || "Erro ao validar voucher");
        // Limpar após 10 segundos
        setTimeout(() => {
          if (modoBusca === "codigo") setCodigo("");
          else setNumeroFatura(PREFIXO_FATURA);
          setStatus("idle");
          setMensagem(null);
          setVoucherInfo(null);
        }, 10000);
        return;
      }

      // Sucesso!
      setStatus("valid");
      setMensagem("✅ Voucher válido! Cliente pode usar o serviço.");
      setVoucherInfo({
        codigo: voucher.codigo,
        valorAbastecimento: voucher.valorAbastecimento,
        numeroRecibo: voucher.numeroRecibo,
        usadoEm: dataPost.voucher.usadoEm,
        expiraEm: voucher.expiraEm,
        criadoEm: voucher.criadoEm,
      });

      // Limpar campo após 10 segundos
      setTimeout(() => {
        if (modoBusca === "codigo") setCodigo("");
        else setNumeroFatura(PREFIXO_FATURA);
        setStatus("idle");
        setMensagem(null);
        setVoucherInfo(null);
      }, 10000);
    } catch (error) {
      setStatus("invalid");
      setMensagem("Erro de conexão. Tente novamente.");
      console.error("[Admin Vouchers] Erro:", error);
      // Limpar após 10 segundos
      setTimeout(() => {
        if (modoBusca === "codigo") setCodigo("");
        else setNumeroFatura("");
        setStatus("idle");
        setMensagem(null);
        setVoucherInfo(null);
      }, 10000);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleValidar();
    }
  }

  function limparCampos() {
    setCodigo("");
    setNumeroFatura(PREFIXO_FATURA);
    setStatus("idle");
    setMensagem(null);
    setVoucherInfo(null);
  }

  function handleFaturaChange(value: string) {
    // Garantir que sempre começa com o prefixo
    if (!value.startsWith(PREFIXO_FATURA)) {
      // Se o usuário apagar tudo, restaurar o prefixo
      if (value.length < PREFIXO_FATURA.length) {
        setNumeroFatura(PREFIXO_FATURA);
      } else {
        // Se tentar mudar o prefixo, forçar o prefixo correto
        setNumeroFatura(PREFIXO_FATURA + value.replace(/^CA\d{2}\//i, "").replace(/[^0-9]/g, ""));
      }
    } else {
      // Permitir apenas números após o prefixo
      const parteNumerica = value.slice(PREFIXO_FATURA.length).replace(/[^0-9]/g, "");
      setNumeroFatura(PREFIXO_FATURA + parteNumerica);
    }
    setStatus("idle");
    setMensagem(null);
    setVoucherInfo(null);
  }

  const getStatusColor = () => {
    switch (status) {
      case "valid":
        return "bg-green-50 border-green-500 text-green-800";
      case "invalid":
      case "used":
      case "expired":
        return "bg-red-50 border-red-500 text-red-800";
      case "loading":
        return "bg-blue-50 border-blue-500 text-blue-800";
      default:
        return "bg-white border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Validar Voucher</h1>

      <div className="rounded-2xl border bg-white p-8 max-w-2xl">
        <div className="space-y-6">
          {/* Tabs para escolher modo de busca */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => {
                setModoBusca("codigo");
                limparCampos();
              }}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                modoBusca === "codigo"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Por Código
            </button>
            <button
              type="button"
              onClick={() => {
                setModoBusca("fatura");
                limparCampos();
              }}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                modoBusca === "fatura"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Por Número de Fatura
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {modoBusca === "codigo" ? "Código do Voucher" : "Número da Fatura"}
            </label>
            {modoBusca === "codigo" ? (
              <input
                type="text"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value.toUpperCase());
                  setStatus("idle");
                  setMensagem(null);
                  setVoucherInfo(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder="LAV1"
                className="w-full text-2xl font-mono text-center rounded-lg border-2 px-4 py-4 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none uppercase"
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={numeroFatura}
                onChange={(e) => handleFaturaChange(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
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
                className="w-full text-2xl font-mono text-center rounded-lg border-2 px-4 py-4 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none uppercase"
                autoFocus
              />
            )}
            {modoBusca === "fatura" && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                O sistema encontra automaticamente o voucher e mostra o valor abastecido
              </p>
            )}
          </div>

          <button
            onClick={handleValidar}
            disabled={
              status === "loading" ||
              (modoBusca === "codigo" ? !codigo.trim() : !numeroFatura.trim())
            }
            className="w-full bg-black text-white text-lg font-semibold py-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "loading" ? "A validar..." : "VALIDAR"}
          </button>

          {mensagem && (
            <div
              className={`rounded-lg border-2 p-4 text-center font-medium ${getStatusColor()}`}
            >
              <p className="text-lg">{mensagem}</p>
            </div>
          )}

          {voucherInfo && (
            <div className="mt-4 pt-4 border-t text-sm text-gray-600 space-y-3">
              {voucherInfo.valorAbastecimento && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="font-medium text-green-800 mb-1">Valor abastecido:</p>
                  <p className="text-2xl font-bold text-green-900">
                    {Number(voucherInfo.valorAbastecimento).toFixed(2)}€
                  </p>
                </div>
              )}

              {/* Prova de abastecimento */}
              {voucherInfo.numeroRecibo && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <p className="font-medium text-gray-800">Número da Fatura:</p>
                  <p className="text-lg font-mono font-semibold">
                    {voucherInfo.numeroRecibo}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <p>
                  <span className="font-medium">Criado em:</span>{" "}
                  {new Date(voucherInfo.criadoEm).toLocaleString("pt-PT")}
                </p>
                {voucherInfo.usadoEm && (
                  <p>
                    <span className="font-medium">Usado em:</span>{" "}
                    {new Date(voucherInfo.usadoEm).toLocaleString("pt-PT")}
                  </p>
                )}
                <p>
                  <span className="font-medium">Expira em:</span>{" "}
                  {new Date(voucherInfo.expiraEm).toLocaleString("pt-PT")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 max-w-2xl">
        <p>
          💡 <strong>Instruções:</strong>
        </p>
        <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
          <li>
            <strong>Por Código:</strong> O cliente mostra o código do voucher no telemóvel (ex: LAV1).
            Digite o código e clique em "VALIDAR".
          </li>
          <li>
            <strong>Por Número de Fatura:</strong> Insira o número da fatura que o cliente forneceu
            (ex: CA23/12345). O sistema encontra automaticamente o voucher associado, mostra o valor
            abastecido e permite validar.
          </li>
        </ul>
        <p className="mt-2">
          O sistema verifica automaticamente se o voucher é válido e marca como usado.
        </p>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { Calculator, Fuel, Euro, MapPin, Zap } from "lucide-react";

interface FuelPrice {
    tipo: string;
    preco: number;
}

export default function FuelCalculator() {
    const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([]);
    const [selectedFuel, setSelectedFuel] = useState<string>("");
    const [distance, setDistance] = useState<string>("");
    const [consumption, setConsumption] = useState<string>("");
    const [budget, setBudget] = useState<string>("");
    const [calculationType, setCalculationType] = useState<"distance" | "budget">("distance");
    const [results, setResults] = useState<{
        totalCost?: number;
        totalLiters?: number;
        totalDistance?: number;
    }>({});

    // Buscar preços dos combustíveis
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await fetch("/api/combustiveis");
                if (response.ok) {
                    const data = await response.json();
                    const prices = data.map((fuel: any) => ({
                        tipo: fuel.tipo,
                        preco: fuel.preco_atual
                    }));
                    setFuelPrices(prices);
                    if (prices.length > 0) {
                        setSelectedFuel(prices[0].tipo);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar preços:", error);
            }
        };

        fetchPrices();
    }, []);

    // Calcular resultados
    useEffect(() => {
        if (!selectedFuel || (!distance && !budget)) return;

        const selectedPrice = fuelPrices.find(f => f.tipo === selectedFuel);
        if (!selectedPrice) return;

        const price = selectedPrice.preco;
        const dist = parseFloat(distance) || 0;
        const cons = parseFloat(consumption) || 0;
        const bud = parseFloat(budget) || 0;

        if (calculationType === "distance" && dist > 0 && cons > 0) {
            const litersNeeded = (dist / 100) * cons;
            const totalCost = litersNeeded * price;
            setResults({
                totalCost,
                totalLiters: litersNeeded
            });
        } else if (calculationType === "budget" && bud > 0 && cons > 0) {
            const litersCanBuy = bud / price;
            const totalDistance = (litersCanBuy / cons) * 100;
            setResults({
                totalDistance,
                totalLiters: litersCanBuy
            });
        }
    }, [selectedFuel, distance, consumption, budget, calculationType, fuelPrices]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("pt-PT", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(num);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-50">
                    <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Calculadora de Combustível</h3>
                    <p className="text-sm text-gray-600">Calcule os custos da sua viagem</p>
                </div>
            </div>

            {/* Tipo de cálculo */}
            <div className="mb-6">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    <button
                        onClick={() => setCalculationType("distance")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            calculationType === "distance"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Por Distância
                    </button>
                    <button
                        onClick={() => setCalculationType("budget")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            calculationType === "budget"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <Euro className="h-4 w-4 inline mr-2" />
                        Por Orçamento
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Combustível */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Fuel className="h-4 w-4 inline mr-1" />
                        Tipo de Combustível
                    </label>
                    <select
                        value={selectedFuel}
                        onChange={(e) => setSelectedFuel(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {fuelPrices.map((fuel) => {
                            const formattedTipo = fuel.tipo
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase());
                            return (
                                <option key={fuel.tipo} value={fuel.tipo}>
                                    {formattedTipo} - {formatPrice(fuel.preco)}/L
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Consumo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Zap className="h-4 w-4 inline mr-1" />
                        Consumo (L/100km)
                    </label>
                    <input
                        type="number"
                        value={consumption}
                        onChange={(e) => setConsumption(e.target.value)}
                        placeholder="Ex: 6.5"
                        step="0.1"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Inputs condicionais */}
                {calculationType === "distance" ? (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            Distância (km)
                        </label>
                        <input
                            type="number"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            placeholder="Ex: 150"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                ) : (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Euro className="h-4 w-4 inline mr-1" />
                            Orçamento (€)
                        </label>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="Ex: 50"
                            step="0.01"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* Resultados */}
            {Object.keys(results).length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Resultado:</h4>
                    <div className="space-y-2">
                        {calculationType === "distance" ? (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Litros necessários:</span>
                                    <span className="font-semibold text-blue-900">
                                        {formatNumber(results.totalLiters || 0)} L
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Custo total:</span>
                                    <span className="font-semibold text-blue-900">
                                        {formatPrice(results.totalCost || 0)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Litros que pode comprar:</span>
                                    <span className="font-semibold text-blue-900">
                                        {formatNumber(results.totalLiters || 0)} L
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Distância possível:</span>
                                    <span className="font-semibold text-blue-900">
                                        {formatNumber(results.totalDistance || 0)} km
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Dica */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                     <strong>Dica:</strong> Os valores são aproximados. O consumo real pode variar conforme o estilo de condução e condições da estrada.
                </p>
            </div>
        </div>
    );
}

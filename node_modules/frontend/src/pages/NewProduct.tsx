import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuppliers } from "../hooks/useSuppliers";
import { useCreateProduct } from "../hooks/useProducts";

interface Supplier {
  id: string;
  name: string;
  nif: string;
}

interface FormState {
  internalCode: string;
  description: string;
  quantity: number | string;
  unit: string;
  totalWeight: number | string;
  totalVolume: number | string;
  currentLocation: string;
  supplierId: string;
  status: string;
}

interface FormErrors {
  internalCode?: string;
  description?: string;
  quantity?: string;
  unit?: string;
  supplierId?: string;
  status?: string;
}

const NewProduct: React.FC = () => {
  const navigate = useNavigate();
  const { data: suppliers, isLoading: loadingSuppliers } = useSuppliers();
  const createProductMutation = useCreateProduct();
  
  const [formData, setFormData] = useState<FormState>({
    internalCode: "",
    description: "",
    quantity: "",
    unit: "",
    totalWeight: "",
    totalVolume: "",
    currentLocation: "",
    supplierId: "",
    status: "RECEIVED",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.internalCode.trim()) {
      newErrors.internalCode = "Internal code is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    const quantityNum = Number(formData.quantity);
    if (formData.quantity === "" || isNaN(quantityNum) || quantityNum <= 0) {
      newErrors.quantity = "Quantity must be greater than zero";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (!formData.supplierId) {
      newErrors.supplierId = "Supplier is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    
    if (!validateForm()) return;

    const payload = {
      internalCode: formData.internalCode.trim(),
      description: formData.description.trim(),
      quantity: Number(formData.quantity),
      unit: formData.unit.trim(),
      totalWeight: formData.totalWeight ? Number(formData.totalWeight) : undefined,
      totalVolume: formData.totalVolume ? Number(formData.totalVolume) : undefined,
      currentLocation: formData.currentLocation.trim() || undefined,
      supplierId: formData.supplierId,
      status: formData.status,
    };

    try {
      await createProductMutation.mutateAsync(payload);
      alert(" Produto criado com sucesso!");
      navigate("/produtos");
    } catch (error: any) {
      console.error(" Erro ao criar produto:", error);
      
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          if (Array.isArray(data.message)) {
            setApiError(data.message.join(', '));
          } else if (typeof data.message === 'object') {
            setApiError(JSON.stringify(data.message));
          } else {
            setApiError(data.message || data.error || "Invalid data");
          }
        } else if (status === 404) {
          setApiError("Supplier not found.");
        } else if (status === 409) {
          setApiError("A product with this internal code already exists.");
        } else {
          setApiError(data.message || data.error || `Server error (${status})`);
        }
      } else if (error.request) {
        setApiError("No server response. Check your connection.");
      } else {
        setApiError("Unexpected error: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 shadow-2xl rounded-xl border border-amber-500/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6 rounded-t-xl border-b border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/30 border border-amber-500/30 rounded-lg p-2">
                <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">New Product</h2>
                <p className="text-amber-100/80 mt-1">Fill in the details of the new product</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {apiError && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-900/20 border-l-4 border-red-500/70 rounded-lg">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-red-900/40 to-red-800/30 border border-red-500/30 rounded-lg p-2 mr-3">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-300">Erro</p>
                    <p className="text-sm text-red-200/90 mt-1">{apiError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações Básicas */}
              <div className="border-b border-amber-500/20 pb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-br from-amber-900/30 to-amber-900/20 border border-amber-500/30 rounded-lg p-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="internalCode" className="block text-sm font-medium text-amber-300 mb-2">
                      Código Interno <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="internalCode"
                      name="internalCode"
                      type="text"
                      placeholder="Ex: PROD-001"
                      value={formData.internalCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#1e293b]/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50 ${
                        errors.internalCode 
                          ? "border-red-500/70" 
                          : "border-amber-500/30"
                      }`}
                    />
                    {errors.internalCode && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.internalCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-amber-300 mb-2">
                      Unidade <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="unit"
                      name="unit"
                      type="text"
                      placeholder="Ex: kg, un, cx, m³"
                      value={formData.unit}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#1e293b]/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50 ${
                        errors.unit 
                          ? "border-red-500/70" 
                          : "border-amber-500/30"
                      }`}
                    />
                    {errors.unit && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.unit}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-amber-300 mb-2">
                      Descrição <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="description"
                      name="description"
                      type="text"
                      placeholder="Descrição detalhada do produto"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#1e293b]/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50 ${
                        errors.description 
                          ? "border-red-500/70" 
                          : "border-amber-500/30"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantidades */}
              <div className="border-b border-amber-500/20 pb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-br from-amber-900/30 to-amber-900/20 border border-amber-500/30 rounded-lg p-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Quantidades e Medidas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-amber-300 mb-2">
                      Quantidade <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#1e293b]/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50 ${
                        errors.quantity 
                          ? "border-red-500/70" 
                          : "border-amber-500/30"
                      }`}
                    />
                    {errors.quantity && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="totalWeight" className="block text-sm font-medium text-amber-300 mb-2">
                      Peso Total (kg)
                    </label>
                    <input
                      id="totalWeight"
                      name="totalWeight"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.totalWeight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="totalVolume" className="block text-sm font-medium text-amber-300 mb-2">
                      Volume Total (m³)
                    </label>
                    <input
                      id="totalVolume"
                      name="totalVolume"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.totalVolume}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50"
                    />
                  </div>
                </div>
              </div>

              {/* Fornecedor e Localização */}
              <div className="border-b border-amber-500/20 pb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-br from-amber-900/30 to-amber-900/20 border border-amber-500/30 rounded-lg p-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Fornecedor e Localização</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="supplierId" className="block text-sm font-medium text-amber-300 mb-2">
                      Fornecedor <span className="text-red-400">*</span>
                    </label>
                    {loadingSuppliers ? (
                      <div className="w-full px-4 py-3 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg text-amber-300/70">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                          A carregar fornecedores...
                        </div>
                      </div>
                    ) : (
                      <select
                        id="supplierId"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-[#1e293b]/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white ${
                          errors.supplierId 
                            ? "border-red-500/70" 
                            : "border-amber-500/30"
                        }`}
                      >
                        <option value="" className="bg-[#1e293b] text-amber-300/50">Selecione um fornecedor</option>
                        {suppliers?.map((supplier) => (
                          <option key={supplier.id} value={supplier.id} className="bg-[#1e293b]">
                            {supplier.name} (NIF: {supplier.nif})
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.supplierId && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.supplierId}
                      </p>
                    )}
                    {!loadingSuppliers && suppliers?.length === 0 && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-amber-900/20 to-amber-900/10 rounded-lg border border-amber-500/20">
                        <p className="text-sm text-amber-300/80 flex items-center gap-2">
                          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Nenhum fornecedor disponível.{" "}
                          <button
                            type="button"
                            onClick={() => navigate('/fornecedores')}
                            className="text-amber-400 hover:text-amber-300 underline font-medium"
                          >
                            Criar fornecedor
                          </button>
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="currentLocation" className="block text-sm font-medium text-amber-300 mb-2">
                      Localização Atual
                    </label>
                    <input
                      id="currentLocation"
                      name="currentLocation"
                      type="text"
                      placeholder="Ex: Corredor A, Prateleira 3"
                      value={formData.currentLocation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e293b]/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-amber-300/50"
                    />
                  </div>
                </div>
              </div>

              {/* Status do Produto */}
              <div className="border-b border-amber-500/20 pb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-lg p-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Status do Produto</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-amber-300 mb-2">
                      Estado Atual <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#1e293b]/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white ${
                        errors.status 
                          ? "border-red-500/70" 
                          : "border-amber-500/30"
                      }`}
                      required
                    >
                      <option value="RECEIVED" className="bg-[#1e293b]">📦 Recebido</option>
                      <option value="IN_ANALYSIS" className="bg-[#1e293b]">🔍 Em Análise</option>
                      <option value="IN_STORAGE" className="bg-[#1e293b]">🏢 Armazenado</option>
                      <option value="APPROVED" className="bg-[#1e293b]"> ✅ Aprovado</option>
                      <option value="DISPATCHED" className="bg-[#1e293b]">🚛 Expedido</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.status}
                      </p>
                    )}
                    <p className="text-xs text-amber-400/70 mt-2">
                      💡 Status padrão ao criar: <strong>Recebido</strong>
                    </p>
                  </div>

                  {/* Info sobre Status */}
                  <div className="mt-2 p-4 bg-gradient-to-r from-amber-900/20 to-amber-900/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-300 font-medium mb-3">ℹ️ About the Status:</p>
                    <ul className="text-xs text-amber-200/80 space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">📦</span>
                        <div>
                          <strong>Recebido:</strong> Produto acabou de chegar do fornecedor
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">🔍</span>
                        <div>
                          <strong>Em Análise:</strong> Produto sendo inspecionado/verificado
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">🏢</span>
                        <div>
                          <strong>Armazenado:</strong> Produto guardado no armazém
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5"></span>
                        <div>
                          <strong>Aprovado:</strong> Produto pronto para ser usado/expedido
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">🚛</span>
                        <div>
                          <strong>Expedido:</strong> Produto saiu para transporte/entrega
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/produtos")}
                  className="px-6 py-3 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 text-amber-300 border border-amber-500/30 rounded-lg hover:bg-amber-900/20 hover:text-amber-200 transition-all font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loadingSuppliers}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2 border border-amber-500/30 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      A guardar...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Criar Produto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
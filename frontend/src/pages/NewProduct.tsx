import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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
  observations: string;
}

interface FormErrors {
  internalCode?: string;
  description?: string;
  quantity?: string;
  unit?: string;
  supplierId?: string;
}

const NewProduct: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true); 
  
  const [formData, setFormData] = useState<FormState>({
    internalCode: "",
    description: "",
    quantity: "",
    unit: "",
    totalWeight: "",
    totalVolume: "",
    currentLocation: "",
    supplierId: "", 
    observations: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string>("");

  
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setApiError('Erro ao carregar lista de fornecedores');
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.internalCode.trim()) {
      newErrors.internalCode = "Código interno é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    const quantityNum = Number(formData.quantity);
    if (formData.quantity === "" || isNaN(quantityNum) || quantityNum <= 0) {
      newErrors.quantity = "Quantidade deve ser maior que zero";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unidade é obrigatória";
    }

    if (!formData.supplierId) {
      newErrors.supplierId = "Fornecedor é obrigatório";
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

    setIsSubmitting(true);
    try {

      const payload = {
        internalCode: formData.internalCode.trim(),
        description: formData.description.trim(),
        quantity: Number(formData.quantity),
        unit: formData.unit.trim(),
        totalWeight: formData.totalWeight ? Number(formData.totalWeight) : undefined,
        totalVolume: formData.totalVolume ? Number(formData.totalVolume) : undefined,
        currentLocation: formData.currentLocation.trim() || undefined,
        supplierId: formData.supplierId, 
        observations: formData.observations.trim() || undefined,
      };

      console.log("Enviando produto:", payload);
      const response = await api.post("/products", payload);
      console.log("Produto criado:", response.data);
      
      alert("Produto criado com sucesso!");
      navigate("/produtos");
      
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          setApiError(data.error || "Dados inválidos");
        } else if (status === 409) {
          setApiError("Já existe um produto com este código interno.");
        } else {
          setApiError(data.error || `Erro do servidor (${status})`);
        }
      } else if (error.request) {
        setApiError("Sem resposta do servidor. Verifique sua conexão.");
      } else {
        setApiError("Erro inesperado: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-xl">
            <h2 className="text-3xl font-bold text-white">Novo Produto</h2>
            <p className="text-blue-100 mt-1">Preencha os dados do novo produto</p>
          </div>

          <div className="p-8">
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Erro</p>
                    <p className="text-sm text-red-700 mt-1">{apiError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="internalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Código Interno <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="internalCode"
                      name="internalCode"
                      type="text"
                      placeholder="Ex: PROD-001"
                      value={formData.internalCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.internalCode 
                          ? "border-red-500 focus:ring-red-200" 
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                    />
                    {errors.internalCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.internalCode}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                      Unidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="unit"
                      name="unit"
                      type="text"
                      placeholder="Ex: kg, un, cx, m³"
                      value={formData.unit}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.unit 
                          ? "border-red-500 focus:ring-red-200" 
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                    />
                    {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="description"
                      name="description"
                      type="text"
                      placeholder="Descrição detalhada do produto"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.description 
                          ? "border-red-500 focus:ring-red-200" 
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantidades */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantidades e Medidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade <span className="text-red-500">*</span>
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.quantity 
                          ? "border-red-500 focus:ring-red-200" 
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="totalWeight" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="totalVolume" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>

              {/* Fornecedor e Localização */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fornecedor e Localização</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/*  DROPDOWN DE FORNECEDORES */}
                  <div>
                    <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-2">
                      Fornecedor <span className="text-red-500">*</span>
                    </label>
                    {loadingSuppliers ? (
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                        A carregar fornecedores...
                      </div>
                    ) : (
                      <select
                        id="supplierId"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.supplierId 
                            ? "border-red-500 focus:ring-red-200" 
                            : "border-gray-300 focus:ring-blue-200"
                        }`}
                      >
                        <option value="">Selecione um fornecedor</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name} (NIF: {supplier.nif})
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.supplierId && (
                      <p className="text-red-500 text-xs mt-1">{errors.supplierId}</p>
                    )}
                    {!loadingSuppliers && suppliers.length === 0 && (
                      <p className="text-yellow-600 text-xs mt-1">
                        ⚠️ Nenhum fornecedor disponível. <button
                          type="button"
                          onClick={() => navigate('/fornecedores')}
                          className="text-blue-600 hover:underline"
                        >
                          Criar fornecedor
                        </button>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-2">
                      Localização Atual
                    </label>
                    <input
                      id="currentLocation"
                      name="currentLocation"
                      type="text"
                      placeholder="Ex: Corredor A, Prateleira 3"
                      value={formData.currentLocation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  id="observations"
                  name="observations"
                  rows={4}
                  placeholder="Informações adicionais sobre o produto..."
                  value={formData.observations}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/produtos")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loadingSuppliers}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
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
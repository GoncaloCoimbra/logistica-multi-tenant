import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

interface FormState {
  internalCode: string;
  description: string;
  quantity: number | string;
  unit: string;
  supplierName: string;
}

interface FormErrors {
  internalCode?: string;
  description?: string;
  quantity?: string;
  unit?: string;
  supplierName?: string;
}

const NewProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>({
    internalCode: "",
    description: "",
    quantity: "",
    unit: "",
    supplierName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.internalCode.trim()) {
      newErrors.internalCode = "Código interno é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    const quantityNum = Number(formData.quantity);
    if (formData.quantity === "" || isNaN(quantityNum) || quantityNum < 0) {
      newErrors.quantity = "Quantidade deve ser um número não negativo";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unidade é obrigatória";
    }

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "Fornecedor é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      const payloads = [
        
        {
          internalCode: formData.internalCode.trim(),
          description: formData.description.trim(),
          quantity: Number(formData.quantity),
          unit: formData.unit.trim(),
          supplier: { 
            name: formData.supplierName.trim() 
          },
        },
         
        {
          internalCode: formData.internalCode.trim(),
          description: formData.description.trim(),
          quantity: Number(formData.quantity),
          unit: formData.unit.trim(),
          supplier: formData.supplierName.trim(),
        },
         
        {
          internalCode: formData.internalCode.trim(),
          description: formData.description.trim(),
          quantity: Number(formData.quantity),
          unit: formData.unit.trim(),
          supplierName: formData.supplierName.trim(),
        },
         
        {
          code: formData.internalCode.trim(),
          description: formData.description.trim(),
          stock: Number(formData.quantity),
          unit: formData.unit.trim(),
          supplier: formData.supplierName.trim(),
        }
      ];

      console.log("Tentando diferentes estruturas de payload...");
      
      let success = false;
      let lastError = null;

      
      for (const payload of payloads) {
        try {
          console.log("Tentando payload:", JSON.stringify(payload, null, 2));
          const response = await api.post("/products", payload);
          console.log("✅ Sucesso com estrutura:", Object.keys(payload));
          console.log("Resposta:", response.data);
          
          alert("Produto criado com sucesso!");
          navigate("/");
          success = true;
          break;
        } catch (error: any) {
          lastError = error;
          console.log(`❌ Falha com estrutura: ${Object.keys(payload)}`);
          if (error.response) {
            console.log("Detalhes do erro:", error.response.data);
          }
           
        }
      }

      if (!success && lastError) {
        throw lastError;
      }
      
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        console.error("Detalhes completos do erro:", {
          status,
          data: errorData,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        });

        if (status === 400) {
          
          if (errorData.errors) {
            const errorMessages = Object.values(errorData.errors).flat();
            setApiError(`Erros de validação: ${errorMessages.join(', ')}`);
          } else if (errorData.message) {
            setApiError(errorData.message);
          } else {
            setApiError("Dados inválidos enviados ao servidor");
          }
        } else if (status === 409) {
          setApiError("Já existe um produto com este código interno.");
        } else {
          setApiError(`Erro do servidor (${status}): ${errorData.message || "Tente novamente"}`);
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

  const getCurrentPayload = () => {
    return {
      internalCode: formData.internalCode.trim(),
      description: formData.description.trim(),
      quantity: Number(formData.quantity),
      unit: formData.unit.trim(),
      supplierName: formData.supplierName.trim(),
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Novo Produto</h2>
          <p className="text-gray-600 mb-6">Preencha os dados do novo produto</p>

          <details className="mb-4 text-xs">
            <summary className="cursor-pointer text-blue-600">Debug (desenvolvedor)</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(getCurrentPayload(), null, 2)}
            </pre>
          </details>

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">Erro:</p>
              <p className="text-red-600 text-sm mt-1">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="internalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Código Interno *
              </label>
              <input
                id="internalCode"
                name="internalCode"
                type="text"
                placeholder="Digite o código interno"
                value={formData.internalCode}
                onChange={handleChange}
                className={`border rounded-lg w-full p-3 transition-colors ${
                  errors.internalCode ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.internalCode && <p className="text-red-500 text-sm mt-1">{errors.internalCode}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="Descrição do produto"
                value={formData.description}
                onChange={handleChange}
                className={`border rounded-lg w-full p-3 transition-colors ${
                  errors.description ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-3 transition-colors ${
                    errors.quantity ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade *
                </label>
                <input
                  id="unit"
                  name="unit"
                  type="text"
                  placeholder="ex: kg, un, cx"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-3 transition-colors ${
                    errors.unit ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                />
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-1">
                Fornecedor *
              </label>
              <input
                id="supplierName"
                name="supplierName"
                type="text"
                placeholder="Nome do fornecedor"
                value={formData.supplierName}
                onChange={handleChange}
                className={`border rounded-lg w-full p-3 transition-colors ${
                  errors.supplierName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.supplierName && <p className="text-red-500 text-sm mt-1">{errors.supplierName}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http:www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Testando estruturas...
                  </>
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
import React, { useState, useEffect } from "react";
import { Search, Plus, X, User, UserPlus, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";

interface StudentSelectorProps {
  students: any[];
  schools: any[];
  onSelect: (student: any) => void;
  selectedStudent: any;
  onRefresh?: () => Promise<void>;
}

export const StudentSelector = ({ students, schools, onSelect, selectedStudent, onRefresh }: StudentSelectorProps) => {
  const [filters, setFilters] = useState({
    ra: selectedStudent?.ra || "",
    name: selectedStudent?.name || "",
    class: selectedStudent?.class || "",
    schoolId: selectedStudent?.schoolId || "",
  });

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddForm, setQuickAddForm] = useState({
    name: "",
    ra: "",
    class: "",
    schoolId: "",
  });
  const [savingQuick, setSavingQuick] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      setFilters({
        ra: selectedStudent.ra,
        name: selectedStudent.name,
        class: selectedStudent.class,
        schoolId: selectedStudent.schoolId,
      });
    } else {
      setFilters({ ra: "", name: "", class: "", schoolId: "" });
    }
  }, [selectedStudent]);

  const filtered = students.filter((s: any) => {
    return (!filters.ra || s.ra?.toLowerCase().includes(filters.ra.toLowerCase())) &&
           (!filters.name || s.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
           (!filters.class || s.class?.toLowerCase().includes(filters.class.toLowerCase())) &&
           (!filters.schoolId || s.schoolId === filters.schoolId);
  });

  const hasActiveSearch = filters.ra.length > 2 || filters.name.length > 2 || filters.class.length > 1;

  const handleSelect = (s: any) => {
    onSelect(s);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddForm.name || !quickAddForm.schoolId) {
      alert("Nome e Unidade são obrigatórios.");
      return;
    }

    setSavingQuick(true);
    try {
      const newPerson = await api.students.create({
        ...quickAddForm,
        age: 0,
        studentType: 'external',
        observations: "Cadastro rápido via emissão de documento"
      });
      
      if (onRefresh) await onRefresh();
      
      onSelect(newPerson);
      setShowQuickAdd(false);
      setQuickAddForm({ name: "", ra: "", class: "", schoolId: "" });
    } catch (err: any) {
      alert("Erro ao realizar cadastro rápido: " + err.message);
    } finally {
      setSavingQuick(false);
    }
  };

  const getSchoolName = (id: string) => schools.find(s => s.id === id)?.name || "Unidade não encontrada";

  return (
    <div className="bg-[#fff7ed] p-5 rounded-2xl border border-orange-100 space-y-4 shadow-inner">
      <div className="flex items-center justify-between px-1">
        <h5 className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Localizar Registro do Estudante</h5>
        <button 
          type="button"
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${showQuickAdd ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-100'}`}
        >
          {showQuickAdd ? <X size={14} /> : <Plus size={14} />}
          {showQuickAdd ? 'Cancelar Cadastro' : 'Cadastrar Pessoa Nova'}
        </button>
      </div>

      {showQuickAdd ? (
        <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <p className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-2">
            <UserPlus size={14} className="text-orange-600" />
            Cadastro Rápido (Se não encontrado na busca)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                value={quickAddForm.name}
                onChange={(e) => setQuickAddForm({...quickAddForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">RA (Se houver)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                value={quickAddForm.ra}
                onChange={(e) => setQuickAddForm({...quickAddForm, ra: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1 grid-cols-1">Turma / Função</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                value={quickAddForm.class}
                placeholder="Ex: 3º Ano B"
                onChange={(e) => setQuickAddForm({...quickAddForm, class: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1 text-orange-600">Unidade Escolar *</label>
              <select 
                required
                className="w-full px-4 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                value={quickAddForm.schoolId}
                onChange={(e) => setQuickAddForm({...quickAddForm, schoolId: e.target.value})}
              >
                <option value="">Selecione a Unidade...</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button 
                type="button"
                disabled={savingQuick}
                onClick={handleQuickAdd}
                className="bg-orange-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-orange-700 transition-all disabled:opacity-50"
              >
                {savingQuick ? 'Salvando...' : 'Confirmar e Selecionar'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase text-orange-600 mb-1">Pesquisar RA</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                className="w-full pl-9 pr-4 py-2.5 text-sm border-0 rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-orange-500 bg-white shadow-sm transition-all"
                value={filters.ra}
                placeholder="Número..."
                onChange={(e) => {
                  const val = e.target.value;
                  setFilters({...filters, ra: val});
                  const match = students.find(s => s.ra === val);
                  if (match) handleSelect(match);
                }}
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black uppercase text-orange-600 mb-1">Nome</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 text-sm border-0 rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-orange-500 bg-white shadow-sm transition-all"
              value={filters.name}
              placeholder="Pesquisar registro..."
              onChange={(e) => setFilters({...filters, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-orange-600 mb-1">Turma / Ano</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 text-sm border-0 rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-orange-500 bg-white shadow-sm transition-all"
              value={filters.class}
              placeholder="Filtro de turma..."
              onChange={(e) => setFilters({...filters, class: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-orange-600 mb-1">Unidade</label>
            <select 
              className="w-full px-4 py-2.5 text-sm border-0 rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-orange-500 bg-white shadow-sm transition-all cursor-pointer"
              value={filters.schoolId}
              onChange={(e) => setFilters({...filters, schoolId: e.target.value})}
            >
              <option value="">Todas</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {selectedStudent && (
          <div className="px-1 py-1">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-orange-600">
              <CheckCircle2 size={12} />
              Registro do Aluno Selecionado com Sucesso
            </span>
          </div>
        )}
        
        {hasActiveSearch && !showQuickAdd && (
          <div className="max-h-56 overflow-y-auto border border-gray-100 rounded-2xl bg-white divide-y divide-gray-50 shadow-sm custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
            {filtered.length > 0 ? (
              filtered.slice(0, 50).map((s: any) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className={`w-full text-left px-5 py-4 hover:bg-orange-50/50 transition-all flex items-center justify-between group ${selectedStudent?.id === s.id ? 'bg-orange-50/80 ring-2 ring-inset ring-orange-500/5' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedStudent?.id === s.id ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 group-hover:bg-orange-600 group-hover:text-white group-hover:shadow-md'}`}>
                      <User size={18} />
                    </div>
                    <div>
                      <p className={`font-bold text-sm tracking-tight ${selectedStudent?.id === s.id ? 'text-orange-600' : 'text-gray-900'}`}>{s.name}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] font-bold text-gray-400">
                        {s.ra && <span>RA: {s.ra}</span>}
                        {s.class && <span>Turma/Função: {s.class}</span>}
                        <span>Unidade: {getSchoolName(s.schoolId)}</span>
                      </div>
                    </div>
                  </div>
                  {selectedStudent?.id === s.id ? (
                    <div className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-100">
                      Selecionado
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-orange-600 hover:text-white transition-all text-orange-600">
                      <Plus size={16} />
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                <Search size={24} className="text-gray-200" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400">Nenhum registro encontrado...</p>
                  <button 
                    type="button"
                    onClick={() => setShowQuickAdd(true)}
                    className="text-[10px] font-black uppercase text-orange-600 hover:underline"
                  >
                    Cadastrar nova pessoa agora
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

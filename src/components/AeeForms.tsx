import React, { useState } from "react";
import { School, User, Calendar as CalendarIcon, FileWarning, CheckCircle2 } from "lucide-react";
import { generateAIResponse } from "../lib/ai";

export const PeiCopyRequestForm = ({ formData, setFormData, student }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
        <h4 className="font-bold text-orange-950 mb-4 flex items-center gap-2">
          <School size={18} /> Dados para Solicitação de Cópia do PEI Anterior
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">À Direção da Escola</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
              value={formData.school || ''} 
              onChange={(e) => setFormData({...formData, school: e.target.value})} 
              placeholder="Digite o nome da escola destinatária"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Ano/Série</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
              value={formData.grade || student?.class || ''} 
              onChange={(e) => setFormData({...formData, grade: e.target.value})} 
              placeholder="Ex: 5º Ano"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Turma</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
              value={formData.class || ''} 
              onChange={(e) => setFormData({...formData, class: e.target.value})} 
              placeholder="Ex: Turma B"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Turno</label>
            <select 
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
              value={formData.shift || ''} 
              onChange={(e) => setFormData({...formData, shift: e.target.value})}
            >
              <option value="">Selecione o Turno</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noturno">Noturno</option>
              <option value="Integral">Integral</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Necessidades Educacionais Específicas (NEE)</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
              value={formData.nee || ''} 
              onChange={(e) => setFormData({...formData, nee: e.target.value})} 
              placeholder="Ex: TEA, TDAH, Deficiência Visual"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PedagogicalTechnicalReportForm = ({ formData, setFormData, student }: any) => {
  const [generating, setGenerating] = useState(false);

  const NEE_OPTIONS = [
    'Deficiência', 'Transtorno do Espectro Autista (TEA)', 'Altas Habilidades/Superdotação', 
    'Transtorno do Déficit de Atenção (TDAH)', 'Transtorno de Aprendizagem', 
    'Transtorno do Desenvolvimento Intelectual (TDI)', 'Outras'
  ];

  const DOCS_COMPLEMENTARY = [
    'Laudo médico', 'Relatórios pedagógicos', 'Registros do AEE', 'Outros documentos'
  ];

  const handleAISynthesis = async () => {
    if (!student?.name) {
      alert("Por favor, selecione um aluno primeiro.");
      return;
    }
    setGenerating(true);
    try {
      const prompt = `
        Com base no relatório pedagógico do aluno ${student.name}, com as seguintes NEE: ${formData.neeDetails || 'Não especificadas'}.
        Histórico e Contextualização: ${formData.contextText || 'Não informado'}.
        Necessidades identificadas: ${formData.needsText || 'Não informadas'}.
        Barreiras identificadas: ${formData.barriersText || 'Não informado'}.
        
        Gere uma síntese de "Considerações Finais da Equipe Pedagógica" profissional, acolhedora, objetiva (máximo de 150 palavras) e estruturada recomendando estratégias de inclusão.
      `;
      const response = await generateAIResponse(prompt);
      if (response.result) {
        setFormData({ ...formData, finalConsiderations: response.result });
      } else {
        alert("Resposta da inteligência artificial vazia. Tente novamente.");
      }
    } catch (err: any) {
      alert("Erro ao gerar insights pedagógicos: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50 p-6 rounded-2xl border border-orange-100">
        <h4 className="md:col-span-2 font-bold text-orange-850 flex items-center gap-2 mb-2">
          <School size={18} /> Seção 1 & 2. Identificação Pedagógica
        </h4>
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-1">Unidade Escolar SESI</label>
          <input type="text" className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none" value={formData.schoolSesi || student?.schoolName || ''} onChange={(e) => setFormData({...formData, schoolSesi: e.target.value})} placeholder="Ex: SESI Paulista" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-1">Etapa de Ensino</label>
          <input type="text" className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none" value={formData.teachingStage || ''} onChange={(e) => setFormData({...formData, teachingStage: e.target.value})} placeholder="Ex: Ensino Fundamental II" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-1">Data de Nascimento do Aluno</label>
          <input type="date" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.birthDate || ''} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-1">Ano/Série/Turma & Turno</label>
          <input type="text" className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none" value={formData.gradeClassTurn || ''} onChange={(e) => setFormData({...formData, gradeClassTurn: e.target.value})} placeholder="Ex: 6º Ano A - Vespertino" />
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-white space-y-3 shadow-sm border-gray-100">
        <h4 className="font-bold text-gray-700">Necessidades Educacionais Específicas (NEE)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {NEE_OPTIONS.map(opt => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-orange-50/30 rounded-lg">
              <input 
                type="checkbox" 
                checked={formData.neeTypeList?.includes(opt) || false}
                onChange={(e) => {
                  const list = formData.neeTypeList || [];
                  setFormData({
                    ...formData,
                    neeTypeList: e.target.checked ? [...list, opt] : list.filter((x: string) => x !== opt)
                  });
                }}
                className="rounded text-orange-600 focus:ring-orange-550 h-4 w-4"
              />
              <span className="text-sm text-gray-600">{opt}</span>
            </label>
          ))}
        </div>
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-1 mt-2">Especificações das NEEs (se houver Transtornos ou Deficiências específicas)</label>
          <input type="text" className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none" value={formData.neeDetails || ''} onChange={(e) => setFormData({...formData, neeDetails: e.target.value})} placeholder="Detalhe as deficiências ou transtornos" />
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm border-gray-100">
        <h4 className="font-bold text-gray-700">Composição da Equipe Responsável</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Profissional do AEE</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.aeeProfessional || ''} onChange={(e) => setFormData({...formData, aeeProfessional: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Psicólogo Escolar</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.schoolPsychologist || ''} onChange={(e) => setFormData({...formData, schoolPsychologist: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Supervisor Pedagógico</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.pedagogicalSupervisor || ''} onChange={(e) => setFormData({...formData, pedagogicalSupervisor: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Seção 4: Contextualização Pedagógica do Estudante</label>
          <p className="text-xs text-gray-400 mb-1">Relatar brevemente histórico escolar, desempenho acadêmico, nível de engajamento escolar e nível de autonomia.</p>
          <textarea className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" rows={3} value={formData.contextText || ''} onChange={(e) => setFormData({...formData, contextText: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Seção 5: Levantamento das Necessidades Educacionais</label>
          <p className="text-xs text-gray-400 mb-1">Levantamento de necessidades relacionadas a locomoção, noções elementares de alimentação, autocuidado, higienização, comunicação e suporte escolar geral.</p>
          <textarea className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" rows={3} value={formData.needsText || ''} onChange={(e) => setFormData({...formData, needsText: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Seção 6: Barreiras no Contexto Escolar</label>
          <p className="text-xs text-gray-400 mb-1">Barreiras atitudinais, físicas, tecnológicas, comunicacionais e pedagógicas mapeadas na rede escolar.</p>
          <textarea className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" rows={3} value={formData.barriersText || ''} onChange={(e) => setFormData({...formData, barriersText: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Seção 7: Estratégias Pedagógicas Implementadas</label>
          <p className="text-xs text-gray-400 mb-1">Adequações pedagógicas regulares, estratégias em sala de aula comum e de recursos multifuncionais efetuadas.</p>
          <textarea className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" rows={3} value={formData.strategiesText || ''} onChange={(e) => setFormData({...formData, strategiesText: e.target.value})} />
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-orange-50/50 space-y-4 shadow-inner">
        <h4 className="font-bold text-orange-900 border-b pb-1">Seção 8 & 9. Deliberação sobre Profissional de Apoio Escolar</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Indicação Pedagógica</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Sim" name="supportIndication" checked={formData.supportIndication === 'Sim'} onChange={() => setFormData({...formData, supportIndication: 'Sim'})} />
                <span>Sim, há indicação para profissional de apoio escolar</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Não" name="supportIndication" checked={formData.supportIndication === 'Não'} onChange={() => setFormData({...formData, supportIndication: 'Não'})} />
                <span>Não há indicação pedagógica formal no momento</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Modalidade do Apoio</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Exclusivo" name="sharedSupport" checked={formData.sharedSupport === 'Exclusivo'} onChange={() => setFormData({...formData, sharedSupport: 'Exclusivo'})} />
                <span>Atendimento exclusivo (individual)</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Compartilhado" name="sharedSupport" checked={formData.sharedSupport === 'Compartilhado'} onChange={() => setFormData({...formData, sharedSupport: 'Compartilhado'})} />
                <span>Atendimento compartilhado com outros alunos</span>
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-1">Detalhamento Técnico (Períodos, Funções e Frequência do Apoio)</label>
          <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" value={formData.sharedDetails || ''} onChange={(e) => setFormData({...formData, sharedDetails: e.target.value})} placeholder="Ex: Acompanhamento de apoio compartilhado com 2 alunos nas terças e quintas" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-bold text-gray-700">Seção 10: Considerações Finais da Equipe Pedagógica</label>
          <button 
            type="button" 
            disabled={generating}
            onClick={handleAISynthesis} 
            className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded-lg flex items-center gap-1.5 transition-all shadow"
          >
            {generating ? 'Consolidando Relato...' : 'Sugerir Insights com IA'}
          </button>
        </div>
        <textarea className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" rows={4} value={formData.finalConsiderations || ''} onChange={(e) => setFormData({...formData, finalConsiderations: e.target.value})} placeholder="Síntese técnica conclusiva e plano de encaminhamento institucional..." />
      </div>

      <div className="p-6 border rounded-2xl bg-white space-y-3 shadow-sm border-gray-100">
        <h4 className="font-bold text-gray-700">Seção 11. Documentações Complementares Utilizadas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {DOCS_COMPLEMENTARY.map(doc => (
            <label key={doc} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-orange-50/30 rounded-lg">
              <input 
                type="checkbox" 
                checked={formData.complementaryDocList?.includes(doc) || false}
                onChange={(e) => {
                  const list = formData.complementaryDocList || [];
                  setFormData({
                    ...formData,
                    complementaryDocList: e.target.checked ? [...list, doc] : list.filter((x: string) => x !== doc)
                  });
                }}
                className="rounded text-orange-600 focus:ring-orange-550 h-4 w-4"
              />
              <span className="text-sm text-gray-600">{doc}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-orange-50/30 space-y-4">
        <h4 className="font-bold text-gray-700">Seção 12. Assinaturas Mistas Colegiadas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Assinante AEE</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.aeeSigner || ''} onChange={(e) => setFormData({...formData, aeeSigner: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1 font-bold text-orange-700">Data AEE</label>
            <input type="date" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.aeeSignDate || ''} onChange={(e) => setFormData({...formData, aeeSignDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Assinante Psicologia</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.psychSigner || ''} onChange={(e) => setFormData({...formData, psychSigner: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1 font-bold text-orange-700">Data Psicologia</label>
            <input type="date" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.psychSignDate || ''} onChange={(e) => setFormData({...formData, psychSignDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Assinante Supervisão</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.supervisorSigner || ''} onChange={(e) => setFormData({...formData, supervisorSigner: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1 font-bold text-orange-700">Data Supervisão</label>
            <input type="date" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.supervisorSignDate || ''} onChange={(e) => setFormData({...formData, supervisorSignDate: e.target.value})} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const EducationalAnamnesisForm = ({ formData, setFormData, student }: any) => {
  const HEALTH_ESCORT = [
    'Pediatra', 'Neuropediatra / Neurologista', 'Psiquiatra Infantil', 'Psicólogo(a)', 
    'Fonoaudiólogo(a)', 'Fisioterapeuta', 'Terapeuta Ocupacional', 'Psicopedagogo', 'Outros'
  ];

  const SENSORY_SENS = ['Sons altos', 'Luz intensa', 'Texturas de roupas', 'Cheiros fortes', 'Certas texturas de alimentos', 'Não apresenta sensibilidades'];
  const LEARNING_DIFFS = ['Leitura', 'Escrita', 'Cálculos Matemáticos', 'Sociliabilidade / Relação Social', 'Foco e Atenção', 'Comunicação verbal / expressiva', 'Organização de material / autonomia'];
  const BEHAVIORS_OBS = ['Isolamento social', 'Comportamentos autoagressivos', 'Crises emocionais / choro frequente', 'Comportamentos disruptivos ou agressividade', 'Movimentos repetitivos ou estereotipias'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
        <h4 className="font-bold text-orange-950 flex items-center gap-2">
          <User size={18} /> Seção 3. Saúde e Desenvolvimento Do Estudante
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Possui diagnóstico médico?</label>
            <select className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm" value={formData.health_diagnostic || ''} onChange={(e) => setFormData({...formData, health_diagnostic: e.target.value})}>
              <option value="">Selecione...</option>
              <option value="Sim">Sim, possui laudo conclusivo</option>
              <option value="Não">Não possui diagnóstico formal</option>
              <option value="Em investigação">Em processo de investigação diagnóstica</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Data / Ano do Diagnóstico</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="Ex: Setembro/2024" value={formData.diag_date || ''} onChange={(e) => setFormData({...formData, diag_date: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Laudo / Especialidade e Profissional Responsável</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm placeholder-gray-400" placeholder="Ex: Neuropediatra Dr. Carlos Silva (TEA Leve CID F84)" value={formData.diag_prof_desc || ''} onChange={(e) => setFormData({...formData, diag_prof_desc: e.target.value})} />
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-xs font-black text-gray-500 uppercase mb-2">Acompanhamentos Atuais do Aluno</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {HEALTH_ESCORT.map(esc => (
              <label key={esc} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-orange-100/50">
                <input 
                  type="checkbox" 
                  checked={formData.escortList?.includes(esc) || false}
                  className="rounded text-orange-600 focus:ring-orange-550 h-4 w-4"
                  onChange={(e) => {
                    const list = formData.escortList || [];
                    setFormData({
                      ...formData,
                      escortList: e.target.checked ? [...list, esc] : list.filter((x: string) => x !== esc)
                    });
                  }}
                />
                <span className="text-xs text-gray-700">{esc}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Faz uso de medicação contínua?</label>
            <select className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm" value={formData.medication || ''} onChange={(e) => setFormData({...formData, medication: e.target.value})}>
              <option value="">Selecione...</option>
              <option value="Não">Não faz uso de medicamentos</option>
              <option value="Sim">Sim, utiliza medicamentos contínuos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Especifique o Medicamento (Nome/Dosagem/Horário)</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm placeholder-gray-400" placeholder="Ex: Ritalina LA 10mg pela manhã" disabled={formData.medication !== 'Sim'} value={formData.medication_desc || ''} onChange={(e) => setFormData({...formData, medication_desc: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-2">Sensibilidades Sensoriais Relatadas</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {SENSORY_SENS.map(sens => (
              <label key={sens} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-orange-100/50">
                <input 
                  type="checkbox" 
                  checked={formData.sensoryList?.includes(sens) || false}
                  className="rounded text-orange-600 focus:ring-orange-550 h-4 w-4"
                  onChange={(e) => {
                    const list = formData.sensoryList || [];
                    setFormData({
                      ...formData,
                      sensoryList: e.target.checked ? [...list, sens] : list.filter((x: string) => x !== sens)
                    });
                  }}
                />
                <span className="text-xs text-gray-700">{sens}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm border-gray-100">
        <h4 className="font-bold text-gray-700 border-b pb-1">Seção 4: Rotinas e Nível de Autocuidado</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Qualidade do Sono?</label>
            <select className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm" value={formData.sleepsWell || ''} onChange={(e) => setFormData({...formData, sleepsWell: e.target.value})}>
              <option value="">Selecione...</option>
              <option value="Sim">Dorme de forma tranquila e regular</option>
              <option value="Não">Apresenta insônia ou agitação noturna</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Alimentação do Aluno</label>
            <select className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm" value={formData.feeding || ''} onChange={(e) => setFormData({...formData, feeding: e.target.value})}>
              <option value="">Selecione...</option>
              <option value="Independente">Alimenta-se sozinho e com independência</option>
              <option value="Com ajuda">Necessita de apoio / ajuda física na alimentação</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Apresenta Seletividade Alimentar?</label>
            <select className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm" value={formData.foodSelectivity || ''} onChange={(e) => setFormData({...formData, foodSelectivity: e.target.value})}>
              <option value="">Selecione...</option>
              <option value="Não">Alimenta-se bem de todos os grupos</option>
              <option value="Sim">Demonstra seletividade alimentar marcante</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Especifique a Seletividade</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm" disabled={formData.foodSelectivity !== 'Sim'} value={formData.foodSelectivityDesc || ''} onChange={(e) => setFormData({...formData, foodSelectivityDesc: e.target.value})} placeholder="Quais texturas, cores ou alimentos recusa" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Autocuidado (Uso do banheiro, Higiene Íntima e Vestuário)</label>
            <select className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm" value={formData.autocuidado || ''} onChange={(e) => setFormData({...formData, autocuidado: e.target.value})}>
              <option value="">Selecione...</option>
              <option value="Independente">Independente nas práticas de autocuidado</option>
              <option value="Com ajuda parcial">Precisa de auxílio verbal ou leve apoio parcial</option>
              <option value="Com ajuda total">Altamente dependente de apoio e guias físicos no autocuidado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm border-gray-100">
        <h4 className="font-bold text-gray-700 border-b pb-1">Seção 5, 6 & 7. Aprendizagem, Comunicação e Comportamento</h4>
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-2">Principais Dificuldades de Aprendizagem Mapeadas</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {LEARNING_DIFFS.map(diff => (
              <label key={diff} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-orange-50">
                <input 
                  type="checkbox" 
                  checked={formData.learningDifficultiesList?.includes(diff) || false}
                  className="rounded text-orange-600 focus:ring-orange-550 h-4 w-4"
                  onChange={(e) => {
                    const list = formData.learningDifficultiesList || [];
                    setFormData({
                      ...formData,
                      learningDifficultiesList: e.target.checked ? [...list, diff] : list.filter((x: string) => x !== diff)
                    });
                  }}
                />
                <span className="text-xs text-gray-700">{diff}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Principais Potencialidades / Habilidades em Destaque do Estudante</label>
          <textarea 
            rows={2} 
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-450 bg-slate-50 focus:bg-white" 
            placeholder="Descreva interesses especiais, facilidades cognitivas e habilidades de memória..." 
            value={formData.studentSkills || ''} 
            onChange={(e) => setFormData({...formData, studentSkills: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-2">Tipo de Comunicação Preferencial</label>
          <div className="flex flex-wrap gap-4">
            {['Fala oral', 'Língua Brasileira de Sinais (Libras)', 'Gestos / Apontamento', 'Comunicação Aumentativa Alternativa (CAA)'].map(ct => (
              <label key={ct} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.communicationType?.includes(ct) || false}
                  onChange={(e) => {
                    const list = formData.communicationType || [];
                    setFormData({
                      ...formData,
                      communicationType: e.target.checked ? [...list, ct] : list.filter((x: string) => x !== ct)
                    });
                  }}
                  className="rounded text-orange-600 focus:ring-orange-550 h-4 w-4"
                />
                <span>{ct}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-2">Comportamentos Mapeados recorrentemente</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {BEHAVIORS_OBS.map(beh => (
              <label key={beh} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-orange-50">
                <input 
                  type="checkbox" 
                  checked={formData.behaviorsList?.includes(beh) || false}
                  className="rounded text-orange-600 focus:ring-orange-550 h-4 w-4"
                  onChange={(e) => {
                    const list = formData.behaviorsList || [];
                    setFormData({
                      ...formData,
                      behaviorsList: e.target.checked ? [...list, beh] : list.filter((x: string) => x !== beh)
                    });
                  }}
                />
                <span className="text-xs text-gray-700">{beh}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm border-gray-100">
        <h4 className="font-bold text-gray-700 border-b pb-1">Seção 8, 9 & 10. Histórico Escolar, Família e Observações Gerais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Idade de Entrada na Vida Escolar</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ex: 3 anos de idade" value={formData.schoolEntryAge || ''} onChange={(e) => setFormData({...formData, schoolEntryAge: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Já estudou em outra instituição escolar?</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-450" placeholder="Se sim, quais?" value={formData.otherSchoolsDesc || ''} onChange={(e) => setFormData({...formData, otherSchoolsDesc: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-1">Expectativas e Acordos da Família frente ao AEE</label>
          <textarea rows={3} className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400 bg-slate-50 focus:bg-white" placeholder="Foco na aprendizagem acadêmica, socialização etc." value={formData.importantNotes || ''} onChange={(e) => setFormData({...formData, importantNotes: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase mb-1">Observações Técnicas do Profissional do AEE</label>
          <textarea rows={3} className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-405 bg-slate-50 focus:bg-white" placeholder="Síntese do acolhimento da anamnese realizada..." value={formData.aeeObservations || ''} onChange={(e) => setFormData({...formData, aeeObservations: e.target.value})} />
        </div>
      </div>
    </div>
  );
};

export const AtAccompanimentTermForm = ({ formData, setFormData, student }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
        <h4 className="font-bold text-orange-950 flex items-center gap-2">
          <School size={18} /> Dados do Estabelecimento & Estudante
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Unidade Escolar SESI</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.schoolName || student?.schoolName || ''} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Endereço da Unidade Escolar</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="Ex: Av. Governador Agamenon Magalhães, s/n" value={formData.schoolAddress || ''} onChange={(e) => setFormData({...formData, schoolAddress: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Ano/Série correspondente</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.grade || student?.class || ''} onChange={(e) => setFormData({...formData, grade: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Turma e Turno</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="Ex: 4º Ano C - Matutino" value={formData.shift || ''} onChange={(e) => setFormData({...formData, shift: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm border-gray-100">
        <h4 className="font-bold text-gray-700 border-b pb-1">Identificação do Atendente Terapêutico (AT)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Nome Completo do(a) AT</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="Nome do profissional acompanhante" value={formData.atName || ''} onChange={(e) => setFormData({...formData, atName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Documento de Identificação (RG / CPF)</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="Ex: CPF 000.000.000-00" value={formData.atDoc || ''} onChange={(e) => setFormData({...formData, atDoc: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Área de Formação / Atuação do AT</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="Ex: Graduada em Psicologia / Especialista em ABA" value={formData.atBackground || ''} onChange={(e) => setFormData({...formData, atBackground: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Vínculo com o Estudante</label>
            <select className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-sm" value={formData.atLink || ''} onChange={(e) => setFormData({...formData, atLink: e.target.value})}>
              <option value="">Selecione...</option>
              <option value="Autônomo">Profissional Autônomo contratado pela família</option>
              <option value="Clínica">Representante de Clínica de Apoio / Equipe Multidisciplinar</option>
              <option value="Outro">Outro vínculo legal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Nome Fantasia da Clínica (se aplicável)</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-550 placeholder-gray-400" placeholder="Razão social da clínica ou outro detalhe" value={formData.atLinkDetail || ''} onChange={(e) => setFormData({...formData, atLinkDetail: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-orange-50/25 space-y-3">
        <h5 className="text-[10px] uppercase font-black tracking-widest text-orange-900">Termos de Compromisso Legal do AT</h5>
        <div className="text-xs text-gray-600 leading-relaxed space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          <p>1. O Atendente Terapêutico (AT) concorda em cooperar e respeitar as orientações da coordenação escolar do SESI.</p>
          <p>2. A intervenção em ambiente de sala de aula limita-se a apoiar a autorregulação do aluno, sem interferir na autonomia docente na condução do plano de aula.</p>
          <p>3. Compete ao AT comparecer trajado adequadamente e zelar pela guarda e uso estrito de suas funções técnicas de acompanhamento.</p>
          <p>4. Em caso de necessidade de saídas da sala para autorregulação, o encargo é acordado com o professor ou profissional do AEE.</p>
        </div>
      </div>
    </div>
  );
};

export const AdaptationAuthorizationTermForm = ({ formData, setFormData, student }: any) => {
  const ADAPT_CHOICES = [
    'Adequação de linguagem e nível de vocabulário de enunciados e textos',
    'Flexibilização / Redução ou acréscimo proporcional no número de questões avaliativas',
    'Mudança de formatos de propostas pedagógicas (opções pictográficas, em áudio ou oralizadas)',
    'Uso de tecnologias assistivas digitais escolares (como pranchas eletrônicas ou tablets)',
    'Permissão para saída controlada de sala para realização de exames/provas em local com menor ruído',
    'Ampliamento / Flexibilização sob medida de tempo para realização de exercícios e tarefas',
    'Apoio individualizado ou auxílio de monitoria pedagógica direta durante as realizações'
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
        <h4 className="font-bold text-orange-950 flex items-center gap-2">
          <User size={18} /> Identificação do Responsável Legal
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Nome Completo do Responsável</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-405" placeholder="Nome completo do responsável legal" value={formData.guardianName || ''} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">CPF do Responsável</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="000.000.000-00" value={formData.guardianCpf || ''} onChange={(e) => setFormData({...formData, guardianCpf: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">RG do Responsável</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="Ex: 0.000.000 SSP/PE" value={formData.guardianRg || ''} onChange={(e) => setFormData({...formData, guardianRg: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Endereço Residencial do Responsável</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="Rua, número, bairro e cidade" value={formData.guardianAddress || ''} onChange={(e) => setFormData({...formData, guardianAddress: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm border-gray-100">
        <h4 className="font-bold text-gray-700">Metodologias de Adaptabilidade Pedagógica Propostas</h4>
        <div className="space-y-2">
          {ADAPT_CHOICES.map(choice => (
            <label key={choice} className="flex items-start gap-2.5 cursor-pointer p-1.5 hover:bg-orange-50 rounded-lg">
              <input 
                type="checkbox" 
                checked={formData.adaptationChoices?.includes(choice) || false}
                className="mt-1 rounded text-orange-600 focus:ring-orange-550 h-4 w-4"
                onChange={(e) => {
                  const list = formData.adaptationChoices || [];
                  setFormData({
                    ...formData,
                    adaptationChoices: e.target.checked ? [...list, choice] : list.filter((x: string) => x !== choice)
                  });
                }}
              />
              <span className="text-sm text-gray-600 leading-tight">{choice}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Estratégias / Adequações Previstas</label>
          <textarea rows={3} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="Geral de adaptações organizadas pela escola" value={formData.previstas_text || ''} onChange={(e) => setFormData({...formData, previstas_text: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Estratégias Aceitas / Validadas pelo Responsável</label>
          <textarea rows={3} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm placeholder-gray-400" placeholder="Insira eventuais ressalvas acordadas com a família" value={formData.acceptedAdaptations || ''} onChange={(e) => setFormData({...formData, acceptedAdaptations: e.target.value})} />
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-orange-50/50 space-y-4">
        <h4 className="font-bold text-orange-955 border-b pb-1">Consentimentos e Decisões do Responsável</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Consentimento Geral de Adaptações</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Sim" name="agreesAdaptations" checked={formData.agreesAdaptations === 'Sim'} onChange={() => setFormData({...formData, agreesAdaptations: 'Sim'})} />
                <span>Sim, autorizo e pactuo as adequações</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Não" name="agreesAdaptations" checked={formData.agreesAdaptations === 'Não'} onChange={() => setFormData({...formData, agreesAdaptations: 'Não'})} />
                <span>Não pactuo as adequações sugeridas</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Autorização de Profissional de Apoio</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Sim" name="agreesSupportProfessional" checked={formData.agreesSupportProfessional === 'Sim'} onChange={() => setFormData({...formData, agreesSupportProfessional: 'Sim'})} />
                <span>Sim, aceito a disponibilização conforme avaliação legal</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Não" name="agreesSupportProfessional" checked={formData.agreesSupportProfessional === 'Não'} onChange={() => setFormData({...formData, agreesSupportProfessional: 'Não'})} />
                <span>Dispenso/Não desejo profissional de apoio</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PeiAcknowledgementTermForm = ({ formData, setFormData, student }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
        <h4 className="font-bold text-orange-950 flex items-center gap-2">
          <User size={18} /> Ciência e Validação do PEI Elaborado
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Nome Completo do Responsável Legal</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="Nome completo do responsável legal pelo estudante" value={formData.guardianName || ''} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase mb-1">Turma / Turno do Estudante</label>
              <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="Ex: 8º Ano A - Vespertino" value={formData.class || student?.class || ''} onChange={(e) => setFormData({...formData, class: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase mb-1">Cidade de Assinatura</label>
              <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="Ex: Paulista/PE" value={formData.local || ''} onChange={(e) => setFormData({...formData, local: e.target.value})} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 bg-orange-100/30 text-xs text-orange-900 border border-orange-200/50 rounded-xl leading-relaxed">
        Declaramos para fins pertinentes que o responsável legal tomou inequívoca e integral ciência de todas as pactuações acadêmicas, metas psicossociais e flexibilizações escolares previstas no Plano Educacional Individualizado (PEI) do estudante, comprometendo-se em acompanhar o percurso correlato.
      </div>
    </div>
  );
};

export const AttendanceTermForm = ({ formData, setFormData, student }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
        <h4 className="font-bold text-orange-955 flex items-center gap-2">
          <CalendarIcon size={18} /> Dados do Comparecimento no Setor AEE
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Nome do Responsável Legal Presente</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-450" placeholder="Ex: Maria das Dores de Souza" value={formData.guardianName || ''} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1 text-orange-700 font-bold">Data do Comparecimento</label>
            <input type="date" required className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Horário de Atendimento / Saída das Dependências</label>
            <input type="time" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.time || ''} onChange={(e) => setFormData({...formData, time: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Objetivo / Assunto Tratado na Reunião</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="Ex: Alinhamento de Metas de Autoliderança e apresentação do PEI" value={formData.topic || ''} onChange={(e) => setFormData({...formData, topic: e.target.value})} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AeeCommitmentTermForm = ({ formData, setFormData, student }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
        <h4 className="font-bold text-orange-950 flex items-center gap-2">
          <User size={18} /> Dados Complementares do Responsável
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Nome Completo do Responsável</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="Nome do representante legal" value={formData.guardianName || ''} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">CPF do Responsável</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.guardianCpf || ''} onChange={(e) => setFormData({...formData, guardianCpf: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">RG do Responsável</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.guardianRg || ''} onChange={(e) => setFormData({...formData, guardianRg: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Celular / Contato Útil</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm placeholder-gray-400" placeholder="(81) 90000-0000" value={formData.guardianPhone || ''} onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm border-gray-100">
        <h4 className="font-bold text-gray-700 border-b pb-1">Sala de Recursos e Cronograma de Atendimento</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Tipo de Ambiente Multifuncional</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.roomType || 'Sala de Recursos Multifuncionais (SRM)'} onChange={(e) => setFormData({...formData, roomType: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Diagnóstico Declarado / Necessidades Específicas</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" value={formData.nee || ''} onChange={(e) => setFormData({...formData, nee: e.target.value})} placeholder="Ex: TEA Leve CID F84" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Dia da Semana Designado</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="Ex: Terças-feiras" value={formData.weekday || ''} onChange={(e) => setFormData({...formData, weekday: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Horário Previsto (Contraturno)</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="Ex: 14:00 às 15:00" value={formData.time || ''} onChange={(e) => setFormData({...formData, time: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Breve Descrição do Motivo do Atendimento Especializado</label>
            <textarea rows={2} className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="Descreva o foco inicial no AEE" value={formData.reason || ''} onChange={(e) => setFormData({...formData, reason: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-orange-50/40 space-y-4">
        <h4 className="font-bold text-orange-950 border-b pb-1">Responsabilidades para Entrada, Permanência e Retirada</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Pactuação de Atendimento AEE</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Sim" name="authAee" checked={formData.authAee === 'Sim'} onChange={() => setFormData({...formData, authAee: 'Sim'})} />
                <span>Sim, autorizo e me comprometo com os horários</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Não" name="authAee" checked={formData.authAee === 'Não'} onChange={() => setFormData({...formData, authAee: 'Não'})} />
                <span>Não autorizo atendimento de contraturno AEE</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Forma de Retirada do Aluno</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Acompanhado" name="pickupMode" checked={formData.pickupMode === 'Acompanhado'} onChange={() => setFormData({...formData, pickupMode: 'Acompanhado'})} />
                <span>Retirado por acompanhante autorizado</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" value="Desacompanhado" name="pickupMode" checked={formData.pickupMode === 'Desacompanhado'} onChange={() => setFormData({...formData, pickupMode: 'Desacompanhado'})} />
                <span>Autorizado a ir para casa desacompanhado(a)</span>
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Nome(s) Completo(s) de Acompanhantes Autorizados a Retirar</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400" placeholder="Insira nomes e parentescos separados por vírgula" disabled={formData.pickupMode !== 'Acompanhado'} value={formData.pickupCompanion || ''} onChange={(e) => setFormData({...formData, pickupCompanion: e.target.value})} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AeeRefusalTermForm = ({ formData, setFormData, student }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4">
        <h4 className="font-bold text-red-900 flex items-center gap-2">
          <FileWarning size={18} /> Dados do Responsável pela Recusa
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Nome Completo do Responsável Legal</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-red-500 outline-none text-sm placeholder-gray-400" placeholder="Nome Completo" value={formData.guardianName || ''} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">CPF do Responsável</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="000.000.000-00" value={formData.guardianCpf || ''} onChange={(e) => setFormData({...formData, guardianCpf: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">RG do Responsável</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="Ex: 000.000 SSP/PE" value={formData.guardianRg || ''} onChange={(e) => setFormData({...formData, guardianRg: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-500 uppercase mb-1 text-red-800 font-bold">Justificativa Declarada para Recusa do AEE</label>
            <textarea rows={3} required className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-sm placeholder-gray-400 bg-white" placeholder="Escreva detalhadamente a justificativa compartilhada pelo responsável" value={formData.refusalReason || ''} onChange={(e) => setFormData({...formData, refusalReason: e.target.value})} />
          </div>
        </div>
      </div>
      <div className="p-4 bg-red-100/30 text-xs text-red-900 border border-red-200/50 rounded-xl leading-relaxed">
        <strong>Aviso de Implicações Legais:</strong> Declaro que a equipe do SESI/PE recomendou e se dispôs a realizar o Atendimento Educacional Especializado (AEE), e que decidi voluntariamente recusá-lo. Compreendo que a recusa exime a instituição da execução das atividades próprias do AEE de contraturno multifuncional e isenta a unidade escolar de responsabilidades diretas sobre a não participação no percurso correlato.
      </div>
    </div>
  );
};

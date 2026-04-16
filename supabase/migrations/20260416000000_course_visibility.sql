-- 1. Permite leitura pública das instituições (necessário para o dropdown de cadastro)
DROP POLICY IF EXISTS "Institutions are viewable by authenticated users" ON public.institutions;
CREATE POLICY "Institutions are viewable by everyone" 
ON public.institutions FOR SELECT 
USING ( true );

-- 2. Cria tabela de vínculo entre cursos e instituições (Múltiplas instituições por curso)
CREATE TABLE IF NOT EXISTS public.course_institutions (
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, institution_id)
);

-- 3. Habilita RLS na nova tabela
ALTER TABLE public.course_institutions ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de RLS para a tabela de vínculo
CREATE POLICY "Course institutions are viewable by everyone" 
ON public.course_institutions FOR SELECT 
USING ( true );

-- 5. Função para vincular cursos existentes a todas as instituições (Migração de dados)
INSERT INTO public.course_institutions (course_id, institution_id)
SELECT c.id, i.id 
FROM public.courses c, public.institutions i
ON CONFLICT DO NOTHING;

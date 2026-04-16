import { getInstitutionalStats, getCourseEngagement } from "@/features/admin/analytics-actions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  UsersIcon, 
  GraduationCapIcon, 
  AlertTriangleIcon, 
  AwardIcon,
  BarChart3Icon,
  DownloadIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalyticsCharts } from "@/features/admin/components/AnalyticsCharts";

export default async function AnalyticsPage() {
  const { data: stats, error } = await getInstitutionalStats();
  const { data: chartData } = await getCourseEngagement();

  if (error || !stats) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">{error || "Erro ao carregar dados"}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & BI</h1>
          <p className="text-muted-foreground">Monitoramento de desempenho institucional.</p>
        </div>
        <Button variant="outline">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Exportar Relatório CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Servidores Ativos</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Cadastrados na Instituição</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Matrículas Totais</CardTitle>
            <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Em todos os cursos</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Certificados Emitidos</CardTitle>
            <AwardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificatesIssued}</div>
            <p className="text-xs text-success text-green-600 font-semibold">100% Autênticos</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-destructive/5 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-destructive">Luz Vermelha</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.redLightCount}</div>
            <p className="text-xs text-destructive/70 italic font-medium">Atenção Pedagógica Necessária</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle>Engajamento por Curso</CardTitle>
            <CardDescription>Número de matrículas ativas por treinamento.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AnalyticsCharts data={chartData || []} />
          </CardContent>
        </Card>

        <Card className="border-none shadow-md flex flex-col items-center justify-center p-8 bg-primary/5 text-center">
           <BarChart3Icon className="h-16 w-16 text-primary/20 mb-4" />
           <h3 className="text-lg font-bold">Relatórios Detalhados</h3>
           <p className="text-sm text-muted-foreground mb-6">
             Gere planilhas completas com o histórico de cada servidor para auditorias do TCE.
           </p>
           <Button className="w-full">Gerar BI Full</Button>
        </Card>
      </div>
    </div>
  );
}
